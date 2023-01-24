import { IUser } from 'src/models/IUser';

// TEM que ser Abstrata para Injetar no constructor, porque interface NÃO funciona NESSE caso !!
export abstract class UserRepository {
    abstract create(data: IUser): Promise<IUser>;
}
