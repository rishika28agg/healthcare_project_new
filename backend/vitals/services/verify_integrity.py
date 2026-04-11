def verify_record_integrity(record_id, stored_hash):
    from vitals.models import PatientVital
    from vitals.blockchain import contract
    from vitals.services.hashing import compute_record_hash

    record = PatientVital.objects.get(id=record_id)

    # 🔥 recompute hash
    recomputed_hash = compute_record_hash(record)

    # get blockchain hash
    blockchain_hash = contract.functions.getRecordHash(str(record.id)).call()

    return recomputed_hash == blockchain_hash

