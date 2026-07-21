from django.urls import path
from .views import FoodLabelUploadView

urlpatterns = [
    path("upload-label/", FoodLabelUploadView.as_view(), name="upload-label"),
]