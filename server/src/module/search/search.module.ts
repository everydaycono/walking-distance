import { Module } from '@nestjs/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Search } from './search.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Search])],
  controllers: [SearchController],
  providers: [SearchService]
})
export class SearchModule {}
