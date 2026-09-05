from django.urls import path
from .views import FoodLabelUploadView, FoodLabelHistoryView, FoodLabelDetailView, MyAnalysisCountView, CompareProductsView,AdminFoodLabelListView,CompareUploadView

urlpatterns = [
    path("upload-label/", FoodLabelUploadView.as_view(), name="upload-label"),
    path("history/", FoodLabelHistoryView.as_view(), name="food-history"),
    path("history/<int:pk>/", FoodLabelDetailView.as_view(), name="food-detail"),
    path("my-analysis-count/",MyAnalysisCountView.as_view(),name="my-analysis-count"),
    path(
    "compare/",
    CompareProductsView.as_view(),
    name="compare-products"
    ),
    path(
    "compare-upload/",
    CompareUploadView.as_view(),
    name="compare-upload",
    ),
    path("admin/analyses/",AdminFoodLabelListView.as_view(),name="admin-analyses"),
]