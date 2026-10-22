"""Local-only Chromium QA. Requires Playwright and Chromium; never publishes.
Start: python -m http.server 8000 --directory docs
Run: python scripts/browser-qa.py --output /tmp/cnc-qa
Proxy CA must be trusted by Chromium; TLS verification remains enabled.
"""
import argparse, asyncio, json, os, pathlib
from urllib.parse import quote
from playwright.async_api import async_playwright

async def main(args):
 out=pathlib.Path(args.output);out.mkdir(parents=True,exist_ok=True)
 async with async_playwright() as pw:
  options=dict(executable_path=args.chromium,headless=True,args=['--no-sandbox'])
  if os.environ.get('HTTPS_PROXY'):options['proxy']={'server':os.environ['HTTPS_PROXY'],'bypass':'127.0.0.1,localhost'}
  browser=await pw.chromium.launch(**options)
  context=await browser.new_context(viewport={'width':1440,'height':1000})
  page=await context.new_page();page.set_default_timeout(25000)
  errors=[];requests=[];failed=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('request',lambda r:requests.append(r.url))
  page.on('requestfailed',lambda r:(failed.append({'url':r.url,'reason':r.failure}),print('NETWORK',r.failure,r.url,flush=True)))
  page.on('response',lambda r:print('HTTP',r.status,r.url,flush=True) if r.status>=400 else None)
  async def home():
   await page.goto(args.base,wait_until='domcontentloaded')
   await page.locator('#heroArt img').evaluate('(i)=>i.decode()')
   for image in await page.locator('#projectGrid img').all():
    await image.scroll_into_view_if_needed();await image.evaluate('(i)=>i.decode()')
   assert await page.locator('.project').count()==12
   assert await page.locator('.cover-bg').count()==12
   assert await page.locator('.cover-fg').count()==12
   for cover in await page.locator('.cover').all():
    assert await cover.locator('img').count()==2
    assert await cover.locator('.cover-bg').evaluate('(e)=>getComputedStyle(e).filter.includes("blur")')
    assert await cover.locator('.cover-fg').evaluate('(e)=>getComputedStyle(e).objectFit==="contain"')

   assert await page.locator('#heroArt img').get_attribute('src')=='./hero-ingiliz-anahtari.png.png'
  await home();projects=await page.evaluate('window.PORTFOLIO_PROJECTS')
  result={'browser':browser.version,'desktop':{'width':1440,'covers':12,'hero':True},'filters':[],'mobile':[],'videos':[],'detail_layouts':0}
  for cat in await page.locator('#filters button').all_text_contents():
   await page.get_by_role('button',name=cat,exact=True).click()
   expected=12 if cat=='Tüm Projeler' else sum(p['category']==cat for p in projects)
   assert await page.locator('.project').count()==expected
   assert await page.get_by_role('button',name=cat,exact=True).get_attribute('aria-pressed')=='true'
   result['filters'].append({'category':cat,'projects':expected})
  await home();await page.evaluate('scrollTo(0,0)');await page.screenshot(path=str(out/'desktop.png'),full_page=True)
  for width in [1440,320,375,390,768]:
   await page.set_viewport_size({'width':width,'height':1000 if width==1440 else 844})
   await home()
   layout=await page.evaluate('''()=>{const p=document.querySelector('#projeler'),r=p.getBoundingClientRect(),s=getComputedStyle(p);return {width:innerWidth,scrollWidth:document.documentElement.scrollWidth,paddingLeft:parseFloat(s.paddingLeft),heroFit:getComputedStyle(document.querySelector('#heroArt img')).objectFit}}''')
   assert layout['scrollWidth']<=width;assert layout['paddingLeft']>=20;assert layout['heroFit']=='contain'
   if width!=1440:result['mobile'].append(layout)
   if width in [390,768]:
    await page.evaluate('scrollTo(0,0)');await page.screenshot(path=str(out/f'home-{width}.png'),full_page=True)
   for p in projects:
    print('CHECK',width,p['name'],flush=True)
    await page.goto(args.base+'?proje='+quote(p['name']),wait_until='domcontentloaded')
    assert await page.locator('#detail h1').inner_text()==p['title']
    assert await page.locator('#detailBody > .small').inner_text()==p['category']
    for image in await page.locator('#detail img').all():
     await image.scroll_into_view_if_needed();await image.evaluate('(i)=>i.decode()')
    assert await page.evaluate('document.documentElement.scrollWidth<=innerWidth')
    for idx,v in enumerate(await page.locator('#detail video').all()):
     assert await v.get_attribute('poster')==p['poster']
     assert await v.evaluate('(v)=>v.controls&&v.playsInline&&getComputedStyle(v).objectFit==="contain"')
     if width in [1440,390]:
      state=await asyncio.wait_for(v.evaluate('''async v=>{
       v.muted=true;await v.play();await new Promise(r=>setTimeout(r,400));
       if(v.paused||v.currentTime<=0)throw Error('Video did not advance');
       v.pause();if(!v.paused)throw Error('Pause failed');
       await new Promise((resolve,reject)=>{const t=setTimeout(()=>reject(Error('Seek timeout')),12000);v.addEventListener('seeked',()=>{clearTimeout(t);resolve()},{once:true});v.currentTime=v.duration/2});
       const seekTime=v.currentTime;await v.play();await new Promise(r=>setTimeout(r,250));
       if(v.currentTime<=seekTime)throw Error('Resume failed');v.pause();
       return {width:v.videoWidth,height:v.videoHeight,duration:v.duration,seekTime,time:v.currentTime,paused:v.paused};
      }'''),25)
      media=[m for m in p['media'] if m['video']][idx]
      assert (state['width'],state['height'])==(media['width'],media['height'])
      result['videos'].append({'viewport':width,'project':p['name'],'index':idx,**state})
    result['detail_layouts']+=1
    if width==390 and p['name']=='Cnc':await page.screenshot(path=str(out/'cnc-mobile.png'),full_page=True)
   await home()
   await page.locator('.project').nth(1).click();await page.wait_for_url('**?proje=Cnc')
   await page.locator('.back').click();await page.wait_for_url('**#projeler');assert await page.locator('#homepage').is_visible()
  await page.goto(args.base+'?proje=olmayan',wait_until='domcontentloaded');assert await page.get_by_role('heading',name='Proje bulunamadı.').is_visible()
  await page.goto(args.base+'?proje=Cnc',wait_until='domcontentloaded')
  video=page.locator('video');await video.evaluate('(v)=>{v.src="./missing-test-video.mp4";v.load()}')
  await page.get_by_text('Video yüklenemedi.',exact=False).wait_for()
  result['error_fallback']=True;result['page_errors']=errors
  result['api_requests']=sum('api.github.com' in u for u in requests)
  assert not errors;assert result['api_requests']==0
  result['network_notes']=failed
  (out/'results.json').write_text(json.dumps(result,ensure_ascii=False,indent=2))
  print(json.dumps({'status':'PASS','video_play_pause_seek_resume_checks':len(result['videos']),'detail_layouts':result['detail_layouts'],'mobile':result['mobile'],'filters':result['filters'],'page_errors':errors,'api_requests':result['api_requests']},ensure_ascii=False,indent=2))
  await browser.close()

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--base',default='http://127.0.0.1:8000/');parser.add_argument('--output',default='/tmp/cnc-qa');parser.add_argument('--chromium',default='/usr/bin/chromium');asyncio.run(main(parser.parse_args()))
