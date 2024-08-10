import requests
import json

def extract_constituencies_from_json(page):
    #Fake User Agent
    headers = {
    'authority': 'www.google.com',
    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
    'accept-language': 'en-US,en;q=0.9',
    'cache-control': 'max-age=0',
    'sec-ch-ua': '"Not/A)Brand";v="99", "Google Chrome";v="115", "Chromium";v="115"',
    'sec-ch-ua-arch': '"x86"',
    'sec-ch-ua-bitness': '"64"',
    'sec-ch-ua-full-version': '"115.0.5790.110"',
    'sec-ch-ua-full-version-list': '"Not/A)Brand";v="99.0.0.0", "Google Chrome";v="115.0.5790.110", "Chromium";v="115.0.5790.110"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-model': '""',
    'sec-ch-ua-platform': 'Windows',
    'sec-ch-ua-platform-version': '15.0.0',
    'sec-ch-ua-wow64': '?0',
    'sec-fetch-dest': 'document',
    'sec-fetch-mode': 'navigate',
    'sec-fetch-site': 'same-origin',
    'sec-fetch-user': '?1',
    'upgrade-insecure-requests': '1',
    'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36',
    'x-client-data': '#..',
}
    url = f"https://members.parliament.uk/members/commons?page=1"
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        print(f"Error: Received status code {response.status_code} for page {page}")
        return []
    
    try:
        data = response.json()
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {e} for page {page}")
        print("Response content:", response.text)
        return []
    
    constituencies = []
    for member in data['items']:
        constituency = member['latestHouseMembership']['membershipFrom']
        constituencies.append(constituency)
    return constituencies

all_constituencies = []
for page in range(1, 34):
    all_constituencies.extend(extract_constituencies_from_json(page))

# Save to a file in JSON format
with open('./libs/python/src/results/constituencies.json', 'w') as f:
    json.dump(all_constituencies, f, indent=2)

print(f"Scraped {len(all_constituencies)} constituencies.")
