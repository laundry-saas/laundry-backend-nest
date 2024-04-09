import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID } from "class-validator";

export class CreateReviewDto {
    @ApiProperty()
    @IsUUID()
    @IsNotEmpty()
    orderId: string;

    @ApiProperty()
    @IsNumber()
    rating: number;

    @ApiProperty()
    @IsString()
    @IsOptional()
    comment?: string;

    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    customerId: string;
}
