import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AnimeService } from './anime.service';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';

@Controller('anime')
export class AnimeController {
  constructor(private readonly animeService: AnimeService) {}

  @Post()
  create(@Body() createAnimeDto: CreateAnimeDto) {
    return this.animeService.create(createAnimeDto);
  }

  @Get()
  findAll() {
    return this.animeService.findAll();
  }

  @Get(':slug')
  findOne(@Param('slug') slug: string) {
    return this.animeService.findOne(slug);
  }

  @Patch(':slug')
  update(@Param('slug') slug: string, @Body() updateAnimeDto: UpdateAnimeDto) {
    return this.animeService.update(slug, updateAnimeDto);
  }

  @Delete(':slug')
  remove(@Param('slug') slug: string) {
    return this.animeService.remove(slug);
  }
}
