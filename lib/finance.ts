export type Expense = {id:string;title:string;scope:string;category:string;supplier:string;notes:string;created:string;excluded?:number;review?:string};
export type Installment = {id:string;expense_id:string;number:number;due:string;expected:number;paid:number;paid_date:string|null;revision:number;settled_unknown?:number;projected?:number};
export type Receipt = {id:string;name:string;expense_id:string|null;notes:string;created:string};
export type Property = {price:number;downPayment:number;principal:number;mortgageId:string;referenceBalance:number|null;referenceAfter:number|null;balanceSchedule?:{number:number;month:string;balance:number}[];notes:string};
export type Ledger = {expenses:Expense[];installments:Installment[];receipts:Receipt[];property?:Property|null};
export const categories = ['Materiais + equipamentos','Mão de obra','Elétrica','Hidráulica','Acabamento','Móveis e decoração','Projetos','Aquisição e taxas','Água e luz','Financiamento','Outros'];
export function settled(i:Installment){return !!i.settled_unknown||(i.expected>0&&i.paid===i.expected);}
export function balance(i:Installment){return i.settled_unknown?0:i.expected-i.paid;}
export function status(i:Installment){return i.settled_unknown?'Pago · valor a confirmar':settled(i)?'Pago':i.projected?'Previsto · sujeito a reajuste':i.paid>0?'Parcial':i.due&&i.due<today()?'Em atraso':'Em aberto';}
export function cents(value:string):number { const normalized=value.trim().replace(/R\$\s*/g,'').replace(/\s/g,''); if(!/^\d{1,3}(\.\d{3})*(,\d{1,2})?$|^\d+(,\d{1,2})?$/.test(normalized)) throw new Error('Informe um valor como 1.250,50.'); const n=Math.round(Number(normalized.replace(/\./g,'').replace(',','.'))*100); if(!Number.isSafeInteger(n)||n<0||n>100000000000)throw new Error('Valor fora do limite.');return n; }
export function money(n:number){return (n/100).toLocaleString('pt-BR',{style:'currency',currency:'BRL'});}
export function amount(n:number){return (n/100).toFixed(2).replace('.',',');}
export function today(){return new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Sao_Paulo'}).format(new Date());}
export function validDate(v:unknown):v is string {return typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&Number.isFinite(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v;}
export function dateLabel(v:string|null){return v? v.split('-').reverse().join('/'):'Não informada';}
export function monthDate(first:string,index:number){const [y,m,d]=first.split('-').map(Number);const target=new Date(Date.UTC(y,m-1+index,1));const last=new Date(Date.UTC(target.getUTCFullYear(),target.getUTCMonth()+1,0)).getUTCDate();target.setUTCDate(Math.min(d,last));return target.toISOString().slice(0,10);}
export function schedule(total:number,count:number,first:string){const base=Math.floor(total/count),extra=total%count;return Array.from({length:count},(_,i)=>({number:i+1,expected:base+(i<extra?1:0),due:monthDate(first,i)}));}
export function totals(rows:Installment[]){return rows.reduce((a,i)=>({expected:a.expected+i.expected,paid:a.paid+i.paid,balance:a.balance+balance(i)}),{expected:0,paid:0,balance:0});}
export function csvCell(v:unknown){let s=String(v??'');if(/^[\s]*[=+@-]/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"';}
