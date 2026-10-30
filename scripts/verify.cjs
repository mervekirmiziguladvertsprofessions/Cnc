const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const data=fs.readFileSync(path.join(root,'docs/projects.js'),'utf8');
const app=fs.readFileSync(path.join(root,'docs/app.js'),'utf8');
function run(search=''){
 const nodes={};const context={window:{},URLSearchParams,location:{search},document:{title:'',getElementById(id){return nodes[id]??={innerHTML:'',textContent:'',hidden:false,querySelectorAll(){return []}}}}};
 vm.createContext(context);vm.runInContext(data,context);vm.runInContext(app,context);return {context,nodes};
}
function detailPoster(p,m){return run('?proje='+encodeURIComponent(p.name)).nodes.detailBody.innerHTML.includes('poster="'+m.poster+'"')}
const {context,nodes}=run();const projects=context.window.PORTFOLIO_PROJECTS;
assert.equal(projects.length,12);assert.equal(new Set(projects.map(p=>p.name)).size,12);
assert.equal((nodes.projectGrid.innerHTML.match(/class="project"/g)||[]).length,12);
assert.equal((nodes.projectGrid.innerHTML.match(/class="cover-bg"/g)||[]).length,12);
assert.equal((nodes.projectGrid.innerHTML.match(/class="cover-fg"/g)||[]).length,12);
for(const p of projects){
 assert(fs.existsSync(path.join(root,'docs',p.poster)));
 assert(p.media.some(m=>m.video));assert(p.overview&&p.approach&&p.role&&p.disclosure);
 for(const m of p.media){if(m.poster){assert(fs.existsSync(path.join(root,'docs',m.poster)));assert(detailPoster(p,m));}assert.match(m.url,/raw\.githubusercontent\.com\/[^/]+\/[^/]+\/[a-f0-9]{40}\//);if(m.video){assert(m.width>0&&m.height>0)}}
 const detail=run('?proje='+encodeURIComponent(p.name));assert.equal(detail.nodes.homepage.hidden,true);assert(detail.nodes.detailBody.innerHTML.includes(p.title));assert(detail.context.document.title.startsWith(p.title));
}
vm.runInContext('active="Sanayi & İmalat";renderGrid()',context);assert.equal((nodes.projectGrid.innerHTML.match(/class="project"/g)||[]).length,5);
assert(run('?proje=olmayan').nodes.detailBody.innerHTML.includes('Proje bulunamadı'));
const categories=["Sanayi & İmalat","Yapı & İnşaat","Gayrimenkul","Lojistik","Otomotiv","Mobilya & Tasarım","Moda & Kozmetik","Turizm & Seyahat","Spor & Beslenme"];
assert.equal(new Set(projects.map(p=>p.category)).size,8);
assert(categories.every(c=>nodes.filters.innerHTML.replaceAll('&amp;', '&').includes(c)));
assert(projects.every(p=>categories.includes(p.category)));
vm.runInContext('active="Mobilya & Tasarım";renderGrid()',context);
assert(nodes.projectGrid.innerHTML.includes('henüz yayımlanmış'));
assert(!app.includes('fetch('));assert(!data.includes('api.github.com'));
const html=fs.readFileSync(path.join(root,'docs/index.html'),'utf8');assert(html.includes('hero-ingiliz-anahtari.png.png'));assert(html.includes('object-fit:contain'));assert(html.includes('cover-bg'));assert(html.includes('scrollbar-width:none'));
console.log('PASS: 12 proje, 12 detay rotası, 9 ana kategori filtresi, bilinmeyen rota, yerel kapaklar, sabit medya adresleri, API bağımsız açılış.');
