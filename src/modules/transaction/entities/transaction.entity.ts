import { ApiProperty } from '@nestjs/swagger';
import { Transaction, TransactionStatus } from '@prisma/client';

export class TransactionEntity implements Transaction {
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
  @ApiProperty()
  id: string;
  @ApiProperty()
  reference: string;
  @ApiProperty()
  amount: number;
  @ApiProperty()
  status: TransactionStatus;
  @ApiProperty()
  customerId: string;
}
