/* eslint-disable @typescript-eslint/naming-convention */

export interface IReturnTransfer {
    readonly date?: Date;
    readonly transfer_amount: number;
    readonly description: string;
    readonly payment_method: 'debit_card' | 'credit_card';
    readonly card_number: string;
    readonly card_holder: string;
}
