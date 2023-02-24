export interface IPayable {
    readonly account_id: string;
    readonly transfer_id?: string;
    readonly transfer_amount: number;
    readonly description: string;
    readonly status: 'paid' | 'waiting_funds';
    readonly payment_date: Date;
}
