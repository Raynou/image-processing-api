// This should be a real class/interface representing an user entity
export type User = any;

export interface IUserService {
    findOne(username: string): Promise<User | undefined>;
    createOne(user: User): Promise<void>
}

export class UserService implements IUserService {
    createOne(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }
    findOne(username: string): Promise<User | undefined> {
        throw new Error("Method not implemented.");
    }
    
}