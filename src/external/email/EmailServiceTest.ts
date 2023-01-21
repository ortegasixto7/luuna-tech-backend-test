import { IEmailService } from './IEmailService';
export class EmailServiceTest implements IEmailService {
  async sendToMany(recipients: string[], subject: string, body: string): Promise<void> {
    await Promise.resolve(() => {
      console.log({ recipients, subject, body });
    });
  }

  async send(to: string, subject: string, body: string): Promise<void> {
    await Promise.resolve(() => {
      console.log({ to, subject, body });
    });
  }
}
