import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components';
import * as React from 'react';

interface LeaveApprovalEmailProps {
  name: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  status: 'APPROVED' | 'REJECTED';
  remarks?: string;
}

export function LeaveApprovalEmail({ name, leaveType, startDate, endDate, status, remarks }: LeaveApprovalEmailProps) {
  const isApproved = status === 'APPROVED';

  return (
    <Html>
      <Head />
      <Preview>Leave Request {isApproved ? 'Approved' : 'Rejected'}</Preview>
      <Body style={{ backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
          <Section style={{ backgroundColor: isApproved ? '#0D9488' : '#DC2626', padding: '30px', borderRadius: '8px 8px 0 0' }}>
            <Heading style={{ color: '#ffffff', margin: 0 }}>Leave {isApproved ? 'Approved' : 'Rejected'}</Heading>
          </Section>
          <Section style={{ backgroundColor: '#ffffff', padding: '30px', borderRadius: '0 0 8px 8px' }}>
            <Text>Hello {name},</Text>
            <Text>Your <strong>{leaveType}</strong> leave request has been <strong>{status.toLowerCase()}</strong>.</Text>
            <Text>Period: {startDate} to {endDate}</Text>
            {remarks && <Text>Remarks: {remarks}</Text>}
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
