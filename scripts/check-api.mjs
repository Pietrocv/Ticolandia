import assert from 'node:assert/strict';
const origin='http://127.0.0.1:5173';
const headers={'Cookie':'__sites_local_auth=1','Content-Type':'application/json','Origin':origin};
async function req(path,method='GET',body){const r=await fetch(origin+'/api/'+path,{method,headers,body:body?JSON.stringify(body):undefined});return {status:r.status,data:await r.json()};}
assert.equal((await fetch(origin+'/api/ledger')).status,401);
let r=await req('ledger');assert.equal(r.status,200);
r=await req('ledger','POST',{title:'TESTE LOCAL - parcelamento',scope:'reforma',category:'Materiais',supplier:'Teste',notes:'Não é dado real',total:10000,count:3,paidCount:1,first:'2026-01-31'});assert.equal(r.status,201,JSON.stringify(r));const id=r.data.id;
try{
 let ledger=(await req('ledger')).data;let rows=ledger.installments.filter(i=>i.expense_id===id);assert.equal(rows.length,3);assert.equal(rows.reduce((n,i)=>n+i.expected,0),10000);assert.equal(rows.reduce((n,i)=>n+i.paid,0),3334);
 const installment=rows.find(i=>i.number===2);
 r=await req('installment','PATCH',{...installment,paid:1000,paid_date:'2026-02-01'});assert.equal(r.status,200,JSON.stringify(r));
 r=await req('installment','PATCH',{...installment,paid:2000,paid_date:'2026-02-01'});assert.equal(r.status,409);
 ledger=(await req('ledger')).data;rows=ledger.installments.filter(i=>i.expense_id===id);assert.equal(rows.reduce((n,i)=>n+i.paid,0),4334);
 r=await req('ledger','PATCH',{id,title:'TESTE LOCAL - atualizado',scope:'casa',category:'Financiamento',supplier:'Teste',notes:''});assert.equal(r.status,200);
 assert.equal((await fetch(origin+'/api/ledger',{method:'POST',headers:{...headers,Origin:'https://invalid.example'},body:'{}'})).status,403);
 r=await req('ledger','POST',{title:'Inválido',scope:'reforma',category:'Materiais',total:-1,count:1,paidCount:0,first:'2026-02-30'});assert.equal(r.status,400);
 const form=new FormData();form.set('file',new File(['invalid'], 'invalid.pdf',{type:'application/pdf'}));assert.equal((await fetch(origin+'/api/receipts',{method:'POST',headers:{Cookie:headers.Cookie},body:form})).status,400);
 console.log('PASS: auth required; expense creation and persistence; 3 exact installments; partial payment; stale write rejection; edit; invalid input; cross-origin rejection; invalid receipt rejection.');
}finally{assert.equal((await req('ledger','DELETE',{id})).status,200);const data=(await req('ledger')).data;assert.equal(data.expenses.some(e=>e.id===id),false);assert.equal(data.installments.some(i=>i.expense_id===id),false);}
