"use strict";
const projects=window.PORTFOLIO_PROJECTS;
const CATS=["Sanayi & İmalat","Yapı & İnşaat","Gayrimenkul","Lojistik","Otomotiv","Mobilya & Tasarım","Moda & Kozmetik","Turizm & Seyahat","Spor & Beslenme"];
let active="Tüm Projeler";
const el=id=>document.getElementById(id);
const escapeHTML=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function mediaTag(m,preview=false,poster=""){
 const url=escapeHTML(m.url);
 if(m.video)return '<video src="'+url+'" poster="'+escapeHTML(poster)+'" controls playsinline preload="none" width="'+m.width+'" height="'+m.height+'" aria-label="Proje filmi"></video>';
 return '<img src="'+url+'" loading="lazy" alt="Proje görseli">';
}
function renderFilters(){
 let cats=["Tüm Projeler",...CATS];
 el("filters").innerHTML=cats.map(c=>
 '<button type="button" class="'+(active===c?"active":"")+
 '" aria-pressed="'+(active===c)+'" data-cat="'+escapeHTML(c)+'">'+escapeHTML(c)+'</button>').join("");
 el("filters").querySelectorAll("button").forEach(b=>b.onclick=()=>{
 active=b.dataset.cat;
 renderFilters();renderGrid();
 el("filters").querySelectorAll("button").forEach(x=>{if(x.dataset.cat===active)x.focus();});
 });
}
function renderGrid(){
 const shown=projects.filter(p=>active==="Tüm Projeler"||p.category===active);
 el("projectCount").textContent=shown.length+" proje / seçilmiş çalışmalar";
 const isAll=active==="Tüm Projeler";
 const allLayouts=["layout-wide","layout-narrow","layout-narrow","layout-wide","layout-balanced","layout-balanced","layout-wide","layout-narrow","layout-narrow","layout-wide","layout-balanced","layout-balanced"];
 const filteredLayouts=["layout-wide","layout-narrow","layout-balanced","layout-balanced"];
 const cards=shown.map((p,i)=>{
  const coverUrl=escapeHTML(p.poster);
  const layout=isAll?(allLayouts[i]||"layout-balanced"):(shown.length===1?"layout-full":filteredLayouts[i%filteredLayouts.length]);
  const index=String(i+1).padStart(2,"0");
  const card='<a class="project '+layout+'" href="?proje='+encodeURIComponent(p.name)+'">'+
   '<div class="cover">'+
   '<img class="cover-bg" src="'+coverUrl+'" loading="lazy" alt="" aria-hidden="true">'+
   '<img class="cover-fg" src="'+coverUrl+'" loading="lazy" alt="'+escapeHTML(p.title)+' kapak görseli">'+
   '</div>'+
   '<div class="project-meta"><span class="tag">'+escapeHTML(p.category)+'</span><span class="project-index">'+index+' / '+String(shown.length).padStart(2,"0")+'</span></div>'+
   '<h3>'+escapeHTML(p.title)+' ↗</h3>'+
   '<div class="muted">'+escapeHTML(p.description)+'</div></a>';
  if(isAll&&i===3){
   return card+'<div class="work-break" aria-label="Yaratıcı yaklaşım"><strong>Üretimi göstermek değil.<br>Bir hikâyeye dönüştürmek.</strong><span class="work-break-mark" aria-hidden="true">↗</span></div>';
  }
  return card;
 });
 el("projectGrid").innerHTML=cards.join("")||'<p class="muted">Bu kategoride henüz yayımlanmış bir çalışma bulunmuyor.</p>';
}

function detailPage(p){
 el("homepage").hidden=true;el("detail").hidden=false;
 document.title=p.title+" | Merve Kırmızıgül";
 const field=(label,value)=>'<div><div class="small">'+escapeHTML(label)+'</div><p>'+escapeHTML(value)+'</p></div>';
 const details='<div class="case-panel">'+field("PROJE HAKKINDA",p.overview||p.description)+field("YARATICI YAKLAŞIM",p.approach||"Yapay zekâ destekli görsel anlatım.")+field("ÇALIŞMA KAPSAMI",p.role||"Kreatif konsept ve görsel üretim")+'</div>';
 const note=p.disclosure?'<p class="case-disclosure">'+escapeHTML(p.disclosure)+'</p>':'';
 el("detailBody").innerHTML='<div class="small">'+escapeHTML(p.category)+'</div><h1>'+escapeHTML(p.title)+'</h1><p class="muted">'+escapeHTML(p.description)+'</p>'+details+'<h2>Film ve görseller</h2><div class="detail-media">'+p.media.map(m=>mediaTag(m,false,p.poster)).join("")+'</div>'+note+'<p><a class="btn" target="_blank" rel="noopener noreferrer" href="'+escapeHTML(p.github)+'">GitHub proje dosyaları ↗</a></p>';
 el("detailBody").querySelectorAll("video").forEach(v=>v.addEventListener("error",()=>{
  const message=document.createElement("p");message.className="muted";message.textContent="Video yüklenemedi. GitHub proje dosyaları bağlantısından filme ulaşabilirsiniz.";v.after(message);
 },{once:true}));
}

el("year").textContent=new Date().getFullYear();
renderFilters();renderGrid();
const requested=new URLSearchParams(location.search).get("proje");
if(requested){
 const p=projects.find(x=>x.name.toLocaleLowerCase("tr")===requested.toLocaleLowerCase("tr"));
 if(p)detailPage(p);
 else {el("homepage").hidden=true;el("detail").hidden=false;el("detailBody").innerHTML='<h1>Proje bulunamadı.</h1><p>Yukarıdaki bağlantıyla tüm projelere dönebilirsiniz.</p>';}
}
