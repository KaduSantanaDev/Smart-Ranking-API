import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PlayersModule } from './players/players.module';
import { CategoriesModule } from './categories/categories.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb+srv://admin:1234@cluster0.hlnfr.mongodb.net/smartranking?retryWrites=true&w=majority',
    { useNewUrlParser: true, useUnifiedTopology: true}),
    PlayersModule,
    CategoriesModule, 
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
