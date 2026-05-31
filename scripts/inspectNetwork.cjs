const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'src', 'data', 'trafficNetwork.ts');
const s = fs.readFileSync(file, 'utf8');
function extractArray(name){
  const idx = s.indexOf(`export const ${name}`);
  if(idx===-1) return null;
  const aStart = s.indexOf('[', idx);
  const aEnd = s.indexOf('];', aStart);
  return s.slice(aStart, aEnd+1);
}
const junctionBlock = extractArray('junctions');
const roadsBlock = extractArray('roads');
function parseIds(block){
  const items = [];
  const re = /\{([\s\S]*?)\}\s*,?/g;
  let m;
  while((m=re.exec(block))){
    items.push(m[1]);
  }
  return items.map(str=>{
    const idM = /id:\s*'([^']+)'/.exec(str);
    const nameM = /name:\s*'([^']+)'/.exec(str);
    const latM = /lat:\s*([0-9.+-]+)/.exec(str);
    const lngM = /lng:\s*([0-9.+-]+)/.exec(str);
    const from = /from:\s*'([^']+)'/.exec(str);
    const to = /to:\s*'([^']+)'/.exec(str);
    const waypoints = /waypoints:\s*\[([\s\S]*?)\]\s*,/.exec(str);
    return {raw:str,id:idM&&idM[1],name:nameM&&nameM[1],lat:latM&&parseFloat(latM[1]),lng:lngM&&parseFloat(lngM[1]),from:from&&from[1],to:to&&to[1],waypoints:waypoints&&waypoints[1]};
  });
}
const junctions = parseIds(junctionBlock);
const roads = parseIds(roadsBlock);
console.log('Total junctions',junctions.length);
['mavoor_road_jn','mananchira_jn'].forEach(id=>{
  const j = junctions.find(x=>x.id===id);
  console.log('Junction',id, j? `found: ${j.name} @ ${j.lat},${j.lng}`:'NOT FOUND');
});
console.log('\nRoads involving these junctions:');
roads.filter(r=>r.from==='mavoor_road_jn'||r.to==='mavoor_road_jn'||r.from==='mananchira_jn'||r.to==='mananchira_jn').forEach(r=>{
  console.log(`- ${r.id}: ${r.from} -> ${r.to}`);
  if(r.waypoints){
    const pts = [...r.waypoints.matchAll(/\[\s*([0-9.+-]+)\s*,\s*([0-9.+-]+)\s*\]/g)].map(m=>[parseFloat(m[1]),parseFloat(m[2])]);
    console.log('  waypoints count',pts.length);
    const swapped = pts.some(pt=>Math.abs(pt[0])>90 && Math.abs(pt[1])<=90);
    const latRange = pts.reduce((a,c)=>[Math.min(a[0],c[0]),Math.max(a[1],c[0])],[Infinity,-Infinity]);
    const lngRange = pts.reduce((a,c)=>[Math.min(a[0],c[1]),Math.max(a[1],c[1])],[Infinity,-Infinity]);
    console.log('  sample waypoint', pts.slice(0,3));
    console.log('  swappedOrientation?', swapped);
  }
});
