const {DatabaseSync}=require("node:sqlite");const db=new DatabaseSync("data/content.db");
const BS=String.fromCharCode(92);
const re=/(\d+(?:\.\d+)?)e([+-]?)0*(\d+)(?![\w])/g;
const conv=(s)=>s.replace(re,(m,a,sg,e)=>a+BS+"times10^{"+(sg==="-"?"-":"")+e+"}");
let n=0;
function inMath(s){return s.replace(/\$([^$]+)\$/g,(m,x)=>{const y=conv(x);if(y!==x)n++;return "$"+y+"$";});}
function walk(x,key){if(typeof x==="string"){if(key==="latex"){const y=conv(x);if(y!==x)n++;return y;}return inMath(x);}
 if(Array.isArray(x))return x.map(v=>walk(v,key));if(x&&typeof x==="object"){const o={};for(const k in x)o[k]=walk(x[k],k);return o;}return x;}
const up=db.prepare("update documents set json=? where kind=? and id=?");let docs=0;db.exec("begin");
for(const r of db.prepare("select kind,id,json from documents where kind in ('lesson','questions')").all()){if(!/\de[+-]?\d/.test(r.json))continue;const b=n;const o=walk(JSON.parse(r.json));if(n>b){docs++;up.run(JSON.stringify(o),r.kind,r.id);}}
db.exec("commit");console.log("e-notation strings converted",n,"docs",docs);
