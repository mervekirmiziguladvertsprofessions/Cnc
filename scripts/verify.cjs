const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),path=require('node:path');
const root=path.resolve(__dirname,'..');
const data=fs.readFileSync(path.join(root,'docs/projects.js'),'utf8');
const app=fs.readFileSync(path.join(root,'docs/app.js'),'utf8');
function run(search=''){
 const nodes={};const context={window:{},URLSearchParams,location:{search},document:{title:'',getElementById(id){return nodes[id]??={innerHTML:'',textContent:'',hidden:false,querySelectorAll(){return []}}}}};
 vm.createContext(context);vm.runInContext(data,context);vm.runInContext(app,context);return {context,nodes};
}
const {context,nodes}=run();const projects=context.window.PORTFOLIO_PROJECTS;
assert.equal(projects.length,11);assert.equal(new Set(projects.map(p=>p.name)).size,11);
assert.equal((nodes.projectGrid.innerHTML.match(/class="project"/g)||[]).length,11);
for(const p of projects){
 assert(fs.existsSync(path.join(root,'docs',p.poster)));
 assert(p.media.some(m=>m.video));assert(p.overview&&p.approach&&p.role&&p.disclosure);
 for(const m of p.media){assert.match(m.url,/raw\.githubusercontent\.com\/[^/]+\/[^/]+\/[a-f0-9]{40}\//);if(m.video){assert(m.width>0&&m.height>0)}}
 const detail=run('?proje='+encodeURIComponent(p.name));assert.equal(detail.nodes.homepage.hidden,true);assert(detail.nodes.detailBody.innerHTML.includes(p.title));assert(detail.context.document.title.startsWith(p.title));
}
vm.runInContext('active="Endüstri & Teknoloji";renderGrid()',context);assert.equal((nodes.projectGrid.innerHTML.match(/class="project"/g)||[]).length,5);
assert(run('?proje=olmayan').nodes.detailBody.innerHTML.includes('Proje bulunamadı'));
assert(!app.includes('fetch('));assert(!data.includes('api.github.com'));
const html=fs.readFileSync(path.join(root,'docs/index.html'),'utf8');assert(html.includes('hero-ingiliz-anahtari.png.png'));assert(html.includes('object-fit:contain'));
console.log('PASS: 11 proje, 11 detay rotası, 4 ana kategori filtresi, bilinmeyen rota, yerel kapaklar, sabit medya adresleri, API bağımsız açılış.');
