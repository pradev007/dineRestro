from django.db import models
from django.contrib.auth.models import AbstractBaseUser , PermissionsMixin
# Create your models here.
from django.utils import timezone
from .managers import CustomUserManager
from django.utils.translation import gettext_lazy as _


class CustomUser(AbstractBaseUser,PermissionsMixin):
    email = models.EmailField(_("email address"), unique=True)
    fullname = models.CharField(_("fullname"), max_length=50)
    is_staff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['fullname']

    objects = CustomUserManager()

    def __str__(self):
        return self.fullname