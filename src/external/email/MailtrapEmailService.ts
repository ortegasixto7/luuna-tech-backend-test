import nodemailer from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { IEmailService } from './IEmailService';
export class MailtrapEmailService implements IEmailService {
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
