import { prisma } from '../lib/prisma';

interface SendEmailOptions {
  to: string;
  subject: string;
  body: string;
  from?: string;
}

export class EmailService {
  private defaultFrom: string;

  constructor() {
    this.defaultFrom = process.env.EMAIL_FROM || 'noreply@sarvepratibha.com';
  }

  async send(options: SendEmailOptions): Promise<string> {
    const emailLog = await prisma.emailLog.create({
      data: {
        to: options.to,
        from: options.from || this.defaultFrom,
        subject: options.subject,
        body: options.body,
        status: 'QUEUED',
        provider: this.getProvider(),
      },
    });

    try {
      await this.sendViaProvider(options);

      await prisma.emailLog.update({
        where: { id: emailLog.id },
        data: {
          status: 'SENT',
          sentAt: new Date(),
          attempts: 1,
        },
      });

      return emailLog.id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await prisma.emailLog.update({
        where: { id: emailLog.id },
        data: {
          status: 'FAILED',
          error: errorMessage,
          attempts: 1,
        },
      });
      throw error;
    }
  }

  private getProvider(): string {
    if (process.env.SENDGRID_API_KEY) return 'sendgrid';
    if (process.env.SMTP_HOST) return 'smtp';
    return 'console';
  }

  private async sendViaProvider(options: SendEmailOptions): Promise<void> {
    const provider = this.getProvider();

    switch (provider) {
      case 'sendgrid':
        await this.sendViaSendGrid(options);
        break;
      case 'smtp':
        await this.sendViaSMTP(options);
        break;
      default:
        // Console fallback for development
        console.log('[EMAIL]', {
          to: options.to,
          subject: options.subject,
          body: options.body.substring(0, 100) + '...',
        });
    }
  }

  private async sendViaSendGrid(options: SendEmailOptions): Promise<void> {
    const apiKey = process.env.SENDGRID_API_KEY;
    if (!apiKey) throw new Error('SendGrid API key not configured');

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: options.to }] }],
        from: { email: options.from || this.defaultFrom },
        subject: options.subject,
        content: [{ type: 'text/html', value: options.body }],
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`SendGrid error: ${response.status} ${text}`);
    }
  }

  private async sendViaSMTP(options: SendEmailOptions): Promise<void> {
    // Dynamically import nodemailer only when SMTP is configured
    try {
      const nodemailer = await import('nodemailer');
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      await transporter.sendMail({
        from: options.from || this.defaultFrom,
        to: options.to,
        subject: options.subject,
        html: options.body,
      });
    } catch (error) {
      if (error instanceof Error && error.message.includes('Cannot find module')) {
        console.warn('[EMAIL] nodemailer not installed, falling back to console log');
        console.log('[EMAIL-SMTP]', { to: options.to, subject: options.subject });
      } else {
        throw error;
      }
    }
  }

  interpolateTemplate(template: string, variables: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(variables)) {
      result = result.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
    }
    return result;
  }
}

export const emailService = new EmailService();
