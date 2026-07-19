from django.contrib.auth.models import User
from rest_framework import serializers
from django.contrib.auth import authenticate


class RegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = [
            'email',
            'password',
            'confirm_password'
        ]
        extra_kwargs = {
            'password': {
                'write_only': True
            }
        }

    def validate(self, data):
        # Check whether both passwords match
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError(
                {"password": "Passwords do not match."}
            )

        # Check whether the email already exists
        if User.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError(
                {"email": "Email is already registered."}
            )

        return data

    def create(self, validated_data):
        # Remove confirm_password as it is not a database field
        validated_data.pop('confirm_password')

        email = validated_data['email']

        user = User.objects.create_user(
            username=email,
            email=email,
            password=validated_data['password']
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