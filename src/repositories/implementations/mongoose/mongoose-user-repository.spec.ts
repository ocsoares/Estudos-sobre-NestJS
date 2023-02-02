/* eslint-disable @typescript-eslint/naming-convention */

import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import mongoose from 'mongoose';
import { MongooseModule } from '@nestjs/mongoose';
import { IUser } from 'src/models/IUser';
import { MongooseUserRepository } from './MongooseUserRepository';
import { User, UserSchema } from './schemas/user.schema';

describe('MongooseUserRepository', () => {
    let userRepository: MongooseUserRepository;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                ConfigModule.forRoot({
                    isGlobal: true,
                    envFilePath: '.env',
                }),
                MongooseModule.forRoot(process.env.TEST_ATLAS_URL_CONNECTION),
                MongooseModule.forFeature([
                    { name: User.name, schema: UserSchema },
                ]),
            ],
            providers: [MongooseUserRepository],
        }).compile();

        userRepository = module.get<MongooseUserRepository>(
            MongooseUserRepository,
        );

        mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.TEST_ATLAS_URL_CONNECTION);
    });

    afterAll(async () => {
        await mongoose.connection.db.dropDatabase();
        await mongoose.disconnect();
    });

    it('should be defined', () => {
        expect(userRepository).toBeDefined();
    });

    it('should create a user', async () => {
        const userData: IUser = {
            name: 'Teste',
            email: 'teste@gmail.com',
            password: 'teste123',
        };

        const expectedUser = {
            ...userData,
            _id: expect.any(mongoose.Types.ObjectId),
            createdAt: expect.any(Date),
            updatedAt: expect.any(Date),
            __v: expect.any(Number),
        };
        const createdUser = await userRepository.create(userData);

        expect(createdUser).toEqual(expectedUser);
    });
});
