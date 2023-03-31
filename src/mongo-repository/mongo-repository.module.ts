import { Module } from '@nestjs/common';
import { MongoRepositoryService } from './mongo-repository.service';

@Module({
  providers: [MongoRepositoryService]
})
export class MongoRepositoryModule {}
