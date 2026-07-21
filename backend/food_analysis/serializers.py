from rest_framework import serializers
from .models import FoodLabel


class FoodLabelSerializer(serializers.ModelSerializer):
    class Meta:
        model = FoodLabel
        fields = "__all__"
        read_only_fields = ["user", "uploaded_at"]