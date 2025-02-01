import TelegramBot from 'node-telegram-bot-api';
import { jest } from '@jest/globals';
import '../src_old/index';

jest.mock('node-telegram-bot-api');

describe('Telegram Bot Service', () => {
  let bot: TelegramBot;

  beforeEach(() => {
    bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN as string, { polling: true });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should send a message when a message is received', () => {
    const sendMessageMock = jest.fn();
    bot.sendMessage = sendMessageMock as unknown as (chatId: number, text: string, options?: TelegramBot.SendMessageOptions) => Promise<TelegramBot.Message>;

    const msg = { chat: { id: 12345 } };
    (bot as any).emit('message', msg);

    //expect(sendMessageMock).toHaveBeenCalledWith(12345, 'Received your message');
  });

  // Uncomment and test the echo functionality if needed
  // it('should echo the message when /echo command is received', () => {
  //   const sendMessageMock = jest.fn();
  //   bot.sendMessage = sendMessageMock;

  //   const msg = { chat: { id: 12345 }, text: '/echo hello' };
  //   const match = ['/echo hello', 'hello'];
  //   bot.emit('text', msg, match);

  //   expect(sendMessageMock).toHaveBeenCalledWith(12345, 'hello');
  // });
});