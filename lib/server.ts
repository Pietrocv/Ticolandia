import { env } from 'cloudflare:workers';
import { getChatGPTUser } from '@/app/chatgpt-auth';
export class InputError extends Error { constructor(message:string,public status=400){super(message);} }
export async function owner(request:Request){const user=await getChatGPTUser();if(!user)throw new InputError('Entre com sua conta para continuar.',401);if(request.method!=='GET'){const origin=request.headers.get('origin');if(origin&&origin!==new URL(request.url).origin)throw new InputError('Origem inválida.',403);}return user.userId;}
export function database(){if(!env.DB)throw new Error('DB unavailable');return env.DB;}
export function bucket(){if(!env.BUCKET)throw new Error('BUCKET unavailable');return env.BUCKET;}
export function failure(e:unknown){if(e instanceof InputError)return Response.json({error:e.message},{status:e.status});console.error('Ledger operation failed',e);return Response.json({error:'Não foi possível acessar seus dados. Tente novamente; seus campos foram preservados.'},{status:503});}
export function textField(v:unknown,max=250){if(typeof v!=='string'||v.length>max)throw new InputError('Texto inválido ou muito longo.');return v.trim();}
export async function ownedExpense(id:string,user:string){const row=await database().prepare('SELECT id FROM expenses WHERE id = ? AND owner = ?').bind(id,user).first();if(!row)throw new InputError('Lançamento não encontrado.',404);}
