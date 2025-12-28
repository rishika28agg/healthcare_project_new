import csv
from django.core.management.base import BaseCommand
from vitals.models import PatientVital
from datetime import datetime

class Command(BaseCommand):
    help = "Load patient data from CSV"

    def handle(self, *args, **kwargs):
        with open("patients_data_final.csv", "r") as file:
            reader = csv.DictReader(file)

            for row in reader:
                PatientVital.objects.create(
                    timestamp=datetime.fromisoformat(
                        row["Timestamp"].replace("Z", "+00:00")
                    ),
                    patient_id=int(row["Patient_ID"]),
                    heart_rate=int(row["heart_rate_(bpm)"]),
                    spo2=float(row["spo2_level_(%)"]),
                    body_temperature=float(row["body_temperature_(Â°f)"]),
                    transaction_id=row["transaction_ID"],
                )

        self.stdout.write("CSV loaded successfully")
