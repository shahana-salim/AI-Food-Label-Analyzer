from django.db import models
from django.contrib.auth.models import User


class UserProfile(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )

    allergies = models.JSONField(
        default=list,
        blank=True
    )

    other_allergy = models.CharField(
        max_length=255,
        blank=True,
        default=""
    )

    dietary_preference = models.CharField(
        max_length=50,
        blank=True,
        default=""
    )

    medical_conditions = models.JSONField(
        default=list,
        blank=True
    )

    other_medical_condition = models.CharField(
        max_length=255,
        blank=True,
        default=""
    )

    def __str__(self):
        return self.user.email