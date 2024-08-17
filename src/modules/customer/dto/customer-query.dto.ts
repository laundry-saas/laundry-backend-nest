import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { SortOrder } from 'src/libs/commons/enums/sort-order';

export class CustomerQueryDto {
  @ApiProperty()
  @IsString()
  page: string = '1';

  @ApiProperty()
  @IsString()
  pageSize: string = '10';

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(SortOrder)
  sort?: SortOrder;

  @ApiProperty({ required: false })
  @IsOptional()
  search?: string;
}
