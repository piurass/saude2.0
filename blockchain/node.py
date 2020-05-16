# To be installed:
# Flask==0.12.2: pip install Flask==0.12.2
# Postman HTTP Client: https://www.getpostman.com/
# requests==2.18.4: pip install requests==2.18.4

# Importing the libraries
import datetime
import hashlib
import json
import Crypto
from flask import Flask, jsonify, request
import requests
from uuid import uuid4
from urllib.parse import urlparse
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
from Crypto import Random
import ast
import base64
import zlib
import os

# Part 1 - Building a Blockchain

class Blockchain:

    def __init__(self):
        self.chain = []
        self.transactions = []
        self.create_block(proof = 1, previous_hash = '0')
        self.nodes = set()
        self.load_chain()
    
    def create_block(self, proof, previous_hash):
        block = {'index': len(self.chain) + 1,
                 'timestamp': str(datetime.datetime.now()),
                 'proof': proof,
                 'previous_hash': previous_hash,
                 'transactions': self.transactions}
        self.transactions = []
        self.chain.append(block)
        return block

    def get_previous_block(self):
        return self.chain[-1]

    def proof_of_work(self, previous_proof):
        new_proof = 1
        check_proof = False
        while check_proof is False:
            hash_operation = hashlib.sha256(str(new_proof**2 - previous_proof**2).encode()).hexdigest()
            if hash_operation[:4] == '0000':
                check_proof = True
            else:
                new_proof += 1
        return new_proof
    
    def hash(self, block):
        encoded_block = json.dumps(block, sort_keys = True).encode()
        return hashlib.sha256(encoded_block).hexdigest()
    
    def is_chain_valid(self, chain):
        previous_block = chain[0]
        block_index = 1
        while block_index < len(chain):
            block = chain[block_index]
            if block['previous_hash'] != self.hash(previous_block):
                return False
            previous_proof = previous_block['proof']
            proof = block['proof']
            hash_operation = hashlib.sha256(str(proof**2 - previous_proof**2).encode()).hexdigest()
            if hash_operation[:4] != '0000':
                return False
            previous_block = block
            block_index += 1
        return True
    
    def add_transaction(self, user, data):
	
        self.transactions.append({'user': user,
                                  'data': data})
        previous_block = self.get_previous_block()
        return previous_block['index'] + 1
    
    def encrypt(self, public_key, data):
        public_key_object = RSA.importKey(public_key)
        #public_key_object = PKCS1_OAEP.new(public_key_object)
        data1 = json.dumps(data).encode("utf-8")
        blob = zlib.compress(data1)
        random_phrase = ''
        encrypted_message = public_key_object.encrypt(blob, random_phrase)
        #encrypted_message = public_key_object.encrypt(blob)
        data = base64.b64encode(encrypted_message[0]).decode("utf-8") 
        self.decrypt(data)
        return data

    def decrypt(self, data):
        private_key="-----BEGIN RSA PRIVATE KEY-----\nMIIEowIBAAKCAQEAtfcgF6x3nXY4IMPS9BN8UDSUoL8J5uoKXl1xjogGigsOdNb8\nsjx1ump4SHyH8msYSiE7SEwI42wxCqZCMD4yZm92VFYA8zgY0xQobRGtkAzNG82q\nbVGSK73kh3cQMGcnwzOQFC7S2JGYMwdZIwsNjx4NEQnFaqbDB9xWss4GLYWVsVpv\nwLYzttV56H9UumteSSpdrYdTq9WHmeHypG2z2+bNXUGxJtjxtwctzVbljT0tzWTo\nPl1RF9CmOpPhSn4lKG0DG+dnXv97mat+Kdn5kyqPFXvU9bzXBGsZR0+jGaEQA4Sw\nQNWwokdWOTrHMbh7KRZ99cIRrspXXETMH/0lPwIDAQABAoIBAGKQYM7R+dzOC2sc\nB2l0IJMlWBiWQlvVDBa/UOJepgQiJwt85FX7T93RDCRfaBgUkIye4YiwvuPJV+sn\n0ZRmLFC2MYdPKqaUDUZQlfE2cSgk9vkHdzhNxfpxmpcSFC/TwIMIrBNypXzvqFyD\nr3G+6/JI2dUP0OKLP/tDC6dA17HRzSfcD5MOQqJhk2wQc9R8m3q+8u1trii4vkTq\nf9/Di/mBuSxMIQjXRBZomrAURVEoX18D0Y6x2sMYfMgowv+hCPVClYgpSQtR/t8k\n9BP9SOa5ssPch4A+XOGzUuUsH6gnPtckr+l59wjnSyZqc7RNS0qi79YN8tfEz+z3\nnttBoSECgYEA9v4zsOs7Y0IfQVlDkJ3vwDQJ/wkyD2Gc6wy9i9r/deubAkd7zcaL\nFikfBvBH3IvnJi+s1V+qoEshkaWU+/btrtmU+NquIO+Kjt49tXb5qoT/dvjyqpcQ\nOnXMF13OeQeWp9FO7TJC56IWjBgg6T5ORQ5KyIwJnm9FDAbhTfstRQ8CgYEAvJnb\n8eeadeANkyyaY3ascH0zBVqeyJEpPJrsy52gCCXdc/EFaznhFmjT4wq6sbUQBFi0\nMnAiz6/HTfsMaoqFznsCoBMuB+3fn9BHSZyEnaGnK9SvkGCxyAF6C1zfnxTwu/Y2\nx0KRqA9IJaql9p+AkeDbbR43zFzAUoZk1AEj/NECgYB3OX+UMAhrwlg6AC+4GDTJ\nz5Tfsf2jJRhM8cpxPxY/QqqBcCYXz3YGDXV3sPbPRA0hBrRkDxja5Ulf99Cxy6Ex\n3L+nXE/fgCGfEzIwbSzZHff+4u6oX+EqhwAsa1CmZX5YpZV2s+NN0pUVrPP+AuBf\nPyXkJoziGI343z1UmiFhCwKBgF6uizmtQODuY0JAgR1v5W/vmp6UeORN47rWOAyc\njEuq3rsnA8Zp3zNF2yG/MCyormrQMV6k5wUGxPLEFt6hvj0DijTcjB5U8BAmGrO8\nzOLp1afudVjxAi9bdm6f6G/Prm9eUu/D3qXVTi4CtqDSQFR74wyrv+1rnu2PJK0+\nCVgRAoGBAMtkd8LnZjLOZRCQi7mnIOOtdJy8kvuOeL1Kuwd9+BWWu1UD6428doVB\nTbCJIZOQ023pFMuG9RKq6sbIg5DHwqCBABrWKLZObu70gxK6I+5n69vsyvlP84r1\n5ClDIdvStC6IpDMi22hePfCoEPKUNWM4e9vaez4sZNzvxGj5TzVa\n-----END RSA PRIVATE KEY-----"
        encrypted_message = base64.b64decode(data)
        private_key_object = RSA.importKey(private_key)
        decrypted_message = private_key_object.decrypt(encrypted_message)
        data = zlib.decompress(decrypted_message).decode("utf-8")
        print(data)

    def add_node(self, address):
        parsed_url = urlparse(address)
        self.nodes.add(parsed_url.netloc)
    
    def replace_chain(self):
        network = self.nodes
        longest_chain = None
        max_length = len(self.chain)
        for node in network:
            response = requests.get(f'http://{node}/get_chain')
            if response.status_code == 200:
                length = response.json()['length']
                chain = response.json()['chain']
                if length > max_length and self.is_chain_valid(chain):
                    max_length = length
                    longest_chain = chain
        if longest_chain:
            self.chain = longest_chain
            return True
        return False

    def mine_block(self):
        previous_block = self.get_previous_block()
        previous_proof = previous_block['proof']
        proof = self.proof_of_work(previous_proof)
        previous_hash = self.hash(previous_block)
        block = self.create_block(proof, previous_hash)
        response = {'message': 'Congratulations, you just mined a block!',
	   	    'index': block['index'],
		    'timestamp': block['timestamp'],
		    'proof': block['proof'],
		    'previous_hash': block['previous_hash'],
		    'transactions': block['transactions']}
        return response

    def save_chain(self):
        with open('blockchain.json', 'w') as f:
            json.dump(self.chain, f)

    def load_chain(self):
        try:
            with open('blockchain.json', 'r') as f:
                self.chain=json.load(f)
        except Exception as e:
            print('blockchain vazia')

