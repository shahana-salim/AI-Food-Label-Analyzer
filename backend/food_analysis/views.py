
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


class CompareProductsView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        product1_id = request.data.get("product1_id")
        product2_id = request.data.get("product2_id")

        if not product1_id or not product2_id:
            return Response(
                {"error": "Please select two products to compare."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if product1_id == product2_id:
            return Response(
                {"error": "Please select two different products."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            product1 = FoodLabel.objects.get(
                id=product1_id,
                user=request.user
            )

            product2 = FoodLabel.objects.get(
                id=product2_id,
                user=request.user
            )

        except FoodLabel.DoesNotExist:
            return Response(
                {"error": "One or both selected products were not found."},
                status=status.HTTP_404_NOT_FOUND,
            )

        def get_comparison_data(product):
            analysis = product.analysis or {}

            return {
                "id": product.id,
                "image": product.image.url if product.image else None,
                "product_name": analysis.get(
                    "product_name",
                    "Not Available"
                ),
                "ingredients": analysis.get(
                    "ingredients",
                    []
                ),
                "additives": analysis.get(
                    "additives",
                    []
                ),
                "allergens": analysis.get(
                    "allergens",
                    []
                ),
                "nutrition_summary": analysis.get(
                    "nutrition_summary",
                    "Not Available"
                ),
                "personalized_assessment": analysis.get(
                    "personalized_assessment",
                    {}
                ),
            }

        return Response(
            {
                "product1": get_comparison_data(product1),
                "product2": get_comparison_data(product2),
            },
            status=status.HTTP_200_OK,
        )

class CompareUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        product1_image = request.FILES.get("product1_image")
        product2_image = request.FILES.get("product2_image")

        if not product1_image or not product2_image:
            return Response(
                {
                    "error": "Please upload images for both products."
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        # -------------------------
        # ANALYZE PRODUCT 1
        # -------------------------

        product1_analysis = analyze_food_label(
            user=request.user,
            images=[product1_image],
        )

        if "error" in product1_analysis:
            return Response(
                {
                    "error": "Unable to analyze Product 1.",
                    "product1_error": product1_analysis["error"],
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        # -------------------------
        # ANALYZE PRODUCT 2
        # -------------------------

        product2_analysis = analyze_food_label(
            user=request.user,
            images=[product2_image],
        )

        if "error" in product2_analysis:
            return Response(
                {
                    "error": "Unable to analyze Product 2.",
                    "product2_error": product2_analysis["error"],
                },
                status=status.HTTP_503_SERVICE_UNAVAILABLE,
            )

        # -------------------------
        # RETURN COMPARISON DATA
        # -------------------------

        return Response(
            {
                "product1": product1_analysis,
                "product2": product2_analysis,
            },
            status=status.HTTP_200_OK,
        )

class AdminFoodLabelListView(ListAPIView):
    serializer_class = AdminFoodLabelSerializer
    permission_classes = [IsAdminUser]

    def get_queryset(self):
        return FoodLabel.objects.all().order_by("-uploaded_at")
    

