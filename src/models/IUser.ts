// Readonly nas Props porque esse Objeto NÃO vai ser Modificado em nenhum momento no Código !!!
// OBS: O readonly NÃO impede do Objeto ser modificado (update) no Banco de Dados,
// porque ele impede apenas de ser modificado no CÓDIGO, ou seja, em Desenvolvimento !!!
export interface IUser {
    readonly id?: string;
    readonly name: string;
    readonly email: string;
    readonly password: string;
}
