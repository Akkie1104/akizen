"""Fetch pinned, licensed static design assets; no dependencies or execution."""
from pathlib import Path
import re
from urllib.request import Request, urlopen

root = Path(__file__).parent / 'assets'
root.mkdir(exist_ok=True)
def read(url):
    req = Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36'})
    with urlopen(req, timeout=45) as response:
        return response.read()

css = read('https://fonts.googleapis.com/css2?family=Manrope:wght@400..800&display=swap').decode()
urls = re.findall(r'url\((https://[^)]+)\)', css)
if not urls:
    raise RuntimeError('No font URL returned')
font = read(urls[-1])
suffix = 'woff2' if font[:4] == b'wOF2' else 'ttf'
(root / ('manrope.' + suffix)).write_bytes(font)
(root / 'Manrope-OFL.txt').write_bytes(read('https://raw.githubusercontent.com/google/fonts/main/ofl/manrope/OFL.txt'))
for name in ['arrow-up-right', 'arrow-right', 'arrow-down', 'layout-grid', 'sun', 'moon']:
    asset = read('https://raw.githubusercontent.com/tabler/tabler-icons/v3.35.0/icons/outline/' + name + '.svg')
    if b'<svg' not in asset:
        raise RuntimeError('Invalid SVG')
    (root / (name + '.svg')).write_bytes(asset)
(root / 'Tabler-LICENSE').write_bytes(read('https://raw.githubusercontent.com/tabler/tabler-icons/v3.35.0/LICENSE'))
print('Font:', suffix, len(font), 'bytes; six Tabler icons and licenses saved.')
