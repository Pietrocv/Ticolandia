# Ticolandia — Minha Casa

Aplicativo privado para acompanhar aquisição do imóvel, reforma, prestações, pagamentos parciais e comprovantes.

## Recursos
- Gastos separados por categoria e grupo.
- Controle do valor contratado, total pago e saldo da obra.
- Financiamento com demonstrativo mensal de referência, separado do saldo dos serviços.
- Anexos PDF e imagens, identificação por gasto e prevenção de duplicidade por hash.
- Exportação CSV e importação de lançamentos conferidos.
- Autenticação ChatGPT e isolamento dos registros por usuário.

## Tecnologia
React 19, TypeScript, Vinext/Vite, Cloudflare Workers, D1 (SQLite/Drizzle) e R2.

## Desenvolvimento
Requer Node.js >=22.13.0.

```sh
npm run install:ci
npm run build
```

Aplique as migrações `drizzle/0000_graceful_black_bird.sql` e `drizzle/0001_lean_corsair.sql` na ordem real dos arquivos presentes em `drizzle/`, usando o procedimento de D1 local em [DEVELOPMENT.md](DEVELOPMENT.md). Depois execute `npm run dev`. O ambiente portátil permite uma identidade simulada apenas no acesso local; produção depende da autenticação do Sites.

Validação financeira: `node --experimental-strip-types scripts/check-finance.mjs`.
Validação de tipos: `npx tsc --noEmit`.

## Dados e publicação
Este repositório contém somente o código. Dados financeiros, comprovantes, banco de dados, credenciais e exportações privadas não fazem parte dele. Uma nova instalação começa sem os registros da aplicação existente.

O GitHub armazena o código; enviar commits aqui não publica automaticamente o aplicativo. A versão hospedada usa o Sites, com bindings DB e BUCKET declarados em `.openai/hosting.json`. Para publicar em outro ambiente, configure autenticação, D1, R2 e migrações; não exponha o Worker confiando em cabeçalhos de identidade enviados pelo navegador.

Detalhes do runtime e desenvolvimento em [DEVELOPMENT.md](DEVELOPMENT.md).

