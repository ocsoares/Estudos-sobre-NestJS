export interface IService {
    execute(data: any): Promise<object>;
}
