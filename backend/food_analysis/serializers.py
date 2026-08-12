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



class AdminFoodLabelSerializer(serializers.ModelSerializer):
    user_email = serializers.SerializerMethodField()
    user_name = serializers.SerializerMethodField()
    product_name = serializers.SerializerMethodField()

    class Meta:
        model = FoodLabel
        fields = [
            "id",
            "user_email",
            "user_name",
            "product_name",
            "uploaded_at",
            "analysis",
        ]

    def get_user_email(self, obj):
        if obj.user:
            return obj.user.email
        return "Guest"

    def get_user_name(self, obj):
        if obj.user:
            full_name = f"{obj.user.first_name} {obj.user.last_name}".strip()
            return full_name if full_name else obj.user.email
        return "Guest"

    def get_product_name(self, obj):
        if obj.analysis:
            return obj.analysis.get("product_name")
        return None