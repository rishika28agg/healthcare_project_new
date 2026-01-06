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
            "body_temperature": r.body_temperature
        })

    return Response(data)

from rest_framework.decorators import api_view
from rest_framework.response import Response

@api_view(["GET"])
def health_check(request):
    return Response({"status": "Backend running"})

from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import PatientVital
from vitals.services.verify_integrity import verify_record_integrity
from vitals.blockchain import contract

@api_view(["GET"])
def verify_record(request, record_id):
    try:
        record = PatientVital.objects.get(id=record_id)

        db_hash = record.record_hash
        blockchain_hash = contract.functions.getRecordHash(
            str(record.id)
        ).call()

        integrity = verify_record_integrity(str(record.id), db_hash)

        return Response({
            "record_id": record.id,
            "db_hash": db_hash,
            "blockchain_hash": blockchain_hash,
            "integrity": integrity
        })

    except PatientVital.DoesNotExist:
        return Response(
            {"error": "Record not found"},
            status=404
        )

