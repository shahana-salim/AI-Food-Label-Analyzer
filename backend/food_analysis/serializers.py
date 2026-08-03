from rest_framework import serializers
from .models import FoodLabel


class FoodLabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodLabel
        fields = "__all__"
        read_only_fields = ["user", "uploaded_at"]


class FoodLabelHistorySerializer(serializers.ModelSerializer):
    product_name = serializers.SerializerMethodField()

    class Meta:
        model = FoodLabel
        fields = [
            "id",
            "image",
            "product_name",
            "analysis",
            "uploaded_at",
        ]

    def get_product_name(self, obj):
        if obj.analysis:
            return obj.analysis.get("product_name")
        return None