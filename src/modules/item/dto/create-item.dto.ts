import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString } from "class-validator";

export class CreateItemDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty()
    @IsOptional()
    description: string;

    @ApiProperty()
    @IsOptional()
    imageUrl: string;

    @ApiProperty()
    @IsNumber()
    price: number;

    @ApiProperty()
    @IsNotEmpty()
    vendorId: string;
}