# Part 2 - Mining our Blockchain

# Creating a Web App
app = Flask(__name__)

# Creating an address for the node on Port 5001
node_address = str(uuid4()).replace('-', '')

# Creating a Blockchain
blockchain = Blockchain()

# Home Blockchain
@app.route('/', methods = ['GET'])
def get_home():
    response = {'Hello': 'HealthChain',
                'Description': 'Your New Medical Information'}
    return jsonify(response), 200

# Getting the full Blockchain
@app.route('/get_chain', methods = ['GET'])
def get_chain():
    response = {'chain': blockchain.chain,
                'length': len(blockchain.chain)}
    return jsonify(response), 200

# Getting a specific block in the Blockchain
@app.route('/get_block/<id>', methods = ['GET'])
def get_block(id=0):
    i=int(id)-1
    if (i>0 and i<len(blockchain.chain)):
        response = {'block': blockchain.chain[i] }
    else:
        return "No block", 400
    return jsonify(response), 200

# Checking if the Blockchain is valid
@app.route('/is_valid', methods = ['GET'])
def is_valid():
    is_valid = blockchain.is_chain_valid(blockchain.chain)
    if is_valid:
        response = {'message': 'All good. The Blockchain is valid.'}
    else:
        response = {'message': 'Houston, we have a problem. The Blockchain is not valid.'}
    return jsonify(response), 200

# Adding a new transaction to the Blockchain
@app.route('/add_transaction', methods = ['POST'])
def add_transaction():
    json = request.get_json()
    transaction_keys = ['user', 'data']
    if not all(key in json for key in transaction_keys):
        return 'Some elements of the transaction are missing', 400
    index = blockchain.add_transaction(json['user'], json['data'])
    response = blockchain.mine_block();
    blockchain.save_chain();
    return jsonify(response), 201

# Part 3 - Decentralizing our Blockchain

# Connecting new nodes
@app.route('/connect_node', methods = ['POST'])
def connect_node():
    json = request.get_json()
    nodes = json.get('nodes')
    if nodes is None:
        return "No node", 400
    for node in nodes:
        blockchain.add_node(node)
    response = {'message': 'All the nodes are now connected. The Hadcoin Blockchain now contains the following nodes:',
                'total_nodes': list(blockchain.nodes)}
    return jsonify(response), 201

# Replacing the chain by the longest chain if needed
@app.route('/replace_chain', methods = ['GET'])
def replace_chain():
    is_chain_replaced = blockchain.replace_chain()
    if is_chain_replaced:
        response = {'message': 'The nodes had different chains so the chain was replaced by the longest one.',
                    'new_chain': blockchain.chain}
    else:
        response = {'message': 'All good. The chain is the largest one.',
                    'actual_chain': blockchain.chain}
    return jsonify(response), 200

# Running the app
app.run(host = '0.0.0.0', port = os.getenv("PORT"))
