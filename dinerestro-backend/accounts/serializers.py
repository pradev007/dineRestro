from rest_framework import serializers
from .models import CustomUser

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True, min_length = 8)

    class Meta:
        model = CustomUser
        fields = ['id','email','fullname', 'password','role']

    def create(self,validated_data):
        role = validated_data.get('role','customer')
        # prevent public "admin" registration
        if role == 'admin':
            raise serializers.ValidationError({"role":"You cannot register as admin"})
        user = CustomUser.objects.create_user(
            email = validated_data['email'],
            fullname = validated_data['fullname'],
            password = validated_data['password'],
            role = role

        )
        return user