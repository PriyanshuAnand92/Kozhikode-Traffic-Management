const fs = require('fs');
const path = require('path');
const s = fs.readFileSync(path.join(__dirname,'..','src','data','trafficNetwork.ts'),'utf8');
function extractBlock(startToken){
  const start = s.indexOf(startToken);
  const arrStart = s.indexOf('[', start);
  const arrEnd = s.indexOf('\n];', arrStart);
  return s.slice(arrStart, arrEnd+1);
}
const jBlock = extractBlock('export const junctions');
const rBlock = extractBlock('export const roads');
const junctions = [...jBlock.matchAll(/id:\s*'([^']+)'[\s\S]*?lat:\s*([0-9.\-]+),[\s\S]*?lng:\s*([0-9.\-]+)/g)].map(m=>({id:m[1],lat:parseFloat(m[2]),lng:parseFloat(m[3])}));
const roads = [...rBlock.matchAll(/id:\s*'([^']+)'[\s\S]*?from:\s*'([^']+)'[\s\S]*?to:\s*'([^']+)'/g)].map(m=>({id:m[1],from:m[2],to:m[3]}));
function haversine(a,b){
  const toRad = v=>v*Math.PI/180;
  const R=6371;
  const dLat=toRad(b.lat-a.lat);
  const dLon=toRad(b.lng-a.lng);
  const la=toRad(a.lat), lb=toRad(b.lat);
  const x=Math.sin(dLat/2)**2 + Math.cos(la)*Math.cos(lb)*Math.sin(dLon/2)**2;
  const c=2*Math.atan2(Math.sqrt(x), Math.sqrt(1-x));
  return R*c*1000;
}
const jById = Object.fromEntries(junctions.map(j=>[j.id,j]));
console.log('junctionCount',junctions.length,'roadCount',roads.length);
const longLinks = [];
for(const r of roads){
  const a=jById[r.from];
  const b=jById[r.to];
  if(!a||!b){
    console.log('missing endpoint for road', r.id, r.from, r.to);
    continue;
  }
  const d=haversine(a,b);
  if(d>1200) longLinks.push({road:r.id,from:r.from,to:r.to,meters:Math.round(d)});
}
console.log('longLinks(>1.2km):', longLinks.length);
longLinks.forEach(l=>console.log(l));
// Check if mavoor_road_jn and mananchira_jn have a direct road
const direct = roads.find(r=> (r.from==='mavoor_road_jn'&&r.to==='mananchira_jn')||(r.from==='mananchira_jn'&&r.to==='mavoor_road_jn'));
console.log('mavoor<->mananchira direct road present?', !!direct);
// List roads by from node
const byFrom = {};
for(const r of roads){ byFrom[r.from]=byFrom[r.from]||[]; byFrom[r.from].push(r); }
console.log('roads per junction (counts):');
Object.keys(jById).forEach(id=>console.log(id,':', (byFrom[id]||[]).length));
