import { IsString, IsNumber, IsIn, IsNotEmpty } from 'class-validator';

export class CreateTransactionDto {
  
  @IsString()
  @IsNotEmpty()
  userId: string;

  @IsNumber()
  @IsNotEmpty()
  amount: number;

  @IsString()
  @IsIn(['credit', 'debit'])
  type: 'credit' | 'debit';
}
