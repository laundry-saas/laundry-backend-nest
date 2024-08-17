import { ApiProperty } from '@nestjs/swagger';
import { LaundryStatus } from '@prisma/client';
import { IsEnum } from 'class-validator';

export class UpdateLaundryStatus {
  @ApiProperty({ example: Object.keys(LaundryStatus).join('|') })
  @IsEnum(LaundryStatus)
  status: LaundryStatus;
}
