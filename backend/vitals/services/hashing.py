import hashlib

def compute_record_hash(record):
    """
    Deterministically computes SHA-256 hash for a patient record.
    """

    data_string = (
        f"{record.patient_id}|"
        f"{record.timestamp.replace(microsecond=0).isoformat()}|"
        f"{record.heart_rate}|"
        f"{record.spo2}|"
        f"{record.body_temperature}"
    )

    return hashlib.sha256(data_string.encode()).hexdigest()
