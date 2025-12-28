from django.urls import path
from .views import get_patient_data

urlpatterns = [
    path("patient/<int:patient_id>/", get_patient_data),
]
