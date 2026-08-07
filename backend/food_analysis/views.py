from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView
from .utils import extract_text_from_image, clean_extracted_text
from .ai_service import (analyze_food_label)

from .models import FoodLabel
from .serializers import FoodLabelSerializer,FoodLabelHistorySerializer

from rest_framework.generics import ListAPIView,RetrieveAPIView
from rest_framework.permissions import IsAuthenticated


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

            if request.user.is_authenticated:
                food_label = serializer.save(user=request.user)
            else:
                food_label = serializer.save()

            combined_text = ""

            for image in images:

                ocr_text = extract_text_from_image(image)

                clean_text = clean_extracted_text(ocr_text)

                combined_text += clean_text + "\n\n"

            analysis = analyze_food_label(
                combined_text,
                request.user,
            )
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
            
            food_label.analysis = analysis
            food_label.save()

            return Response(
                {
                    "message": "Food label uploaded successfully.",
                    "data": serializer.data,
                    "extracted_text": combined_text,
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