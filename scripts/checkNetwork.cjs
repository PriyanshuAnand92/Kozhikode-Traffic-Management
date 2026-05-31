const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, '..', 'src', 'data', 'trafficNetwork.ts');
const s = fs.readFileSync(file, 'utf8');
function extractBlock(startToken){
  const start = s.indexOf(startToken);
  if(start===-1) return null;
  const arrStart = s.indexOf('[', start);
  const arrEnd = s.indexOf('];', arrStart);
  return s.slice(arrStart, arrEnd);
}
const jBlock = extractBlock('export const junctions');
const rBlock = extractBlock('export const roads');
if(!jBlock || !rBlock){
  console.error('Could not find junctions or roads block');
  process.exit(2);
}
const junctions = [...jBlock.matchAll(/id:\s*'([^']+)'/g)].map(m=>m[1]);
const roads = [...rBlock.matchAll(/id:\s*'([^']+)'/g)].map(m=>m[1]);
const froms = [...rBlock.matchAll(/from:\s*'([^']+)'/g)].map(m=>m[1]);
const tos = [...rBlock.matchAll(/to:\s*'([^']+)'/g)].map(m=>m[1]);
const dupList = arr => Object.entries(arr.reduce((a,c)=>{a[c]=(a[c]||0)+1;return a},{})).filter(([,v])=>v>1).map(([k])=>k);
const dupJ = dupList(junctions);
const dupR = dupList(roads);
const missingFrom = froms.filter(f=>!junctions.includes(f));
const missingTo = tos.filter(t=>!junctions.includes(t));
console.log('junctionCount', junctions.length);
console.log('roadCount', roads.length);
if(dupJ.length) console.log('duplicate junction ids', dupJ);
if(dupR.length) console.log('duplicate road ids', dupR);
if(missingFrom.length||missingTo.length) console.log('missing endpoints', { missingFrom, missingTo });
else console.log('all road endpoints reference existing junction ids');
