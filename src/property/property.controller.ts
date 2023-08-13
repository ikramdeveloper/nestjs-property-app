import {
  Req,
  Body,
  Controller,
  Post,
  UseGuards,
  Get,
  Param,
  ParseIntPipe,
  Put,
  Delete,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { PropertyService } from './property.service';
import { AuthGuard } from 'src/guards/auth.guard';
import {
  AddPropertyDto,
  PropertyResponseDto,
  UpdatePropertyDto,
} from './dtos/property.dto';
import { PropertyType } from '@prisma/client';

interface IQuery {
  type?: PropertyType;
  city?: string;
  minPrice?: ParseIntPipe;
  maxPrice?: ParseIntPipe;
}

@Controller('property')
@UseGuards(AuthGuard)
export class PropertyController {
  constructor(private readonly propertyService: PropertyService) {}

  @Post()
  async addProperty(@Req() req: Request, @Body() body: AddPropertyDto) {
    return await this.propertyService.addProperty({
      ...body,
      realtor_id: req.user.user,
    });
  }

  @Get()
  async getAllProperties(
    @Query() query: IQuery,
  ): Promise<PropertyResponseDto[]> {
    const result = await this.propertyService.getAllProperties(query);
    return result.map((property) => new PropertyResponseDto(property));
  }

  @Get(':id')
  async getPropertyById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PropertyResponseDto> {
    const result = await this.propertyService.getSingleProperty(id);
    return new PropertyResponseDto(result);
  }

  @Put(':id')
  async updatePropertyById(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdatePropertyDto,
  ) {
    return await this.propertyService.updateProperty(id, body);
  }

  @Delete(':id')
  async deletePropertyById(@Param('id', ParseIntPipe) id: number) {
    return await this.propertyService.deleteProperty(id);
  }

  @Get('realtor/:id')
  async getRelatorByProperty(
    @Req() req: Request,
    @Param('id') id: ParseIntPipe,
  ) {
    return await this.propertyService.getRealtorDetails(
      Number(id),
      req.user.user,
    );
  }
}
