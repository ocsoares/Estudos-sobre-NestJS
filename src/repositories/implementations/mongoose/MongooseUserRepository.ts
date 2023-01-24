import { Injectable } from '@nestjs/common';
import { IUser } from 'src/models/IUser';
import { UserRepository } from 'src/repositories/abstracts/UserRepository';

// PRECISA desse @Injectable para Injetar no Repositório que está chamando lá no providers !!!

@Injectable()
export class MongooseUserRepository implements UserRepository {
    // Constructor com o Mongoose (VER DOCUMENTAÇÃO) !!

    async create(data: IUser): Promise<IUser> {
        // const createUser = await blablabla

        console.log('no MongooseUsrRepository:', data);
        let a: any;

        return a;
    }
}
