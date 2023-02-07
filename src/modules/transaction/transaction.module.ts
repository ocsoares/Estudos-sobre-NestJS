import { Module } from '@nestjs/common';
import { TransferController } from './use-cases/transfer/transfer.controller';
import { TransferService } from './use-cases/transfer/transfer.service';

@Module({
    controllers: [TransferController],
    providers: [TransferService],
})
export class TransactionModule {}
