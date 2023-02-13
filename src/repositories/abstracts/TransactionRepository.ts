import { ITransaction } from 'src/models/ITransaction';

export abstract class TransactionRepository {
    abstract create(data: ITransaction): Promise<ITransaction>;
    abstract findAllById(account_id: string): Promise<ITransaction[]>;
}
