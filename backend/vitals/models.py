from django.db import models

class PatientVital(models.Model):
    patient_id = models.IntegerField()
    heart_rate = models.IntegerField()
    spo2 = models.IntegerField()
    body_temperature = models.FloatField()
    timestamp = models.DateTimeField()

    # NEW FIELDS
    record_hash = models.CharField(max_length=66)
    blockchain_tx = models.CharField(
        max_length=66,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"Patient {self.patient_id} @ {self.timestamp}"


