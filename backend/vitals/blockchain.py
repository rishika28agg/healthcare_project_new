from web3 import Web3
import json
import os

GANACHE_URL = "http://127.0.0.1:7545"
web3 = Web3(Web3.HTTPProvider(GANACHE_URL))

if not web3.is_connected():
    raise RuntimeError("Ganache connection failed")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
ABI_PATH = os.path.join(BASE_DIR, "contract_abi.json")

with open(ABI_PATH, "r") as f:
    contract_abi = json.load(f)

CONTRACT_ADDRESS = web3.to_checksum_address("0xA7216bAc4B34f865b093B987d19A9472eb8825a1")

contract = web3.eth.contract(
    address=CONTRACT_ADDRESS,
    abi=contract_abi
)

ANCHOR_ACCOUNT = web3.to_checksum_address(web3.eth.accounts[0])

def anchor_record_hash(transaction_id: str, record_hash: str) -> str:
    """
    Anchors an existing record hash to the blockchain.
    Assumes hashing is already completed.
    """

    try:
        tx_hash = contract.functions.storeRecordHash(
            transaction_id,
            record_hash
        ).transact({
            "from": ANCHOR_ACCOUNT,
            "gas": 300_000
        })

        receipt = web3.eth.wait_for_transaction_receipt(tx_hash)
        return receipt.transactionHash.hex()

    except Exception as e:
        raise RuntimeError(f"Blockchain anchoring failed: {str(e)}")
