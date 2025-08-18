from django.contrib.auth.models import BaseUserManager

class CustomUserManager(BaseUserManager):
    def create_user(self, email, fullname, password, **extra_fields):
        if not email:
            raise ValueError("email is required")
        if not fullname:
            raise ValueError("fullname cannot be empty")
        email = self.normalize_email(email)
        user = self.model(email=email,fullname=fullname ,**extra_fields)
        user.set_password(password)
        user.save()
        return user
    
    def create_superuser(self,email,fullname,password,**extra_fields):
        extra_fields.setdefault('is_staff',True)
        extra_fields.setdefault('is_superuser',True)
        extra_fields.setdefault('is_active',True)

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_("Superuser must have is_staff = True"))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Super user must have is_superuser = True'))
        return self.create_user(email,fullname,password,**extra_fields)