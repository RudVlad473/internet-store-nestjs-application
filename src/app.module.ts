import { Module } from '@nestjs/common';
import { MongoRepositoryModule } from './mongo-repository/mongo-repository.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [MongoRepositoryModule, AuthModule],
})
export class AppModule {}
