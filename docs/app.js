"use strict";
const projects=window.PORTFOLIO_PROJECTS;
const CATS=["Endüstri & Teknoloji","Otomotiv & Lojistik","Marka & Ürün","Gayrimenkul & Seyahat"];
let active="Tüm Projeler";
const el=id=>document.getElementById(id);
const escapeHTML=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function mediaTag(m,preview=false,poster=""){
 const url=escapeHTML(m.url);
 if(m.video)return '<video src="'+url+'" poster="'+escapeHTML(poster)+'" controls playsinline preload="none" width="'+m.width+'" height="'+m.height+'" aria-label="Proje filmi"></video>';
 return '<img src="'+url+'" loading="lazy" alt="Proje görseli">';
}
function renderFilters(){
 let cats=["Tüm Projeler",...CATS.filter(c=>projects.some(p=>p.category===c))];
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
 el("projectCount").textContent=shown.length+" proje";
 el("projectGrid").innerHTML=shown.map(p=>{
 const cover={url:p.poster,video:false};
 return '<a class="project" href="?proje='+encodeURIComponent(p.name)+'">'+
 '<div class="cover">'+(cover?mediaTag(cover,true):'<div class="monogram">MK.</div>')+'</div>'+
 '<div class="tag">'+escapeHTML(p.category)+'</div>'+
 '<h3>'+escapeHTML(p.title)+' ↗</h3>'+
 '<div class="muted">'+escapeHTML(p.description)+'</div></a>';
 }).join("")||'<p class="muted">Bu kategoride proje bulunamadı.</p>';
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
