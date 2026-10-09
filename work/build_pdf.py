from pathlib import Path
from playwright.sync_api import sync_playwright
import fitz,shutil
repo=Path(__file__).resolve().parents[1]
source=Path('/Users/jpmackbookpro/.gemini/antigravity-ide/brain/1b02094f-4432-44bc-8b45-044f1771a32d/how-to-work-with-an-architect-mockup.html')
out=Path('/Users/jpmackbookpro/Desktop/How to Work with an Architect.pdf')
with sync_playwright() as p:
 b=p.chromium.launch(headless=True)
 page=b.new_page(viewport={'width':1100,'height':900})
 page.goto(source.as_uri(),wait_until='networkidle');page.evaluate('document.fonts.ready')
 assert page.locator('img').evaluate_all('(imgs)=>imgs.every(i=>i.complete&&i.naturalWidth>0)')
 page.add_style_tag(content='@media print { .photo-grid { grid-template-columns: repeat(3,1fr) !important; break-inside: avoid; } figure, .photo-card { break-inside: avoid; } p, li { orphans: 3; widows: 3; } * { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }')
 page.pdf(path=str(repo/'work/article-no-button.pdf'),format='Letter',print_background=True,margin={'top':'0.5in','bottom':'0.5in','left':'0.5in','right':'0.5in'})
 b.close()
doc=fitz.open(repo/'work/article-no-button.pdf');pg=doc[0]
rect=fitz.Rect(365,37,576,70)
pg.draw_rect(rect,fill=(.082,.133,.196),color=(.082,.133,.196),radius=.15)
shape=pg.new_shape();shape.draw_polyline([fitz.Point(378,47),fitz.Point(378,60),fitz.Point(388,53.5),fitz.Point(378,47)]);shape.finish(fill=(.773,.627,.349),color=(.773,.627,.349));shape.commit()
pg.insert_text((399,56.5),'Listen to this article',fontsize=11,fontname='hebo',color=(1,1,1))
pg.insert_link({'kind':fitz.LINK_URI,'from':rect,'uri':'https://matchworkroofing.com/blog/how-to-work-with-an-architect.html?listen=1#listen'})
doc.save(out,garbage=4,deflate=True);doc.close()
doc=fitz.open(out)
assert len(doc)==6
assert any(x.get('uri','').endswith('?listen=1#listen') for x in doc[0].get_links())
assert 'The strongest projects' in ''.join(p.get_text() for p in doc)
for i,p in enumerate(doc):p.get_pixmap(matrix=fitz.Matrix(.8,.8)).save(str(repo/f'work/pdf-{i+1}.png'))
for tree in ['docs','site-src/docs']:
 d=repo/tree/'downloads/how-to-work-with-an-architect.pdf';d.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(out,d)
print('PDF generated: 6 pages, top Listen link verified.')
