from django.db import models

from django.contrib.auth.models import User
from django.db import models
import uuid

class UserProfile(models.Model):
    ROLE_CHOICES = (
        ("admin", "Admin"),
        ("doctor", "Doctor"),
        ("patient", "Patient"),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default="patient")
    access_key = models.UUIDField(default=uuid.uuid4, unique=True)
    dataset_patient_id = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.username} - {self.role}"

from django.db.models.signals import post_save
from django.dispatch import receiver

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        UserProfile.objects.create(user=instance)

class DoctorPatientMapping(models.Model):
    doctor = models.ForeignKey(User, on_delete=models.CASCADE, related_name="doctor")
    patient = models.ForeignKey(User, on_delete=models.CASCADE, related_name="patient")

    def __str__(self):
        return f"Doctor {self.doctor_id} -> Patient {self.patient_id}"