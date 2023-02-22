/* eslint-disable @typescript-eslint/naming-convention */

import { IPayable } from 'src/models/IPayable';
import { PayablesRepository } from 'src/repositories/abstracts/PayablesRepository';
import { PrismaService } from '../prisma-client.service';
import { Prisma, Status } from '@prisma/client';

class PrismaPayables implements Prisma.PayablesUncheckedCreateInput {
    id?: string;
    account_id: string;
    transfer_id: string;
    transfer_amount: number;
    description: string;
    status: Status;
    payment_date: string | Date;
    createdAt?: string | Date;
    updatedAt?: string | Date;
}

export class PrismaPayablesRepository implements PayablesRepository {
    constructor(private readonly _prismaService: PrismaService) {}

    async create(data: PrismaPayables): Promise<IPayable> {
        const generate = await this._prismaService.payables.create({ data });

        return generate;
    }

    async findAllByAccountId(account_id: string): Promise<IPayable[]> {
        const payables = await this._prismaService.payables.findMany({
            where: { account_id },
        });

        return payables;
    }

    async findAllCreditPayablesByAccountId(
        account_id: string,
    ): Promise<IPayable[]> {
        const creditPayables = await this._prismaService.payables.findMany({
            where: {
                account_id,
                status: 'waiting_funds',
            },
        });

        return creditPayables;
    }

    async findAllDebitPayablesByAccountId(
        account_id: string,
    ): Promise<IPayable[]> {
        const debitPayables = await this._prismaService.payables.findMany({
            where: {
                account_id,
                status: 'paid',
            },
        });

        return debitPayables;
    }
}
