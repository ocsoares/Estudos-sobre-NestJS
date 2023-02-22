/* eslint-disable @typescript-eslint/naming-convention */

import { TransactionRepository } from 'src/repositories/abstracts/TransactionRepository';
import { PrismaService } from '../prisma-client.service';
import { PaymentMethod, Prisma } from '@prisma/client';
import { IReturnTransaction } from 'src/interfaces/IReturnTransaction';

// Esse "Prisma.TransactionUncheckedCreateInput" é Gerado AUTOMATICAMENTE pelo Prisma,
// e serve para receber os Dados de ENTRADA NECESSÁRIOS do Usuário !!!
class PrismaTransaction implements Prisma.TransactionUncheckedCreateInput {
    readonly id?: string;
    readonly account_id: string;
    readonly transfer_id: string;
    readonly date?: string | Date;
    readonly transfer_amount: number;
    readonly description: string;
    readonly payment_method: PaymentMethod;
    readonly card_number: string;
    readonly card_holder: string;
    readonly createdAt?: string | Date;
    readonly updatedAt?: string | Date;
}

export class PrismaTransactionRepository implements TransactionRepository {
    constructor(private readonly _prismaService: PrismaService) {}

    async create(data: PrismaTransaction): Promise<IReturnTransaction> {
        const makeTransfer = await this._prismaService.transaction.create({
            data,
        });

        return makeTransfer;
    }

    async findAllById(account_id: string): Promise<IReturnTransaction[]> {
        const transactions = await this._prismaService.transaction.findMany({
            where: { account_id },
        });

        return transactions;
    }

    async findOneById(transfer_id: string): Promise<IReturnTransaction> {
        const transaction = await this._prismaService.transaction.findUnique({
            where: { id: transfer_id },
        });

        return transaction;
    }
}
