from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from accounts.models import DoctorPatientMapping
from .models import PatientVital

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_patient_records(request, patient_id):
    user = request.user
    profile = user.userprofile
    role = profile.role

    # PATIENT access
    if role == "patient":
        if profile.dataset_patient_id != int(patient_id):
            return Response({"error": "Unauthorized"}, status=403)

    # DOCTOR access
    elif role == "doctor":
        is_assigned = DoctorPatientMapping.objects.filter(
            doctor=user,
            patient__userprofile__dataset_patient_id=patient_id
        ).exists()

        if not is_assigned:
            return Response({"error": "Access denied"}, status=403)

    # FETCH DATA (IMPORTANT CHANGE)
    records = PatientVital.objects.filter(patient_id=patient_id)

    return Response(list(records.values()))

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

