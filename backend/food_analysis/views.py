from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import FoodLabel
from .serializers import FoodLabelSerializer


class FoodLabelUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = FoodLabelSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save(user=request.user)

            return Response(
                {
                    "message": "Food label uploaded successfully.",
                    "data": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)