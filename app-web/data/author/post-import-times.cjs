const {DatabaseSync}=require("node:sqlite");const db=new DatabaseSync("data/content.db");
const BS=String.fromCharCode(92);let n=0;const ex=[];
function fixMath(s){let y=s;
 y=y.replace(/(\d)\s*[x×]\s*10\^(-?\d+)/g,(m,a,e)=>a+BS+"times10^{"+e+"}");   // 2.0 x 10^11 -> 2.0\times10^{11}
 y=y.replace(/10\^(-?\d{2,})(?![\d}])/g,(m,e)=>"10^{"+e+"}");                    // 10^11 -> 10^{11}
 if(y!==s){n++;if(ex.length<4)ex.push(s.slice(0,70)+"  =>  "+y.slice(0,70));}return y;}
function walk(x,key){if(typeof x==="string"){if(key==="latex")return fixMath(x);return x.replace(/\$([^$]+)\$/g,(m,z)=>"$"+fixMath(z)+"$");}
 if(Array.isArray(x))return x.map(v=>walk(v,key));if(x&&typeof x==="object"){const o={};for(const k in x)o[k]=walk(x[k],k);return o;}return x;}
const up=db.prepare("update documents set json=? where kind=? and id=?");let docs=0;db.exec("begin");
for(const r of db.prepare("select kind,id,json from documents where kind in ('lesson','questions')").all()){if(!/10\^|\d\s*[x×]\s*10/.test(r.json))continue;const b=n;const o=walk(JSON.parse(r.json));if(n>b){docs++;up.run(JSON.stringify(o),r.kind,r.id);}}
db.exec("commit");console.log("math strings fixed",n,"docs",docs);console.log(ex.join("\n"));
