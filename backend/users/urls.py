from django.urls import path
from . import views

urlpatterns = [
    path('hello/', views.hello_api),
    path('register/', views.register_user),
    path('login/', views.login_user),
    path("profile/", views.UserProfileView.as_view(), name="profile"),
    path("health-preferences/",views.HealthPreferenceView.as_view(),name="health-preferences"),
    path("change-password/", views.ChangePasswordView.as_view()),
    path( "admin/dashboard/", views.AdminDashboardView.as_view(),name="admin-dashboard"),
    path("admin/users/",views.AdminUsersView.as_view(),name="admin-users"),
]