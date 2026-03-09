import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
  Button,
} from '@react-email/components';
import * as React from 'react';

interface PasswordResetEmailProps {
  name: string;
  resetUrl: string;
}

export function PasswordResetEmail({ name, resetUrl }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your password</Preview>
      <Body style={{ backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Section style={{ backgroundColor: '#0D9488', padding: '30px', borderRadius: '8px 8px 0 0' }}>
            <Heading style={{ color: '#ffffff', margin: 0 }}>Password Reset</Heading>
          </Section>
          <Section style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '0 0 8px 8px' }}>
            <Text>Hello {name},</Text>
            <Text>We received a request to reset your password. Click the button below to proceed:</Text>
            <Button href={resetUrl} style={{ backgroundColor: '#0D9488', color: '#fff', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none' }}>
              Reset Password
            </Button>
            <Text style={{ color: '#64748b', fontSize: '14px', marginTop: '20px' }}>
              This link will expire in 1 hour. If you did not request this, please ignore this email.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
