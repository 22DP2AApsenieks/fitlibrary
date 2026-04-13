import urllib.parse
import urllib.request
import json

q = 'Krišjāņa Valdemāra iela 1C, Centra rajons, Rīga, LV-1010, Latvia'
url = 'https://nominatim.openstreetmap.org/search?' + urllib.parse.urlencode({'q': q, 'format': 'json', 'limit': 1})
print(url)
req = urllib.request.Request(url, headers={'User-Agent': 'FitlibraryApp/1.0'})
with urllib.request.urlopen(req, timeout=20) as r:
    data = json.load(r)
print(data)
