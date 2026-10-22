import { sqliteTable, text, integer, index, uniqueIndex } from 'drizzle-orm/sqlite-core';
export const expenses = sqliteTable('expenses', {
  id: text('id').primaryKey(), owner: text('owner').notNull(),
  title: text('title').notNull(), scope: text('scope').notNull(), category: text('category').notNull(),
  supplier: text('supplier').notNull().default(''), notes: text('notes').notNull().default(''), created: text('created').notNull(),
  excluded: integer('excluded').notNull().default(0), review: text('review').notNull().default(''),
}, t => [index('expenses_owner').on(t.owner)]);
export const installments = sqliteTable('installments', {
  id: text('id').primaryKey(), expenseId: text('expense_id').notNull().references(() => expenses.id),
  number: integer('number').notNull(), due: text('due').notNull(), expected: integer('expected').notNull(),
  paid: integer('paid').notNull().default(0), paidDate: text('paid_date'), revision: integer('revision').notNull().default(0),
  settledUnknown: integer('settled_unknown').notNull().default(0), projected: integer('projected').notNull().default(0),
}, t => [index('installments_expense').on(t.expenseId)]);
export const receipts = sqliteTable('receipts', {
  id: text('id').primaryKey(), owner: text('owner').notNull(), name: text('name').notNull(),
  mime: text('mime').notNull(), hash: text('hash').notNull(), expenseId: text('expense_id').references(() => expenses.id),
  notes: text('notes').notNull().default(''), created: text('created').notNull(),
}, t => [index('receipts_owner').on(t.owner), uniqueIndex('receipts_owner_hash').on(t.owner,t.hash)]);
export const property = sqliteTable('property', {owner:text('owner').primaryKey(), data:text('data').notNull()});
export const imports = sqliteTable('imports', {id:text('id').primaryKey(),owner:text('owner').notNull(),batch:text('batch').notNull(),created:text('created').notNull()},t=>[uniqueIndex('imports_owner_batch').on(t.owner,t.batch)]);
export const receiptMatches = sqliteTable('receipt_matches', {id:text('id').primaryKey(),owner:text('owner').notNull(),hash:text('hash').notNull(),expenseId:text('expense_id').references(()=>expenses.id),notes:text('notes').notNull().default('')},t=>[uniqueIndex('receipt_matches_owner_hash').on(t.owner,t.hash)]);
