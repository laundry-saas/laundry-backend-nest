import { Logger } from '@nestjs/common';
import { IsBoolean, IsInt, IsString, validateSync } from 'class-validator';

import { config } from 'dotenv';
config();

class Configuration {
  private readonly logger = new Logger(Configuration.name);

  @IsString()
  readonly NODE_ENV = process.env.NODE_ENV || 'development';

  @IsString()
  readonly JWT_SECRET = process.env.JWT_SECRET as string;

  @IsInt()
  readonly JWT_EXPIRATION = Number(process.env.JWT_EXPIRATION);
}

export const Config = new Configuration();
