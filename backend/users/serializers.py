from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import UserProfile


class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'email',
            'first_name',
            'last_name',
            'password',
            'confirm_password'
        ]
        extra_kwargs = {
            'password': {
                'write_only': True
            },
            'first_name': {
                'required': True
            },
            'last_name': {
                'required': True
            },
            'email': {
                'required': True
            }
        }

    def validate(self, data):

        first_name = data.get('first_name', '').strip()
        last_name = data.get('last_name', '').strip()
        email = data.get('email', '').strip()
        password = data.get('password', '')
        confirm_password = data.get('confirm_password', '')

        # First name validation
        if not first_name:
            raise serializers.ValidationError(
                {"first_name": "First name is required."}
            )

        if len(first_name) < 2:
            raise serializers.ValidationError(
                {"first_name": "First name must be at least 2 characters long."}
            )

        if not first_name.replace(" ", "").isalpha():
            raise serializers.ValidationError(
                {"first_name": "First name can contain only letters and spaces."}
            )

        # Last name validation
        if not last_name:
            raise serializers.ValidationError(
                {"last_name": "Last name is required."}
            )

        if len(last_name) < 2:
            raise serializers.ValidationError(
                {"last_name": "Last name must be at least 2 characters long."}
            )

        if not last_name.replace(" ", "").isalpha():
            raise serializers.ValidationError(
                {"last_name": "Last name can contain only letters and spaces."}
            )

        # Email validation
        if not email:
            raise serializers.ValidationError(
                {"email": "Email is required."}
            )

        # Check whether email already exists
        if User.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError(
                {"email": "Email is already registered."}
            )

        # Password validation
        if not password:
            raise serializers.ValidationError(
                {"password": "Password is required."}
            )

        if len(password) < 8:
            raise serializers.ValidationError(
                {"password": "Password must be at least 8 characters long."}
            )

        if not any(char.isupper() for char in password):
            raise serializers.ValidationError(
                {"password": "Password must contain at least one uppercase letter."}
            )

        if not any(char.islower() for char in password):
            raise serializers.ValidationError(
                {"password": "Password must contain at least one lowercase letter."}
            )

        if not any(char.isdigit() for char in password):
            raise serializers.ValidationError(
                {"password": "Password must contain at least one number."}
            )

        if not any(not char.isalnum() for char in password):
            raise serializers.ValidationError(
                {"password": "Password must contain at least one special character."}
            )

        # Confirm password validation
        if not confirm_password:
            raise serializers.ValidationError(
                {"confirm_password": "Please confirm your password."}
            )

        if password != confirm_password:
            raise serializers.ValidationError(
                {"password": "Passwords do not match."}
            )

        # Store cleaned values
        data['first_name'] = first_name
        data['last_name'] = last_name
        data['email'] = email

        return data

    def create(self, validated_data):
        validated_data.pop('confirm_password')

        email = validated_data['email']

        user = User.objects.create_user(
            username=email,
            email=email,
            password=validated_data['password'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )

        return user
    
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        email = data.get('email')
        password = data.get('password')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError(
                {"email": "Invalid email or password."}
            )

        user = authenticate(
            username=user.username,
            password=password
        )

        if user is None:
            raise serializers.ValidationError(
                {"email": "Invalid email or password."}
            )

        data['user'] = user
        return data

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [
            "username",
            "email",
            "first_name",
            "last_name",
        ]

class HealthPreferenceSerializer(serializers.ModelSerializer):

    class Meta:
        model = UserProfile
        fields = [
            "allergies",
            "other_allergy",
            "dietary_preference",
            "medical_conditions",
            "other_medical_condition",
        ]