from django.urls import path
from . import views

urlpatterns = [
    path("hello/", views.hello_api),
    path("register/", views.register_user),
    path("login/", views.login_user),
    path("profile/", views.UserProfileView.as_view(), name="profile"),
    path(
        "health-preferences/",
        views.HealthPreferenceView.as_view(),
        name="health-preferences",
    ),
    path("change-password/", views.ChangePasswordView.as_view()),
    path(
        "forgot-password/",
        views.ForgotPasswordView.as_view(),
        name="forgot-password",
    ),
    path(
        "reset-password/",
        views.ResetPasswordView.as_view(),
        name="reset-password",
    ),
    path(
        "admin/dashboard/", views.AdminDashboardView.as_view(), name="admin-dashboard"
    ),
    path("admin/users/", views.AdminUsersView.as_view(), name="admin-users"),
]
