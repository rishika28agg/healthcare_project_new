from django.urls import path
from .views import get_patient_records, health_check

urlpatterns = [
    path("health/", health_check),
    path("patient/<int:patient_id>/", get_patient_records),
]

from .views import verify_record

urlpatterns += [
    path("verify/<int:record_id>/", verify_record),
]
