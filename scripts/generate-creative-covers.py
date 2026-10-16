from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance, ImageOps
from pathlib import Path
import argparse, zipfile

W,H=1920,1080
BG=(16,21,23)
LIME=(196,231,102)
PROJECTS=[
 ('Endustriyel-Perspektif','Endüstri 360','SANAYİ & İMALAT','Üretimin farklı disiplinleri, tek bir güçlü anlatı.'),
 ('Cnc','Hassasiyetin Gücü','CNC TEKNOLOJİLERİ','Mühendisliği görünür kılan detaylar.'),
 ('Robotik-Otomasyon','Hareketin Mühendisliği','ROBOTİK OTOMASYON','Kontrol, koordinasyon ve kusursuz ritim.'),
 ('Is-Makineleri','Sahanın Gücü','YAPI & İNŞAAT','Ölçeğin ve dayanıklılığın sinematik dili.'),
 ('Plastik-Teknolojileri-Formun-Otesinde','Formun Ötesinde','PLASTİK TEKNOLOJİLERİ','Malzeme, geometriden tasarıma dönüşür.'),
 ('Lojistik','Lojistik','TAŞIMACILIK','Hareketin arkasındaki düzen.'),
 ('Gayrimenkul','Gayrimenkul','MİMARİ & YAŞAM','Mekânın ışıkla anlatılan karakteri.'),
 ('Kozmetik-Moda','Maybelline','MODA & KOZMETİK','Ürün odağında canlı ve güçlü bir görsel dil.'),
 ('Otomotiv','Continental','OTOMOTİV','Yol, hareket ve ürün karakteri.'),
 ('Spor-Beslenme','OCN Protein','SPOR & BESLENME','Günlük rutinde enerjik ürün anlatımı.'),
 ('Turizm-Seyahat','Turizm ve Seyahat','TURİZM & TAŞIMACILIK','Bir rota, pek çok yeni deneyim.')
]
BOLD='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
REG='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
def font(sz,bold=False):
 return ImageFont.truetype(BOLD if bold else REG,sz)
def wrap_fit(draw,txt,maxwidth):
 for sz in range(100,52,-2):
  f=font(sz,True); lines=[];line=''
  for word in txt.split():
   nextline=(line+' '+word).strip()
   if draw.textbbox((0,0),nextline,font=f)[2]<=maxwidth:line=nextline
   else:
    if line:lines.append(line)
    line=word
  if line:lines.append(line)
  if len(lines)<=3:return lines,f
 return lines,font(54,True)
def make(project,number,poster_root,out):
 slug,title,category,tagline=project
 src=poster_root/(slug+'.jpg')
 if not src.exists():raise FileNotFoundError(src)
 source=Image.open(src).convert('RGB')
 base=ImageOps.fit(source,(W,H),method=Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(46))
 base=ImageEnhance.Brightness(base).enhance(.22)
 portrait=source.height>source.width*1.18
 x0,y0,x1,y1=(1125,90,1728,985) if portrait else (900,190,1790,875)
 fg=ImageOps.contain(source,(x1-x0,y1-y0),method=Image.Resampling.LANCZOS)
 fx=x0+(x1-x0-fg.width)//2;fy=y0+(y1-y0-fg.height)//2
 d=ImageDraw.Draw(base,'RGBA')
 d.rounded_rectangle((fx-11,fy-11,fx+fg.width+11,fy+fg.height+11),radius=15,fill=(12,17,19,220),outline=(232,244,228,70),width=2)
 base.paste(fg,(fx,fy))
 # Feathered graphite overlay behind legible editorial typography.
 shade=Image.new('RGB',(W,H),BG);alpha=Image.new('L',(W,1))
 px=alpha.load()
 for x in range(W):
  k=max(0,min(1,(x-830)/850));px[x,0]=int(245*(1-k)**1.4)
 base.paste(shade,(0,0),alpha.resize((W,H)))
 d=ImageDraw.Draw(base,'RGBA')
 for x in range(115,800,84):d.line(((x,0),(x,H)),fill=(239,242,233,8),width=1)
 for y in range(90,H,84):d.line(((0,y),(865,y)),fill=(239,242,233,8),width=1)
 d.rectangle((110,94,174,101),fill=LIME)
 d.text((195,81),'M K .  /  C R E A T I V E  P O R T F O L I O',font=font(22,True),fill=(226,235,225,215))
 d.line((110,165,785,165),fill=(230,241,230,48),width=2)
 d.text((113,230),f'{number:02d}  /  CASE STUDY',font=font(28),fill=LIME)
 d.text((113,311),category,font=font(26,True),fill=(226,234,226,220))
 lines,ff=wrap_fit(d,title,770);sy=388
 for line in lines:
  d.text((104,sy),line,font=ff,fill=(244,248,237,255))
  sy+=ff.size+22
 sy+=24;d.rectangle((112,sy,220,sy+7),fill=LIME);sy+=51
 words=[];line=''
 for word in tagline.split():
  candidate=(line+' '+word).strip()
  if d.textbbox((0,0),candidate,font=font(32))[2]>660:
   words.append(line);line=word
  else:line=candidate
 if line:words.append(line)
 for line in words:
  d.text((111,sy),line,font=font(32),fill=(186,202,197,255));sy+=46
 d.line((112,964,775,964),fill=(222,238,218,45),width=2)
 d.text((110,988),'AI-ASSISTED CONCEPT  ·  INDEPENDENT PORTFOLIO',font=font(19),fill=(188,204,194,225))
 d.ellipse((1800,90,1810,100),fill=LIME)
 dest=out/(slug+'.jpg');base.save(dest,quality=94,optimize=True,subsampling=0)
 print('COVER',number,dest,flush=True)
 return dest
def main():
 a=argparse.ArgumentParser()
 a.add_argument('--posters',default='docs/posters')
 a.add_argument('--output',default='/tmp/creative-covers')
 args=a.parse_args()
 out=Path(args.output);out.mkdir(parents=True,exist_ok=True)
 files=[make(p,i,Path(args.posters),out) for i,p in enumerate(PROJECTS,1)]
 index='# Kreatif Proje Kapakları\n\nGörseller mevcut proje posterlerini kullanarak tasarlanmış 1920 × 1080 editorial konsept kapaklarıdır; yeni film kareleri veya yeni marka işi değildir.\n\n'
 index+='\n'.join(f'{i:02d}. {p[1]}: {p[0]}.jpg' for i,p in enumerate(PROJECTS,1))
 (out/'README.md').write_text(index,encoding='utf-8')
 with zipfile.ZipFile(out/'KREATIF_11_PROJE_GORSELLERI.zip','w',compression=zipfile.ZIP_DEFLATED,compresslevel=6) as z:
  for file in files:z.write(file,arcname=file.name)
  z.write(out/'README.md',arcname='README.md')
 print('PASS: 11 distinct creative project graphics and zip archive',flush=True)
if __name__=='__main__':main()
