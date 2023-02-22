import { IPayable } from 'src/models/IPayable';

export abstract class PayablesRepository {
    abstract create(data: IPayable): Promise<IPayable>;
    abstract findAllByAccountId(account_id: string): Promise<IPayable[]>;

    abstract findAllCreditPayablesByAccountId(
        account_id: string,
    ): Promise<IPayable[]>;

    abstract findAllDebitPayablesByAccountId(
        account_id: string,
    ): Promise<IPayable[]>;
}
