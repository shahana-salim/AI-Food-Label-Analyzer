
import time

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from .models import FoodLabel
from .ai_service import analyze_food_label
from rest_framework.permissions import IsAdminUser

from .models import FoodLabel
from .serializers import (
    FoodLabelSerializer,
    FoodLabelHistorySerializer,
    AdminFoodLabelSerializer,
)


class FoodLabelUploadView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        images = request.FILES.getlist("images")

        if not images:
            return Response(
                {"error": "No images uploaded."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        data = request.data.copy()
        data["image"] = images[0]

        serializer = FoodLabelSerializer(data=data)

        if serializer.is_valid():

           # -------------------------
           # AI ANALYSIS
           # -------------------------

            gemini_start = time.time()

            analysis = analyze_food_label(
                user=request.user,
                images=images,
            )

            print("GEMINI TIME:", time.time() - gemini_start)

            # -------------------------
            # HANDLE AI ERRORS
            # -------------------------

            if "error" in analysis:

                if analysis["error"] == (
                    "The uploaded image does not appear to be a packaged food label. "
                    "Please upload a clear image of a packaged food package."
                ):
                    return Response(
                        analysis,
                        status=status.HTTP_400_BAD_REQUEST,
                    )

                return Response(
                    analysis,
                    status=status.HTTP_503_SERVICE_UNAVAILABLE,
                )

            # -------------------------
            # SAVE ONLY AFTER ANALYSIS
            # -------------------------

            if request.user.is_authenticated:
                food_label = serializer.save(user=request.user)
            else:
                food_label = serializer.save()

            food_label.analysis = analysis
            food_label.save()

            return Response(
                {
                    "message": "Food label uploaded successfully.",
                    "data": FoodLabelSerializer(food_label).data,
                    "analysis": analysis,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )
class FoodLabelHistoryView(ListAPIView):
    serializer_class = FoodLabelHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        print(
            "Authenticated:",
            self.request.user.is_authenticated
        )

        print(
            "User:",
            self.request.user
        )

        return FoodLabel.objects.filter(
            user=self.request.user
        ).order_by("-uploaded_at")


class FoodLabelDetailView(RetrieveAPIView):
    serializer_class = FoodLabelHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):

        return FoodLabel.objects.filter(
            user=self.request.user
        )


class MyAnalysisCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        count = FoodLabel.objects.filter(
            user=request.user
        ).count()

        return Response({
            "total_analyses": count
        })



class AdminFoodLabelListView(ListAPIView):
    serializer_class = AdminFoodLabelSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return FoodLabel.objects.all().order_by("-uploaded_at")
    

