import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IPayable } from 'src/models/IPayable';
import { PayablesRepository } from 'src/repositories/abstracts/PayablesRepository';
import { Payables, PayablesDocument } from '../schemas/payables.schema';

@Injectable()
export class MongoosePayablesRepository implements PayablesRepository {
    constructor(
        @InjectModel(Payables.name)
        private readonly _payablesModel: Model<PayablesDocument>,
    ) {}

    async create(data: IPayable): Promise<IPayable> {
        const generate = await this._payablesModel.create(data);

        return generate;
    }

    async findAllByAccountId(account_id: string): Promise<IPayable[]> {
        const payables = await this._payablesModel.find({ account_id });

        return payables.map((prop) => ({
            ...prop.toObject(),
        }));
    }

    async findAllCreditPayablesByAccountId(
        account_id: string,
    ): Promise<IPayable[]> {
        const creditPayables = await this._payablesModel.find({
            account_id,
            status: 'waiting_funds',
        });

        return creditPayables.map((prop) => ({
            ...prop.toObject(),
        }));
    }

    async findAllDebitPayablesByAccountId(
        account_id: string,
    ): Promise<IPayable[]> {
        const debitPayables = await this._payablesModel.find({
            account_id,
            status: 'paid',
        });

        return debitPayables.map((prop) => ({
            ...prop.toObject(),
        }));
    }
}
