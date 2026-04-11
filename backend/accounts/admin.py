from django.contrib import admin

from django.contrib import admin
from .models import UserProfile, DoctorPatientMapping

admin.site.register(UserProfile)
admin.site.register(DoctorPatientMapping)
