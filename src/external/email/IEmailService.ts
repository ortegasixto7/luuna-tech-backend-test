export interface IEmailService {
  send(to: string, subject: string, body: string): Promise<void>;
}
