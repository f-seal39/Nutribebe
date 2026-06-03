import requests
ports = [4041,4040,4042]
for port in ports:
    try:
        r = requests.get(f'http://127.0.0.1:{port}/api/tunnels', timeout=2)
        print('PORT', port, 'STATUS', r.status_code)
        print(r.text)
    except Exception as e:
        print('PORT', port, 'ERR', e)
