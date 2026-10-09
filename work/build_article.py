from pathlib import Path
from bs4 import BeautifulSoup
import shutil,json
repo=Path(__file__).resolve().parents[1]
source=Path('/Users/jpmackbookpro/.gemini/antigravity-ide/brain/1b02094f-4432-44bc-8b45-044f1771a32d/how-to-work-with-an-architect-mockup.html')
slug='how-to-work-with-an-architect'
url=f'https://matchworkroofing.com/blog/{slug}.html'
base=repo/'site-src/docs'
page=BeautifulSoup(source.read_text(),'html.parser')
index=BeautifulSoup((base/'blog/index.html').read_text(),'html.parser')
page.select_one('.mw-header').replace_with(BeautifulSoup(str(index.select_one('.mw-header')),'html.parser'))
page.select_one('.mw-topbar').replace_with(BeautifulSoup(str(index.select_one('.mw-topbar')),'html.parser'))
# The approved standalone design stays scoped to this page.
style=page.select_one('style')
style.string += '''
.mw-menu {display:none;position:relative;}
.mw-menu summary {cursor:pointer;list-style:none;padding:10px;color:var(--navy);font-weight:700;}
.mw-menu summary::after {content:"Menu";}
.sr-only {position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0;}
.mw-mobile {position:absolute;right:0;top:100%;width:min(290px,85vw);padding:18px;background:#fff;border:1px solid var(--line);box-shadow:0 8px 25px #15223222;display:grid;gap:14px;}
.mw-mobile a {color:var(--navy);text-decoration:none;font-size:14px;}
.mw-topbar>div {gap:12px;flex-wrap:wrap;}
.article-audio {padding:20px 22px;margin:0 0 28px;background:var(--slate-bg);border:1px solid var(--line);border-radius:8px;scroll-margin-top:120px;}
.article-audio h2 {font:700 17px 'Plus Jakarta Sans',Arial,sans-serif;margin:0 0 6px;}
.article-audio p {font-size:13px;margin:0 0 12px;}
.article-audio audio {width:100%;display:block;margin-bottom:12px;}
.article-audio button {background:var(--navy);color:white;font:600 14px 'Plus Jakarta Sans',Arial,sans-serif;border:0;border-radius:5px;padding:11px 17px;cursor:pointer;margin-bottom:12px;}
.article-audio a {color:var(--navy);font-size:13px;font-weight:600;}
.article-audio [hidden] {display:none;}
.audio-links {display:flex;gap:20px;flex-wrap:wrap;}
@media(max-width:1000px){.mw-nav{display:none;}.mw-menu{display:block;}}
@media(max-width:600px){.mw-topbar span,.mw-topbar .mw-email{display:none;}main{margin-top:24px;padding:0 18px;}.hero-figure img{height:250px;}.feature-figure img{height:230px;}th,td{padding:10px;}table{min-width:620px;}.mw-cta-card{padding:28px 22px;}}
@media print{.article-audio{display:none!important;}}
'''
for img in page.select('article img'):
 name=Path(img['src']).name
 dest=base/'assets/img/blog/architect'/name; dest.parent.mkdir(parents=True,exist_ok=True)
 shutil.copy2(source.parent/'assets'/name,dest)
 img['src']='/assets/img/blog/architect/'+name
 img['decoding']='async'
 if name!='hero-blueprints.jpg': img['loading']='lazy'
