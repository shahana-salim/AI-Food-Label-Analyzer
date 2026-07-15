from django.urls import path
from . import views

urlpatterns = [
    path('hello/', views.hello_api),
    path('register/', views.register_user),
    path('login/', views.login_user),
]