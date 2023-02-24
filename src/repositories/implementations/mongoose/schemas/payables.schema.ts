import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type PayablesDocument = HydratedDocument<Payables>;

@Schema()
export class Payables {
    @Prop({ type: String, required: true })
    account_id: string;

    @Prop({ type: String, unique: true })
    transfer_id: string;

    @Prop({ type: Number, required: true })
    transfer_amount: number;

    @Prop({ type: String, required: true })
    description: string;

    @Prop({ type: String, required: true, enum: ['paid', 'waiting_funds'] })
    status: 'paid' | 'waiting_funds';

    @Prop({ type: Date, required: true })
    payment_date: Date;

    @Prop({ type: Date, default: Date.now })
    createdAt: Date;

    @Prop({ type: Date, default: Date.now })
    updatedAt: Date;
}

export const PayablesSchema = SchemaFactory.createForClass(Payables);
