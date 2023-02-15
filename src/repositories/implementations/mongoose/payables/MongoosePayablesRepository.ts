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

    async credit(data: IPayable): Promise<IPayable> {
        const generate = await this._payablesModel.create(data);

        return generate;
    }
}
