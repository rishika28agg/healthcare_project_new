from vitals.blockchain import contract

def verify_record_integrity(transaction_id: str, local_hash: str) -> bool:
    """
    Verifies whether the local record hash matches the blockchain hash.
    """
    on_chain_hash = contract.functions.getRecordHash(transaction_id).call()
    return on_chain_hash == local_hash
