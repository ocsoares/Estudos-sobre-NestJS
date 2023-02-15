import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
    Payables,
    PayablesSchema,
} from 'src/repositories/implementations/mongoose/schemas/payables.schema';
import { GenerateCreditCardPayableController } from './use-cases/generate-credit-card-payable/generate-credit-card-payable.controller';
import { GenerateCreditCardPayableService } from './use-cases/generate-credit-card-payable/generate-credit-card-payable.service';

@Module({
    imports: [
        MongooseModule.forFeature([
            { name: Payables.name, schema: PayablesSchema },
        ]),
    ],
    controllers: [GenerateCreditCardPayableController],
    providers: [GenerateCreditCardPayableService],
})
export class PayablesModule {}