player=BeautifulSoup(f'''<section class="article-audio" id="listen" aria-labelledby="listen-title">
<h2 id="listen-title">Listen to this article</h2>
<p>Full article narrated by Matilda · About 11 minutes</p>
<button type="button" id="listen-start">&#9654; Play narration</button>
<audio id="article-narration" controls preload="metadata" aria-label="How to Work with an Architect, narrated by Matilda"><source src="/assets/audio/{slug}-matilda.mp3" type="audio/mpeg">Your browser does not support audio playback. <a href="/assets/audio/{slug}-matilda.mp3">Open the recording</a>.</audio>
<p id="listen-status" role="status" aria-live="polite" hidden></p>
<div class="audio-links"><a href="/downloads/{slug}.pdf" download>Download the PDF</a><a href="/assets/audio/{slug}-matilda.mp3" download>Download the audio</a></div>
</section>''','html.parser')
page.select_one('.byline').insert_after(player)
js=page.new_tag('script');js.string='''
(() => {
 const audio = document.getElementById('article-narration');
 const button = document.getElementById('listen-start');
 const status = document.getElementById('listen-status');
 async function start() {
  try { await audio.play(); status.hidden = true; }
  catch (error) { status.textContent = error.name === 'NotAllowedError' ? 'Tap Play narration to start listening.' : 'The recording could not load. Try again or use Download the audio.'; status.hidden = false; }
 }
 button.addEventListener('click', () => audio.paused ? start() : audio.pause());
 audio.addEventListener('play', () => {button.textContent = 'Pause narration';});
 audio.addEventListener('pause', () => {button.textContent = '▶ Play narration';});
 audio.addEventListener('ended', () => {button.textContent = '▶ Play narration';});
 if (new URLSearchParams(location.search).get('listen') === '1') start();
})();
''';page.body.append(js)
meta=page.new_tag('meta',attrs={'name':'twitter:image','content':'https://matchworkroofing.com/assets/img/blog/architect/hero-blueprints.jpg'});page.head.append(meta)
page.select_one('meta[property="og:image"]')['content']=meta['content']
structured=page.new_tag('script',attrs={'type':'application/ld+json'});structured.string=json.dumps({'@context':'https://schema.org','@type':'Article','headline':page.h1.get_text(' ',strip=True),'url':url,'image':meta['content'],'datePublished':'2026-10-09','dateModified':'2026-10-09','author':{'@type':'Organization','name':'MATCHWORK Roofing & Exteriors'},'audio':{'@type':'AudioObject','name':'How to Work with an Architect — narrated by Matilda','contentUrl':f'https://matchworkroofing.com/assets/audio/{slug}-matilda.mp3','encodingFormat':'audio/mpeg'}},ensure_ascii=False);page.head.append(structured)
(base/f'blog/{slug}.html').write_text(str(page))
# Add a discoverable guide card without changing the existing cards.
card=f'''<article class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid md:grid-cols-12 mb-8 hover:shadow-lg transition">
<div class="md:col-span-7"><img src="/assets/img/blog/architect/hero-blueprints.jpg" alt="Architectural blueprints and drafting tools" width="640" height="480" class="w-full h-auto aspect-[4/3] object-cover" loading="lazy"></div>
<div class="md:col-span-5 p-8 flex flex-col justify-center space-y-4">
<span class="text-[11px] font-bold text-blue-600 uppercase tracking-wider">Architecture · Read or Listen</span>
<h3 class="text-2xl md:text-4xl font-black text-blue-950 leading-tight hover:text-amber-600 transition"><a href="/blog/{slug}.html">How to Work with an Architect (Without Burning $50,000+ or Losing Your Mind)</a></h3>
<p class="text-slate-600 text-sm leading-relaxed">Understand architectural fees, prepare for design meetings, and bring your contractor into the conversation early. Includes full audio narration and a downloadable PDF.</p>
<a class="text-blue-950 font-bold hover:underline text-xs" href="/blog/{slug}.html">Read or Listen to the Guide →</a>
</div></article>\n'''
p=base/'blog/index.html';s=p.read_text(); marker='<article class="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden grid md:grid-cols-12 mb-8 hover:shadow-lg transition">'; assert marker in s
s=s.replace(marker,card+marker,1);p.write_text(s)
p=base/'sitemap.xml';s=p.read_text();s=s.replace('</urlset>',f'  <url>\n    <loc>{url}</loc>\n    <lastmod>2026-10-09</lastmod>\n    <changefreq>monthly</changefreq>\n    <priority>0.8</priority>\n  </url>\n</urlset>');p.write_text(s)
paths=[f'blog/{slug}.html','blog/index.html','sitemap.xml']+[f'assets/img/blog/architect/{p.name}' for p in (base/'assets/img/blog/architect').glob('*.jpg')]
for rel in paths:
 dest=repo/'docs'/rel;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(base/rel,dest)
print('Built article, guide card, sitemap and five image assets in both site trees.')
