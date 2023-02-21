import { Injectable } from '@nestjs/common';
import { IUser } from 'src/models/IUser';
import { UserRepository } from 'src/repositories/abstracts/UserRepository';
import { PrismaService } from '../prisma-client.service';

@Injectable()
export class PrismaUserRepository implements UserRepository {
    constructor(private readonly _prismaService: PrismaService) {}

    async create(data: IUser): Promise<IUser> {
        return null;
    }

    async findByEmail(email: string): Promise<IUser> {
        return null;
    }

    async findById(id: string): Promise<IUser> {
        return null;
    }

    async findByName(name: string): Promise<IUser> {
        return null;
    }
}
