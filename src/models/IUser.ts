// OBS: O readonly NÃO impede do Objeto ser atualizado (update) no Banco de Dados,
// porque ele impede apenas de ser atualizado no CÓDIGO, ou seja, em Desenvolvimento !!!
export interface IUser {
    readonly id?: string;
    readonly name: string;
    readonly email: string;
    readonly password: string;
}
