from pathlib import Path
from playwright.sync_api import sync_playwright
from bs4 import BeautifulSoup
from urllib.parse import urlsplit
import json,fitz
repo=Path(__file__).resolve().parents[1];root=repo/'docs'; results={}
slug='how-to-work-with-an-architect'
soup=BeautifulSoup((root/f'blog/{slug}.html').read_text(),'html.parser')
missing=[]
for el in soup.select('[href],[src]'):
 u=urlsplit(el.get('href',el.get('src','')))
 if u.scheme or u.netloc:continue
 target=root/u.path.lstrip('/') if u.path.startswith('/') else root/'blog'/u.path
 if not u.path: target=root/f'blog/{slug}.html'
 if target.is_dir():target=target/'index.html'
 if not target.exists():missing.append(str(target))
assert not missing,missing
with sync_playwright() as p:
 b=p.chromium.launch(headless=True)
 page=b.new_page(viewport={'width':1440,'height':1000})
 errors=[];page.on('pageerror',lambda e: errors.append(str(e)))
 page.goto(f'http://127.0.0.1:8879/blog/{slug}.html',wait_until='networkidle');page.evaluate('document.fonts.ready')
 page.locator('footer').scroll_into_view_if_needed();page.wait_for_timeout(500);page.evaluate('window.scrollTo(0,0)')
 assert page.locator('article img').evaluate_all('(imgs)=>imgs.every(i=>i.complete&&i.naturalWidth>0)')
 assert page.locator('audio').evaluate('(a)=>a.paused')
 page.locator('#listen-start').click();page.wait_for_function('!document.querySelector("audio").paused && document.querySelector("audio").currentTime > 0')
 results['playback_duration']=page.locator('audio').evaluate('(a)=>a.duration')
 page.locator('#listen-start').click();assert page.locator('audio').evaluate('(a)=>a.paused')
 page.screenshot(path=str(repo/'work/desktop.png'),full_page=True)
 page.set_viewport_size({'width':390,'height':844});page.reload(wait_until='networkidle')
 assert page.evaluate('document.documentElement.scrollWidth <= innerWidth')
 page.locator('.mw-menu summary').click();assert page.locator('.mw-mobile').is_visible();page.locator('.mw-menu summary').click()
 page.screenshot(path=str(repo/'work/mobile.png'),full_page=True)
 page.goto(f'http://127.0.0.1:8879/blog/{slug}.html?listen=1#listen',wait_until='networkidle')
 assert page.locator('#listen-start').is_visible()
 results['listen_link_state']={'paused':page.locator('audio').evaluate('(a)=>a.paused'),'status':page.locator('#listen-status').inner_text()}
 page.locator('audio').evaluate('(a)=>a.pause()')
 assert not errors,errors
 b.close()
results.update({'missing_links':missing,'desktop_and_mobile':'pass','page_errors':errors,'pdf_pages':len(fitz.open(root/f'downloads/{slug}.pdf'))})
(repo/'work/verification.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
