const {DatabaseSync}=require("node:sqlite");const db=new DatabaseSync("data/content.db");
const BS=String.fromCharCode(92);let n=0;
const re=/(\d[\d.]*)\s*\\times\s*10\^\{?(-?\d+)\}?/g;
function wrapOutside(s){const parts=s.split("$");if(parts.length%2===0)return s;
 for(let i=0;i<parts.length;i+=2){parts[i]=parts[i].replace(re,(m,a,e)=>{n++;return "$"+a+BS+"times10^{"+e+"}$";});}
 return parts.join("$");}
function walk(x,key){if(typeof x==="string"){if(key==="latex")return x;return wrapOutside(x);}
 if(Array.isArray(x))return x.map(v=>walk(v,key));if(x&&typeof x==="object"){const o={};for(const k in x)o[k]=walk(x[k],k);return o;}return x;}
const up=db.prepare("update documents set json=? where kind=? and id=?");let docs=0;db.exec("begin");
for(const r of db.prepare("select kind,id,json from documents where kind in ('lesson','questions')").all()){if(!r.json.includes("times"))continue;const b=n;const o=walk(JSON.parse(r.json));if(n>b){docs++;up.run(JSON.stringify(o),r.kind,r.id);}}
db.exec("commit");console.log("bare times10 strings wrapped in math:",n,"docs",docs);
