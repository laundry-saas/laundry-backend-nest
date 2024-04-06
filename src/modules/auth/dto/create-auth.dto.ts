import { UserRole } from "@prisma/client";
import { IsEnum, IsNotEmpty } from "class-validator";

export class CreateAuthDto {

    @IsNotEmpty()
    email: string;

    @IsNotEmpty()
    password: string;

    @IsEnum(UserRole)
    role: UserRole;
}
