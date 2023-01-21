import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { IEmailService } from './IEmailService';
export class EmailService implements IEmailService {
  private emailSender: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;

  constructor() {
    this.emailSender = nodemailer.createTransport({
      host: process.env.EMAIL_SENDER_HOST,
      port: Number(process.env.EMAIL_SENDER_HOST_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_SENDER_HOST_USER,
        pass: process.env.EMAIL_SENDER_HOST_PASS
      }
    });
  }

  async sendToMany(recipients: string[], subject: string, body: string): Promise<void> {
    const promises: Promise<void>[] = [];
    recipients.map((item) => {
      promises.push(this.send(item, subject, body));
    });
    await Promise.allSettled(promises);
  }

  async send(to: string, subject: string, body: string): Promise<void> {
    try {
      await this.emailSender.sendMail({
        from: 'no-reply@notifications.dev',
        to,
        subject,
        text: body
      });
    } catch (error) {
      console.log('SEND_EMAIL_ERROR');
      console.error(error);
    }
  }
}
