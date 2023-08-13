import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { AppController } from './app.controller';
import { PropertyModule } from './property/property.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [UserModule, PropertyModule, MessageModule],
  controllers: [AppController],
})
export class AppModule {}
