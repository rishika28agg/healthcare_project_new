from rest_framework.decorators import api_view
from rest_framework.response import Response
from vitals.models import PatientVital

@api_view(["GET"])
def get_patient_data(request, patient_id):
    records = PatientVital.objects.filter(patient_id=patient_id).order_by("timestamp")

    data = []
    for r in records:
        data.append({
            "timestamp": r.timestamp,
            "heart_rate": r.heart_rate,
            "spo2": r.spo2,
            "body_temperature": r.body_temperature,
            "transaction_id": r.transaction_id
        })

    return Response(data)
