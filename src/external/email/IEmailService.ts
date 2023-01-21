export interface IEmailService {
  send(to: string, subject: string, body: string): Promise<void>;
  sendToMany(recipients: string[], subject: string, body: string): Promise<void>;
}
