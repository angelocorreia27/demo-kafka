import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  imports: [
    //creating an instance is to use the ClientsModule
    ClientsModule.register([
      {
        name: 'demo',
        transport: Transport.KAFKA,
        options: {
          client: {
            clientId: 'client-demo',
            brokers: ['localhost:29092'],
          },
          consumer: {
            groupId: 'GROUP-DEMO',
          },
        },
      },
    ]),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
