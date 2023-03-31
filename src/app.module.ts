import { Module } from '@nestjs/common';
import { MongoRepositoryModule } from './mongo-repository/mongo-repository.module';

@Module({
  imports: [MongoRepositoryModule],
})
export class AppModule {}
