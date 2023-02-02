import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IUser } from 'src/models/IUser';
import { UserRepository } from 'src/repositories/abstracts/UserRepository';
import { User, UserDocument } from './schemas/user.schema';

// PRECISA desse @Injectable para Injetar no Repositório que está chamando lá no providers !!!

@Injectable()
export class MongooseUserRepository implements UserRepository {
    constructor(
        @InjectModel(User.name) private _userModel: Model<UserDocument>,
    ) {}

    // IUser pq ele tem Id como opcional, e preciso dele para Verificar se o Usuário JÁ existe !!
    async create(data: IUser): Promise<IUser> {
        const newUser = await this._userModel.create(data);

        return newUser.toObject(); // Usar .toObject para retornar o Objeto newUser APENAS e não o Documento gigante do Mongo !!
    }

    async findById(id: string): Promise<IUser> {
        const user = await this._userModel.findById(id);

        return user;
    }

    async findByName(name: string): Promise<IUser> {
        const user = await this._userModel.findOne({ name });

        return user;
    }

    async findByEmail(email: string): Promise<IUser> {
        const user = await this._userModel.findOne({ email });

        return user;
    }
}
