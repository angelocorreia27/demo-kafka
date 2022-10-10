import { Controller } from '@nestjs/common';
import {
  Ctx,
  KafkaContext,
  MessagePattern,
  Payload,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  constructor() {}

  @MessagePattern('demo.kafka.lrt')
  //listining Kafka messages
  // subscribe to outgoing within pattern
  readMessage(@Payload() message: any, @Ctx() context: KafkaContext) {
    const originalMessage = context.getMessage();
    // consume a message, then responde
    const response =
      `Receiving a new message from topic: demo.kafka.lrt: ` +
      JSON.stringify(originalMessage.value);
    console.log(response);
    return response;
  }
}
