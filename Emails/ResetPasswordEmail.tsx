import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
} from '@react-email/components';

interface ResetPasswordEmailProps {
  username: string;
  resetToken: string;
}

export default function ResetPasswordEmail({ username, resetToken }: ResetPasswordEmailProps)
 {
  const Url = process.env.NEXT_PUBLIC_URL
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Reset Your Password</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: 'https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2',
            format: 'woff2',
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>Here&apos;s your password reset code: {resetToken}</Preview>
      <Section>
        <Row>
          <Heading as="h2">Hello {username},</Heading>
        </Row>
        <Row>
          <Text>
            We received a request to reset your password. Please use the following code to reset your password:
          </Text>
        </Row>
        <Row>
          <Text><b>Reset Code: {resetToken}</b></Text> 
        </Row>
        <Row>
          <Text>
            If you did not request a password reset, please ignore this email.
          </Text>
        </Row>
        <Row>
          <Button
            href={`${Url}/reset-password/${username}`}
            style={{ color: '#61dafb' }}
          >
            Reset Password
          </Button>
        </Row>
      </Section>
    </Html>
  );
}
