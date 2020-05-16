# blockchain
Desenvolvimento da blockchain


instalar dependencias  
pip3 install datetime Crypto flask requests uuid  


rodar com python3 node.py  


Obter o blockchain  
GET:  http://localhost:5001/get_chain  
Return
{  
	"chain":[	{	"index":1,  
				"previous_hash":"0",  
				"proof":1,  
				"timestamp":"2020-04-27 20:26:44.008018",  
				"transactions":[]  
			}  
		]  
	,"length":1  
}  

Obter um bloco especifico
GET:  http://localhost:5001/get_block/id  
Return
{  
    "block": {  
        "index": 4,  
        "previous_hash": "a48440ee3cce36d55ac6bae92d4563f00cc2b355a858b8d34ab946e06dd32089",  
        "proof": 21391,  
        "timestamp": "2020-04-30 05:59:29.396743",  
        "transactions": [  
            {  
                "data": "teste2",  
                "public_key": "key2",  
                "user": "2"  
            }  
        ]  
    }  
}  


Inserir dados  
POST:  
http://localhost:5001/add_transaction  
Payload
{  
	"user": user_id,  
	"public_key", public_key,  
	"data": {...}  
}  


