-- DropForeignKey
ALTER TABLE "payables" DROP CONSTRAINT "payables_account_id_fkey";

-- DropForeignKey
ALTER TABLE "transactions" DROP CONSTRAINT "transactions_account_id_fkey";
