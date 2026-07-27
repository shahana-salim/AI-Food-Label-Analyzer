from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .utils import extract_text_from_image, clean_extracted_text
from .ai_service import analyze_food_label

from .models import FoodLabel
from .serializers import FoodLabelSerializer


class FoodLabelUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = FoodLabelSerializer(data=request.data)

        if serializer.is_valid():
            food_label = serializer.save(user=request.user)
            ocr_text = extract_text_from_image(food_label.image.path)
            clean_text = clean_extracted_text(ocr_text)
            analysis = analyze_food_label(clean_text)
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
