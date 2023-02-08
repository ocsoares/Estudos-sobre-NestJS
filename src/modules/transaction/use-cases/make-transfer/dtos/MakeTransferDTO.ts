/* eslint-disable @typescript-eslint/naming-convention */

import {
    IsCreditCard,
    IsEnum,
    IsNotEmpty,
    IsNumber,
    IsString,
    MaxLength,
    MinLength,
} from 'class-validator';

export class MakeTransferDTO {
    @IsNotEmpty()
    @IsNumber()
    readonly transfer_amount: number;

    @IsNotEmpty()
    @IsString()
    readonly description: string;

    @IsNotEmpty()
    @IsString()
    @IsEnum(['debit_card', 'credit_card'])
    readonly payment_method: 'debit_card' | 'credit_card';

    @IsNotEmpty()
    @IsString()
    @IsCreditCard()
    readonly card_number: string;

    @IsNotEmpty()
    @IsString()
    readonly card_holder: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(5)
    @MaxLength(5)
    readonly card_expiration_date: string;

    @IsNotEmpty()
    @IsString()
    @MinLength(3)
    @MaxLength(3)
    readonly cvv: string;
}
