import {GET as getLedger} from '../ledger/route';
import {amount,balance,csvCell,dateLabel,status,today,type Ledger} from '@/lib/finance';
export async function GET(request:Request){
 const response=await getLedger(request);if(!response.ok)return response;
 const data=await response.json() as Ledger;
 const rows:unknown[][]=[['Grupo','Descrição','Categoria','Fornecedor','Parcela','Vencimento','Valor previsto (R$)','Valor pago (R$)','Saldo (R$)','Data do pagamento','Situação','Observações','Comprovantes','Valor previsto?','Incluído nos totais?','Pendência']];
 for(const i of data.installments){const e=data.expenses.find(e=>e.id===i.expense_id)!;rows.push([e.scope==='casa'?'Casa':'Reforma',e.title,e.category,e.supplier,i.number,dateLabel(i.due),i.settled_unknown?'':amount(i.expected),i.settled_unknown?'':amount(i.paid),amount(balance(i)),i.paid_date?dateLabel(i.paid_date):'',status(i),e.notes,data.receipts.filter(r=>r.expense_id===e.id).map(r=>r.name).join(' | '),i.projected?'Sim':'Não',e.excluded?'Não':'Sim',e.review||'']);}
 const csv='\uFEFF'+rows.map(row=>row.map(csvCell).join(';')).join('\r\n');
 return new Response(csv,{headers:{'Content-Type':'text/csv; charset=utf-8','Content-Disposition':`attachment; filename="minha-casa-parcelas-${today()}.csv"`,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff'}});
}
