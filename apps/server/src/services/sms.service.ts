import { prisma } from '../lib/prisma';

interface SendSMSOptions {
  to: string;
  message: string;
}

export class SMSService {
  async send(options: SendSMSOptions): Promise<string> {
    const smsLog = await prisma.sMSLog.create({
      data: {
        to: options.to,
        message: options.message,
        status: 'QUEUED',
        provider: this.getProvider(),
      },
    });

    try {
      await this.sendViaProvider(options);

      await prisma.sMSLog.update({
        where: { id: smsLog.id },
        data: {
          status: 'SENT',
          sentAt: new Date(),
          attempts: 1,
        },
      });

      return smsLog.id;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await prisma.sMSLog.update({
        where: { id: smsLog.id },
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
    if (process.env.TWILIO_ACCOUNT_SID) return 'twilio';
    if (process.env.MSG91_AUTH_KEY) return 'msg91';
    return 'console';
  }

  private async sendViaProvider(options: SendSMSOptions): Promise<void> {
    const provider = this.getProvider();

    switch (provider) {
      case 'twilio':
        await this.sendViaTwilio(options);
        break;
      case 'msg91':
        await this.sendViaMSG91(options);
        break;
      default:
        console.log('[SMS]', { to: options.to, message: options.message });
    }
  }

  private async sendViaTwilio(options: SendSMSOptions): Promise<void> {
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Twilio credentials not configured');
    }

    const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(`${accountSid}:${authToken}`).toString('base64'),
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        To: options.to,
        From: fromNumber,
        Body: options.message,
      }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(`Twilio error: ${data.message || response.statusText}`);
    }
  }

  private async sendViaMSG91(options: SendSMSOptions): Promise<void> {
    const authKey = process.env.MSG91_AUTH_KEY;
    const senderId = process.env.MSG91_SENDER_ID || 'SARVEP';
    const route = process.env.MSG91_ROUTE || '4';

    if (!authKey) {
      throw new Error('MSG91 credentials not configured');
    }

    const response = await fetch('https://api.msg91.com/api/v5/flow/', {
      method: 'POST',
      headers: {
        'authkey': authKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sender: senderId,
        route,
        mobiles: options.to,
        message: options.message,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(`MSG91 error: ${response.status} ${text}`);
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

export const smsService = new SMSService();
