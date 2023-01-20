import { IEmailService } from './IEmailService';
export class EmailServiceTest implements IEmailService {
  async send(to: string, subject: string, body: string): Promise<void> {
    await Promise.resolve(() => {
      console.log({ to, subject, body });
    });
  }
}
