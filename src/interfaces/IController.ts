export interface returnHandle {
    message: string;
    data: object;
}

// NÃO precisa passar NADA no handle porque ele NÃO precisa receber Request e Response,
// isso o Nest faz AUTOMATICAMENTE com os Decorators (ex. @Get() ) !!

export interface IController {
    handle(body?: object): Promise<returnHandle>;
}
