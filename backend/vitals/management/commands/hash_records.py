import hashlib
from django.core.management.base import BaseCommand
from vitals.models import PatientVital

class Command(BaseCommand):
    help = "Generate SHA-256 hash for each patient record"

    def handle(self, *args, **kwargs):
        records = PatientVital.objects.all()

        self.stdout.write(f"Hashing {records.count()} records...")

        for record in records:
            data_string = (
                f"{record.patient_id}|"
                f"{record.timestamp.isoformat()}|"
                f"{record.heart_rate}|"
                f"{record.spo2}|"
                f"{record.body_temperature}|"
                f"{record.transaction_id}"
            )

            record_hash = hashlib.sha256(data_string.encode()).hexdigest()

            # For now, just print first few hashes
            if record.id <= 5:
                self.stdout.write(
                    f"TX_ID: {record.transaction_id} → HASH: {record_hash}"
                )

        self.stdout.write("Hash generation completed.")
