
import time

from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.generics import ListAPIView, RetrieveAPIView
from .models import FoodLabel

from .utils import extract_text_from_image, clean_extracted_text
from .ai_service import analyze_food_label,analyze_food_label_direct
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
            # OCR PROCESSING
            # -------------------------

            ocr_start = time.time()

            combined_text = ""

            for image in images:

                ocr_text = extract_text_from_image(image)

                clean_text = clean_extracted_text(ocr_text)

                combined_text += clean_text + "\n\n"

            print("OCR TIME:", time.time() - ocr_start)

            # -------------------------
            # AI ANALYSIS
            # -------------------------

            gemini_start = time.time()

            analysis = analyze_food_label(
                combined_text,
                request.user,
                images,
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
    


class DirectGeminiAnalysisView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        images = request.FILES.getlist("images")

        if not images:
            return Response(
                {"error": "Please upload at least one image."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        print(f"\nDirect Gemini Analysis")
        print(f"Images received: {len(images)}")

        start_time = time.perf_counter()

        analysis = analyze_food_label_direct(
            images=images,
            user=request.user
        )

        end_time = time.perf_counter()

        analysis_time = end_time - start_time

        print(f"Gemini analysis time: {analysis_time:.2f} seconds\n")

        if "error" in analysis:
            return Response(
                analysis,
                status=status.HTTP_400_BAD_REQUEST,
            )

        return Response(
            {
                "analysis": analysis,
                "analysis_time": round(analysis_time, 2),
                "images_analyzed": len(images),
            },
            status=status.HTTP_200_OK,
        )