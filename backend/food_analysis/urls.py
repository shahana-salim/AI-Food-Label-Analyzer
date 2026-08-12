from django.urls import path
from .views import FoodLabelUploadView, FoodLabelHistoryView, FoodLabelDetailView, MyAnalysisCountView, AdminFoodLabelListView

urlpatterns = [
    path("upload-label/", FoodLabelUploadView.as_view(), name="upload-label"),
    path("history/", FoodLabelHistoryView.as_view(), name="food-history"),
    path("history/<int:pk>/", FoodLabelDetailView.as_view(), name="food-detail"),
    path("my-analysis-count/",MyAnalysisCountView.as_view(),name="my-analysis-count"),
    path("admin/analyses/",AdminFoodLabelListView.as_view(),name="admin-analyses"),
]