from django.core.management.base import BaseCommand
from vitals.models import PatientVital
from vitals.services.hashing import compute_record_hash

class Command(BaseCommand):
    help = "Generate SHA-256 hash for each patient record"

    def handle(self, *args, **kwargs):
        records = PatientVital.objects.all()

        self.stdout.write(f"Hashing {records.count()} records...")

        for record in records:
            record.record_hash = compute_record_hash(record)
            record.save(update_fields=["record_hash"])

        self.stdout.write(self.style.SUCCESS("Hash generation completed."))

