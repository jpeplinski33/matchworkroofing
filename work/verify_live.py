from pathlib import Path
import subprocess,concurrent.futures,hashlib,json,fitz
r=Path(__file__).resolve().parents[1];work=r/'work';base='https://matchworkroofing.com'
paths=['blog/how-to-work-with-an-architect.html','assets/audio/how-to-work-with-an-architect-matilda.mp3','downloads/how-to-work-with-an-architect.pdf','blog/','sitemap.xml']
def check(rel):
 out=work/('live-'+(Path(rel).name if not rel.endswith('/') else 'blog-index.html'))
 run=subprocess.run(['curl','--fail','--silent','--show-error','--max-time','40','--socks5-hostname','127.0.0.1:18080',base+'/'+rel,'-o',str(out),'-w','%{http_code}'],capture_output=True,text=True)
 assert run.returncode==0,(rel,run.stderr)
 result={'path':rel,'status':run.stdout,'bytes':out.stat().st_size}
 if rel.endswith(('.pdf','.mp3')):
  result['sha256']=hashlib.sha256(out.read_bytes()).hexdigest()
  assert out.read_bytes()==(r/'docs'/rel).read_bytes()
 elif rel.endswith('architect.html'):
  s=out.read_text();assert 'The strongest projects' in s and 'article-narration' in s and 'bashing' not in s
 else:assert '/blog/how-to-work-with-an-architect.html' in out.read_text()
 return result
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:results=list(pool.map(check,paths))
pdf=fitz.open(work/'live-how-to-work-with-an-architect.pdf');assert len(pdf)==6
assert any(x.get('uri','').endswith('?listen=1#listen') for x in pdf[0].get_links())
(work/'live-verification.json').write_text(json.dumps(results,indent=2));print(json.dumps(results,indent=2))
