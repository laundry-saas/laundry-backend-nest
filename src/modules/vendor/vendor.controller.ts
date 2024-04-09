import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query } from '@nestjs/common';
import { VendorService } from './vendor.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CurrentUser } from 'src/libs/commons/decorators/current-user.decorator';
import { User } from '@prisma/client';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Vendor")
@UseGuards(JwtAuthGuard)
@Controller('vendor')
export class VendorController {
  constructor(private readonly vendorService: VendorService) {}

  @Post()
  create(@Body() createVendorDto: CreateVendorDto, @CurrentUser() user: User) {
    return this.vendorService.create(createVendorDto, user);
  }

  @Get()
  findAll(@Query() query: any) {
    const page = +query.page;
    const pageSize = +query.pageSize;
    const offset = (page - 1) * pageSize;
    return this.vendorService.findAll({limit: pageSize, offset});
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.vendorService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateVendorDto: UpdateVendorDto) {
    return this.vendorService.update(id, updateVendorDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.vendorService.remove(id);
  }
}
