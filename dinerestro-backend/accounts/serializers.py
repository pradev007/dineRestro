from rest_framework import serializers
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True, min_length = 8)

    class Meta:
        model = CustomUser
        fields = ['id','email','fullname', 'password']

    def create(self,validated_data):
        user = CustomUser.objects.create_user(
            email = validated_data['email'],
            fullname = validated_data['fullname'],
            password = validated_data['password'],

        )
        return user