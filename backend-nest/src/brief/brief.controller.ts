import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { BriefService } from './brief.service';
import { CreateBriefDto } from './dto/create-brief.dto';
import { UpdateBriefDto } from './dto/update-brief.dto';

@Controller('briefs')
export class BriefController {
  constructor(private readonly briefService: BriefService) {}

  @Post()
  async create(@Body() dto: CreateBriefDto) {
    const { brief, clarifyingQuestion } = await this.briefService.create(dto.rawInput);
    return { ...brief, clarifyingQuestion };
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.briefService.findById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateBriefDto) {
    return this.briefService.update(id, dto);
  }
}
