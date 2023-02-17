/* eslint-disable @typescript-eslint/naming-convention */

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
        const findAll = await this._payablesModel.find({ account_id });

        return findAll.map((prop) => ({
            ...prop.toObject(),
        }));
    }
}
