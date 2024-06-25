import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { PriceListService } from './price-list.service';
import { CreatePriceListDto } from './dto/create-price-list.dto';
import { UpdatePriceListDto } from './dto/update-price-list.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('PriceList')
@Controller('price-list')
export class PriceListController {
  constructor(private readonly priceListService: PriceListService) {}

  @Post()
  create(@Body() createPriceListDto: CreatePriceListDto) {
    return this.priceListService.create(createPriceListDto);
  }

  @Get(':vendorId')
  findAllByVendor(@Param('id') id: string) {
    return this.priceListService.findAllByVendor(id);
  }

  @Put(':id')
  update(
    @Param('id') id: string,
    @Body() updatePriceListDto: UpdatePriceListDto,
  ) {
    return this.priceListService.update(id, updatePriceListDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.priceListService.remove(id);
  }
}
