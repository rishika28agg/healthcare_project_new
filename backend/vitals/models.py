from django.db import models

class PatientVital(models.Model):
    timestamp = models.DateTimeField()
    patient_id = models.IntegerField()
    heart_rate = models.IntegerField()
    spo2 = models.FloatField()
    body_temperature = models.FloatField()
    transaction_id = models.CharField(max_length=64, unique=True)

    def __str__(self):
        return f"Patient {self.patient_id} @ {self.timestamp}"
