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

interface WelcomeEmailProps {
  name: string;
  employeeId: string;
  loginUrl: string;
}

export function WelcomeEmail({ name, employeeId, loginUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to SarvePratibha HRMS</Preview>
      <Body style={{ backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Section style={{ backgroundColor: '#0D9488', padding: '30px', borderRadius: '8px 8px 0 0' }}>
            <Heading style={{ color: '#ffffff', margin: 0 }}>Welcome to SarvePratibha</Heading>
          </Section>
          <Section style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '0 0 8px 8px' }}>
            <Text>Hello {name},</Text>
            <Text>Welcome aboard! Your HRMS account has been created successfully.</Text>
            <Text>Your Employee ID: <strong>{employeeId}</strong></Text>
            <Button href={loginUrl} style={{ backgroundColor: '#0D9488', color: '#fff', padding: '12px 24px', borderRadius: '6px', textDecoration: 'none' }}>
              Login to Portal
            </Button>
            <Text style={{ color: '#64748b', fontSize: '14px', marginTop: '20px' }}>
              If you have any questions, reach out to your HR representative.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
