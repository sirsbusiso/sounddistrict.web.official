export interface EmailRequest {
  name: string;
  emailTo: string;
  emailFrom: string;
  subject: string;
  emailFor: string;
  message: string;
  emailHash?: string;
  token?: string;
}
