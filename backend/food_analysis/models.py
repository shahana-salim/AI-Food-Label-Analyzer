from django.db import models
from django.contrib.auth.models import User


class FoodLabel(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    image = models.ImageField(
        upload_to="food_labels/"
    )

    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ["-uploaded_at"]

    def __str__(self):
        return f"{self.user.email} - {self.uploaded_at}"