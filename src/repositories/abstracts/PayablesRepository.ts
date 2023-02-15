import { IPayable } from 'src/models/IPayable';

export abstract class PayablesRepository {
    abstract credit(data: IPayable): Promise<IPayable>;
}
