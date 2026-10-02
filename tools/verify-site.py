from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urlsplit,unquote
import json,os,re,sys
root=Path(__file__).resolve().parents[1]/'site-src/docs'
errors=[]; pages=list(root.rglob('*.html')); counts={}
ban=re.compile(r"\blicen[cs](?:ed|ing)\b|\binsured\b|\bbonded\b|financ|owens\s+corning|bespoke|\bguarantee|non.prorat|\bAPR\b|555[ -]|sub.millimeter|\bforensic|superpower|zero stray|100%|3999.22",re.I)
warranty_words=re.compile(r"\bwarrant|\bcertif",re.I)
credential_ban=re.compile(r"select\s+shinglemaster|master\s+craftsman|surestart\s*\+?\s*plus|[345]\s*[- ]\s*star|\bcredentialed\b|factory.certified",re.I)
warranty_link=re.compile(r"https?://(?:www\.)?certainteed\.com/[^\"' ]*warrant",re.I)
for p in pages:
 rel=p.relative_to(root).as_posix();raw=p.read_text();s=BeautifulSoup(raw,'html.parser')
 for word in sorted(set(ban.findall(raw))):errors.append(f'{rel}: banned wording {word}')
 text=s.get_text(' ',strip=True)
 for word in sorted(set(credential_ban.findall(text))):errors.append(f'{rel}: banned CertainTeed credential claim {word}')
 # f/FIX 2026-10-02: alt text is not in get_text(), so check it; plus steering/trade-nonsense phrases from the copy audit
 # f/FIX-review 2026-10-02: alt runs the full credential list; "swatch" and the audit phrases also checked in visible text and description/title metas
 for e in s.find_all(alt=True):
  for word in sorted(set(credential_ban.findall(e['alt'])+re.findall(r"swatch",e['alt'],re.I))):errors.append(f'{rel}: banned word in alt text {word}')
 metas=' '.join(m.get('content','') for m in s.find_all('meta') if (m.get('name') or m.get('property') or '') in ('description','og:title','og:description','twitter:title','twitter:description'))
 for word in sorted(set(re.findall(r"swatch|hail[\s-]belt|hail corridor|manufacturer blistering|easiest line to match|rest with your insurer|high-adhesive seal",text+' '+metas,re.I))):errors.append(f'{rel}: banned audit phrase {word}')
 if warranty_words.search(raw):
  if 'certainteed' not in raw.lower() or not warranty_link.search(raw):
   errors.append(f'{rel}: warranty/certification wording without CertainTeed attribution + certainteed.com warranty link')
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
  for f in s.find_all('form'):
   if f.get('data-backend')!='formsubmit':errors.append(f'{rel}: unresolved form')
  if not s.select('.mw-menu summary'):errors.append(f'{rel}: missing mobile nav')
  if not s.select('meta[name="description"]'):errors.append(f'{rel}: missing description')
 if 'cdn.tailwindcss.com' in raw:errors.append(f'{rel}: development CDN')
 if p.name!='portfolio-map.html' and 'portfolio-map' in raw:errors.append(f'{rel}: retired map link')
 counts[rel]=len(s.get_text(' ',strip=True).split())
# Class-coverage gate (PRD 3.2): every class used in HTML needs a rule in utilities.css
# or brand.css, or must be a JS hook string in assets/*.js, or be on the allowlist.
# MW_UTILITIES_CSS=/path/to/utilities.css checks an alternate build (negative test).
COVERAGE_ALLOW={'mw-car-prev','mw-car-next',
 'prose','prose-slate'}  # Typography-plugin classes, no plugin; styled by brand.css `article p` (PRD 3.1)
def css_selectors(css):
 css=re.sub(r'/\*.*?\*/','',css,flags=re.S);sel=[];buf=''
 for ch in css:
  if ch=='{':
   t=buf.strip()
   if t and not t.startswith('@'):sel.append(t)
   buf=''
  elif ch in '};':buf=''
  else:buf+=ch
 return sel
util_path=Path(os.environ.get('MW_UTILITIES_CSS') or root/'assets/utilities.css')
defined=set()
for css in (util_path.read_text(),(root/'assets/brand.css').read_text()):
 for sel in css_selectors(css):
  for m in re.finditer(r'\.((?:\\.|[A-Za-z0-9_-])+)',sel):defined.add(re.sub(r'\\(.)',r'\1',m.group(1)))
used={}
for p in pages:
 rel=p.relative_to(root).as_posix()
 for e in BeautifulSoup(p.read_text(),'html.parser').find_all(class_=True):
  for tok in e.get('class'):
   u=used.setdefault(tok,[0,rel]);u[0]+=1
js_hooks=set()
for j in (root/'assets').glob('*.js'):
 for m in re.finditer(r"""(["'`])([A-Za-z0-9_-]+)\1""",j.read_text()):
  if m.group(2) in used:js_hooks.add(m.group(2))
for tok in sorted(set(used)-defined-js_hooks-COVERAGE_ALLOW):
 errors.append(f'class without rule: {tok} ({used[tok][0]} uses, e.g. {used[tok][1]})')
print(json.dumps({'pages':len(pages),'words':counts,'errors':errors},indent=2))
sys.exit(bool(errors))
