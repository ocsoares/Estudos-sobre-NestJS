import { Module } from '@nestjs/common';
import { MakeTransferController } from './use-cases/make-transfer/make-transfer.controller';
import { MakeTransferService } from './use-cases/make-transfer/make-transfer.service';

@Module({
    controllers: [MakeTransferController],
    providers: [MakeTransferService],
})
export class TransactionModule {}
