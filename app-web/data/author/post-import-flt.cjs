const {DatabaseSync}=require("node:sqlite");const db=new DatabaseSync("data/content.db");
let fixed=0,docs=0;const ex=[];const upd=db.prepare("update documents set json=? where kind='questions' and id=?");db.exec("begin");
for(const r of db.prepare("select id,json from documents where kind='questions'").all()){const d=JSON.parse(r.json);let ch=false;
 for(const q of d.questions||[]){for(const k of ["correctValue","tolerance"]){const v=q[k];if(typeof v==="number"&&isFinite(v)){const c=Number(v.toPrecision(12));if(c!==v){if(ex.length<5)ex.push(q.id.split(".").slice(-3).join(".")+" "+k+" "+v+" -> "+c);q[k]=c;fixed++;ch=true;}}}}
 if(ch){docs++;upd.run(JSON.stringify(d),r.id);}}
db.exec("commit");console.log("values cleaned",fixed,"docs",docs);console.log(ex.join("\n"));
