import requests

BASE='http://127.0.0.1:8000'
# Connexion
r = requests.post(BASE+'/api/auth/connexion/', json={'username':'parent_test','password':'1234'})
print('login status', r.status_code, r.text)
if r.status_code!=200:
    raise SystemExit('Auth failed')

token = r.json().get('token')
headers = {'Authorization': f'Bearer {token}', 'Content-Type': 'application/json'}
# Create paiement
paiement_data = {'provider':'mtn','telephone':'699000001','montant':100,'parent':1}
rp = requests.post(BASE+'/api/paiement/paiements/', json=paiement_data, headers=headers)
print('paiement create', rp.status_code, rp.text)

# Try creating a consultation referencing parent 1 and medecin 2
consult_data = {'parent':1,'medecin':2,'date_consultation':'2026-01-01T10:00:00Z','motif':'Test','parent_parent':None}
rc = requests.post(BASE+'/api/teleconsultation/consultations/', json=consult_data, headers=headers)
print('consult create', rc.status_code, rc.text)
