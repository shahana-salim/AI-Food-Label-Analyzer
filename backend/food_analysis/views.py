from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .utils import extract_text_from_image, clean_extracted_text
from .ai_service import analyze_food_label

from .models import FoodLabel
from .serializers import FoodLabelSerializer,FoodLabelHistorySerializer

from rest_framework.generics import ListAPIView,RetrieveAPIView
from rest_framework.permissions import IsAuthenticated


class FoodLabelUploadView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):

        serializer = FoodLabelSerializer(data=request.data)

        if serializer.is_valid():
            if request.user.is_authenticated:
               food_label = serializer.save(user=request.user)
            else:
               food_label = serializer.save()
            ocr_text = extract_text_from_image(food_label.image.path)
            clean_text = clean_extracted_text(ocr_text)
            analysis = analyze_food_label(clean_text)

            food_label.analysis = analysis
            food_label.save()

            return Response(
                {
                    "message": "Food label uploaded successfully.",
                    "data": serializer.data,
                    "extracted_text": clean_text,
                    "analysis": analysis,
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class FoodLabelHistoryView(ListAPIView):
    serializer_class = FoodLabelHistorySerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        print("Authenticated:", self.request.user.is_authenticated)
        print("User:", self.request.user)

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