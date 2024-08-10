import requests


url = f"https://members-api.parliament.uk/api/Location/Constituency/Search"

response = requests.get(url)

if response.status_code != 200: 
  print(f"Error: Received status code {response.status_code}")

print(response.json())
