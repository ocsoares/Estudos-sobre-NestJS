/* eslint-disable @typescript-eslint/naming-convention */

export interface ITransaction {
    readonly account_id: string;
    readonly date: Date;
    readonly transfer_amount: number;
    readonly description: string;
    readonly payment_method: 'debit_card' | 'credit_card';
    readonly card_number: string;
    readonly card_holder: string;
    readonly card_expiration_date: string;
    readonly cvv?: number;
}
