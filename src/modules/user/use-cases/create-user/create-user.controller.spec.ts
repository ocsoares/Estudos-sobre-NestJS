import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../../../../app.module';
import { INestApplication } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { UserRepository } from '../../../../repositories/abstracts/UserRepository';
import { IUser } from '../../../../models/IUser';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose, { Model } from 'mongoose';
import { UserModule } from '../../user.module';
import { InMemoryDbModule } from '../../../../modules/in-memory-database/in-memory-database.module';
import { CreateUserService } from './create-user.service';
import { CreateUserDTO } from './dtos/CreateUserDTO';

describe('UserController (e2e)', () => {
    let app: INestApplication;
    let userService: CreateUserService;
    // let userRepository: UserRepository;
    let mongoMemoryServer: MongoMemoryServer;
    let database: typeof mongoose;
    let uri: string;
    let User: Model<IUser>;

    // beforeAll(async () => {
    //     mongoMemoryServer = await MongoMemoryServer.create();
    //     uri = mongoMemoryServer.getUri();
    //     console.log('URI:', uri);

    //     mongoose.set('strictQuery', false);
    //     database = await mongoose.connect(uri, { dbName: 'memoryDb' });
    //     console.log('mongoURI depois de criado a Connection:', uri);

    //     User = database.model(
    //         'User',
    //         new mongoose.Schema<IUser>(
    //             {
    //                 name: { type: String, required: true, unique: true },
    //                 email: { type: String, required: true, unique: true },
    //                 password: { type: String, required: true },
    //             },
    //             {
    //                 timestamps: true,
    //             },
    //         ),
    //     );
    // });

    // afterAll(async () => {
    //     await database.connection.db.dropDatabase();
    //     await database.disconnect();
    //     await mongoMemoryServer.stop();
    // });

    beforeEach(async () => {
        const moduleFixture: TestingModule = await Test.createTestingModule({
            imports: [UserModule, InMemoryDbModule],
            providers: [
                CreateUserService,
                {
                    provide: UserRepository,
                    useValue: {
                        findByName: jest.fn(),
                        findByEmail: jest.fn(),
                        create: jest.fn(),
                    },
                },
            ],
        }).compile();

        app = moduleFixture.createNestApplication();
        // userRepository = moduleFixture.get<UserRepository>(UserRepository);
        userService = moduleFixture.get<CreateUserService>(CreateUserService);

        await app.init();
    });

    afterEach(async () => {
        await app.close();
        jest.clearAllMocks();
    });

    it('should create a new user', async () => {
        const userData: CreateUserDTO = {
            name: 'John Doe',
            email: 'johndoe@example.com',
            password: 'password',
            bola: 'd',
        } as any;

        const response = await request(app.getHttpServer())
            .post('/auth/register')
            .send(userData);
        // expect

        console.log('RESPONSE:', response.body);

        expect(response.body).toEqual({ id: '123' });
        expect(userService.execute).toHaveBeenCalledWith(userData);
        // expect(userRepository.create).toHaveBeenCalledWith(userData);
    });
});

// /* eslint-disable @typescript-eslint/no-non-null-assertion */
// import { MongoClient } from 'mongodb';
// import { MongoMemoryServer } from 'mongodb-memory-server';

// This is an Example test, do not merge it with others and do not delete this file

// describe('Single MongoMemoryServer', () => {
//     let con: MongoClient;
//     let mongoServer: MongoMemoryServer;

//     beforeAll(async () => {
//         mongoServer = await MongoMemoryServer.create();
//         con = await MongoClient.connect(mongoServer.getUri(), {});
//     });

//     afterAll(async () => {
//         if (con) {
//             await con.close();
//         }
//         if (mongoServer) {
//             await mongoServer.stop();
//         }
//     });

//     it('should successfully set & get information from the database', async () => {
//         const db = con.db(mongoServer.instanceInfo!.dbName);

//         expect(db).toBeDefined();
//         const col = db.collection('test');
//         const result = await col.insertMany([{ a: 1 }, { b: 1 }]);

//         expect(result.insertedCount).toStrictEqual(2);
//         expect(await col.countDocuments({})).toBe(2);
//     });
// });
