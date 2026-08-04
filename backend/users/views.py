from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from .serializers import RegisterSerializer, LoginSerializer,UserProfileSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.generics import RetrieveUpdateAPIView
from rest_framework.permissions import IsAuthenticated

@api_view(['GET'])
def hello_api(request):
    return Response({
        "message": "Backend is working successfully!"
    })

@api_view(['POST'])
def register_user(request):

    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()

        return Response(
            {
                "message": "User registered successfully."
            },
            status=status.HTTP_201_CREATED
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )

@api_view(['POST'])
def login_user(request):

    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():

        user = serializer.validated_data['user']

        refresh = RefreshToken.for_user(user)

        return Response(
            {
                "message": "Login successful.",
                "access": str(refresh.access_token),
                "refresh": str(refresh)
            },
            status=status.HTTP_200_OK
        )

    return Response(
        serializer.errors,
        status=status.HTTP_400_BAD_REQUEST
    )


class UserProfileView(RetrieveUpdateAPIView):
    serializer_class = UserProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user