import { ApiProperty } from '@nestjs/swagger';
import { Prisma, Vendor } from '@prisma/client'
export class VendorEntity implements Vendor {
    @ApiProperty()
    contactInfo: Prisma.JsonValue;
    @ApiProperty()
    id: string;
    @ApiProperty()
    name: string;
    @ApiProperty()
    locationId: string;
 
    @ApiProperty()
    userId: string;
    @ApiProperty()
    createdAt: Date;
    @ApiProperty()
    updatedAt: Date;
}
