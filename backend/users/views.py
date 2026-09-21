from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer, UserProfileSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from .models import UserProfile
from .serializers import HealthPreferenceSerializer
from rest_framework.views import APIView
from django.db.models import Count

from django.contrib.auth.models import User
from food_analysis.models import FoodLabel

from django.contrib.auth.tokens import default_token_generator
from django.core.mail import send_mail
from django.conf import settings
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes


@api_view(["GET"])
def hello_api(request):
    return Response({"message": "Backend is working successfully!"})


@api_view(["POST"])
def register_user(request):

    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

        return Response(
            {"message": "User registered successfully."}, status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
def login_user(request):

    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():

        user = serializer.validated_data["user"]

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login successful.",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "is_staff": user.is_staff,
            },
            status=status.HTTP_200_OK,
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserProfileView(RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user


class HealthPreferenceView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = HealthPreferenceSerializer(profile)
        return Response(serializer.data)

    def put(self, request):
        profile, created = UserProfile.objects.get_or_create(user=request.user)
        serializer = HealthPreferenceSerializer(
            profile, data=request.data, partial=True
        )

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        current_password = request.data.get("current_password")
        new_password = request.data.get("new_password")
        confirm_password = request.data.get("confirm_password")

        # Check required fields
        if not current_password or not new_password or not confirm_password:
            return Response(
                {"error": "All password fields are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check current password
        if not request.user.check_password(current_password):
            return Response(
                {"error": "Current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check minimum password length
        if len(new_password) < 8:
            return Response(
                {"error": "New password must be at least 8 characters long."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Check new password confirmation
        if new_password != confirm_password:
            return Response(
                {"error": "New passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Prevent using the same password
        if current_password == new_password:
            return Response(
                {"error": "New password must be different from your current password."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        # Change password
        request.user.set_password(new_password)
        request.user.save()

        return Response(
            {"message": "Password changed successfully."}, status=status.HTTP_200_OK
        )


class ForgotPasswordView(APIView):
    permission_classes = []

    def post(self, request):

        email = request.data.get("email")

        if not email:
            return Response(
                {"error": "Email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(email=email)

        except User.DoesNotExist:
            return Response(
                {"error": "No account found with this email address."},
                status=status.HTTP_404_NOT_FOUND,
            )

        request.session["password_reset_user_id"] = user.id

        return Response(
            {
                "message": "Email verified. You can now reset your password."
            },
            status=status.HTTP_200_OK,
        )


class ResetPasswordView(APIView):
    permission_classes = []

    def post(self, request):

        user_id = request.session.get(
            "password_reset_user_id"
        )

        if not user_id:
            return Response(
                {"error": "Please verify your email first."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        password = request.data.get("password")
        confirm_password = request.data.get("confirm_password")

        if not password or not confirm_password:
            return Response(
                {"error": "Both password fields are required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if len(password) < 8:
            return Response(
                {"error": "Password must be at least 8 characters long."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not any(char.isupper() for char in password):
            return Response(
                {"error": "Password must contain at least one uppercase letter."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not any(char.islower() for char in password):
            return Response(
                {"error": "Password must contain at least one lowercase letter."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not any(char.isdigit() for char in password):
            return Response(
                {"error": "Password must contain at least one number."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not any(char in '!@#$%^&*(),.?":{}|<>' for char in password):
            return Response(
                {"error": "Password must contain at least one special character."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if password != confirm_password:
            return Response(
                {"error": "Passwords do not match."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            user = User.objects.get(pk=user_id)

        except User.DoesNotExist:
            return Response(
                {"error": "User account not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        user.set_password(password)
        user.save()

        # Clear reset session after successful password change
        request.session.pop(
            "password_reset_user_id",
            None
        )

        return Response(
            {
                "message": "Password reset successfully."
            },
            status=status.HTTP_200_OK,
        )


class ChangeEmailView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):

        new_email = request.data.get("email")
        current_password = request.data.get("current_password")

        if not new_email:
            return Response(
                {"error": "New email is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not current_password:
            return Response(
                {"error": "Current password is required."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        new_email = new_email.strip().lower()

        if not request.user.check_password(current_password):
            return Response(
                {"error": "Current password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if User.objects.filter(email=new_email).exclude(
            id=request.user.id
        ).exists():
            return Response(
                {"error": "An account with this email already exists."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        request.user.email = new_email
        request.user.username = new_email
        request.user.save()

        return Response(
            {
                "message": "Email updated successfully.",
                "email": request.user.email,
            },
            status=status.HTTP_200_OK,
        )
class AdminDashboardView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):

        total_users = User.objects.filter(is_staff=False).count()

        total_analyses = FoodLabel.objects.count()

        guest_analyses = FoodLabel.objects.filter(user__isnull=True).count()

        registered_analyses = FoodLabel.objects.filter(user__isnull=False).count()

        # Get the 5 most recent analyses
        recent_analyses = FoodLabel.objects.select_related("user").order_by(
            "-uploaded_at"
        )[:5]

        recent_data = []

        for food_label in recent_analyses:

            analysis = food_label.analysis or {}

            recent_data.append(
                {
                    "id": food_label.id,
                    "product_name": analysis.get("product_name", "Unknown Product"),
                    "user": (food_label.user.email if food_label.user else "Guest"),
                    "type": ("Registered" if food_label.user else "Guest"),
                    "uploaded_at": food_label.uploaded_at.isoformat(),
                }
            )

        return Response(
            {
                "total_users": total_users,
                "total_analyses": total_analyses,
                "guest_analyses": guest_analyses,
                "registered_analyses": registered_analyses,
                "recent_analyses": recent_data,
            },
            status=status.HTTP_200_OK,
        )


class AdminUsersView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):

        users = (
            User.objects.filter(is_staff=False)
            .annotate(analysis_count=Count("foodlabel"))
            .order_by("-date_joined")
        )

        user_data = []

        for user in users:

            user_data.append(
                {
                    "id": user.id,
                    "email": user.email,
                    "first_name": user.first_name,
                    "last_name": user.last_name,
                    "date_joined": user.date_joined.isoformat(),
                    "analysis_count": user.analysis_count,
                }
            )

        return Response({"users": user_data}, status=status.HTTP_200_OK)
