from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlsplit,unquote
import json,re,sys
root=Path(__file__).resolve().parents[1]/'site-src/docs'
errors=[]; pages=list(root.rglob('*.html')); counts={}
ban=re.compile(r"financ|\bwarrant|\bcertif|owens\s+corning|bespoke|\bguarantee|non.prorat|\bAPR\b|555[ -]|sub.millimeter|\bforensic|superpower|zero stray|100%|\bOAC\b|3901-1-54|3999.22",re.I)
for p in pages:
 rel=p.relative_to(root).as_posix();raw=p.read_text();s=BeautifulSoup(raw,'html.parser')
 for word in sorted(set(ban.findall(raw))):errors.append(f'{rel}: banned wording {word}')
 if re.search('[\U0001F000-\U0001FFFF]',raw):errors.append(f'{rel}: emoji')
 for e in s.select('script[type="application/ld+json"]'):
  try:json.loads(e.string)
  except Exception as ex:errors.append(f'{rel}: JSON-LD {ex}')
 for e in s.select('[href],[src]'):
  u=urlsplit(e.get('href',e.get('src','')))
  if u.scheme or u.netloc:continue
  if not u.path:t=p
  else:
   t=root/u.path.lstrip('/') if u.path.startswith('/') else p.parent/u.path
   if t.is_dir():t=t/'index.html'
  if not t.exists():errors.append(f'{rel}: missing {u.path}')
  elif u.fragment and t.suffix=='.html':
   target=BeautifulSoup(t.read_text(),'html.parser')
   if not target.find(id=unquote(u.fragment)):errors.append(f'{rel}: missing anchor {u.path}#{u.fragment}')
 if p.name!='portfolio-map.html':
  if len(s.find_all('h1'))!=1:errors.append(f'{rel}: expected one h1')
  if not s.select('a[href="tel:+16147411393"]'):errors.append(f'{rel}: missing phone link')
  if s.find('form'):errors.append(f'{rel}: unresolved form')
  if not s.select('.mw-menu summary'):errors.append(f'{rel}: missing mobile nav')
  if not s.select('meta[name="description"]'):errors.append(f'{rel}: missing description')
 if 'cdn.tailwindcss.com' in raw:errors.append(f'{rel}: development CDN')
 if p.name!='portfolio-map.html' and 'portfolio-map' in raw:errors.append(f'{rel}: retired map link')
 counts[rel]=len(s.get_text(' ',strip=True).split())
print(json.dumps({'pages':len(pages),'words':counts,'errors':errors},indent=2))
sys.exit(bool(errors))
