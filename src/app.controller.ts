import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import {
  Client,
  ClientProxy,
  EventPattern,
  MessagePattern,
  Payload,
  Transport,
} from '@nestjs/microservices';

@Controller('user')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Client({
    transport: Transport.RMQ,
    options: { urls: ['amqp://localhost:5672'], queue: 'users' },
  })
  client: ClientProxy;

  @MessagePattern('users')
  getHello(
    @Payload() user: { id: string; name: string; email: string },
  ): string {
    console.log({ user });
    return this.appService.getHello();
  }

  @Post()
  postMessage(): void {
    const user = {
      id: '2',
      name: 'Wand',
      email: 'contato@wandersonantunes.me',
    };
    this.client.emit('users', user);
  }
}
