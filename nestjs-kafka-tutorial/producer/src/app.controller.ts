import {
  Controller,
  Get,
  Inject,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { AppService } from './app.service';
import { ClientKafka } from '@nestjs/microservices';

@Controller()
export class AppController implements OnModuleInit, OnModuleDestroy {
  constructor(
    private readonly appService: AppService,
    @Inject('demo') private readonly client: ClientKafka,
  ) {}

  async onModuleInit() {
    ['demo.kafka.lrt'].forEach((key) =>
      this.client.subscribeToResponseOf(`${key}`),
    );
    await this.client.connect();
  }

  async onModuleDestroy() {
    await this.client.close();
  }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('kafka-request')
  testKafka() {
    // message emit
    return this.client.emit('demo.kafka.lrt', {
      company: 'lrt',
      team: 'devgo',
      data: new Date().toString(),
    });
  }

  @Get('kafka-response')
  testKafkaWithResponse() {
    // message response
    return this.client.send('demo.kafka.lrt', {
      company: 'lrt',
      team: 'devgo',
      data: new Date().toString(),
    });
  }
}
