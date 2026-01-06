from vitals.models import PatientVital
from vitals.blockchain import anchor_record_hash

def anchor_unanchored_records(limit=10):
    records = PatientVital.objects.filter(blockchain_tx__isnull=True)[:limit]

    for record in records:
        tx_hash = anchor_record_hash(
            transaction_id=str(record.id),
            record_hash=record.record_hash
        )

        record.blockchain_tx = tx_hash
        record.save()
