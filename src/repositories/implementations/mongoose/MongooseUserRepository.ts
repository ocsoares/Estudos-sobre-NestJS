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

    async create(data: IUser): Promise<IUser> {
        const newUser = new this._userModel(data);

        await newUser.save();

        return newUser;
    }
}
