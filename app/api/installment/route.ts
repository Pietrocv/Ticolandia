import type {Installment} from '@/lib/finance';
import { database,failure,owner,InputError } from '@/lib/server';
import {installmentInput} from '@/lib/import-schema';
export async function PATCH(request:Request){try{
 const user=await owner(request),b=await request.json() as Installment;
 const parsed=installmentInput.safeParse(b);if(!parsed.success||!Number.isInteger(b.revision))throw new InputError('Confira os valores e as datas. Se o pagamento foi confirmado sem valor conhecido, marque a opção correspondente e deixe os valores em zero.');
 const i=parsed.data;
 const result=await database().prepare('UPDATE installments SET expected=?,paid=?,due=?,paid_date=?,settled_unknown=?,projected=?,revision=revision+1 WHERE id=? AND revision=? AND EXISTS (SELECT 1 FROM expenses e WHERE e.id=installments.expense_id AND e.owner=?)').bind(i.expected,i.paid,i.due,i.paid>0||i.settled_unknown?i.paid_date||null:null,i.settled_unknown,i.projected,b.id,b.revision,user).run();
 if(result.meta.changes===0)throw new InputError('Esta parcela mudou. Atualize a página antes de editar novamente.',409);return Response.json({ok:true});
}catch(e){return failure(e);}}
