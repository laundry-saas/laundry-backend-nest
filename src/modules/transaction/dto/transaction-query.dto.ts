import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsEnum } from 'class-validator';
import { SortOrder } from 'src/libs/commons/enums/sort-order';

export class TransactionQueryDto {
  @ApiProperty()
  @IsNumber()
  page: number = 1;

  @ApiProperty()
  @IsNumber()
  pageSize: number = 10;

  @ApiProperty()
  @IsOptional()
  @IsEnum(SortOrder)
  sort?: SortOrder;

  @ApiProperty()
  @IsOptional()
  search?: string;
}
