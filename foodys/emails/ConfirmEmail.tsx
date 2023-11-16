import { Html } from "@react-email/html";
import { Text } from "@react-email/text";
import { Section } from "@react-email/section";
import { Container } from "@react-email/container";
import { Body } from "@react-email/body";
import { Button } from "@react-email/button";
import { Hr } from "@react-email/hr";
import { Img } from "@react-email/img";
import { CSSProperties } from "react";

export interface ResetPasswordProps {}

export default function ResetPassword(props: ResetPasswordProps) {
  return (
    <Html>
      <Body style={main}>
        <Container style={container}>
          <Img
            style={logo}
            src="https://foodys-images-storage.surge.sh/foodys-logo-2x.png"
            width={180}
            height={50}
            alt="Foodys"
          />
          <Text style={heading}>Confirmation of your email</Text>
          <Hr style={horizontalRule} />
          <Text style={paragraph}>
            To finalise creation of your Foodys.One account confirm your email
            by clicking on the button below
          </Text>
          <Button style={confirmButton} href="http://example.com">
            I confirm my email
          </Button>
          <Text style={footer}>
            If you are not the origin of this request, please ignore this email.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main: CSSProperties = {
  backgroundColor: "#ffffff",
  color: "#24292e",
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"',
};

const container: CSSProperties = {
  border: "1px solid lightgray",
  padding: "44px",
  borderRadius: "10px",
};

const logo: CSSProperties = {
  margin: "26px auto 35px",
};

const heading: CSSProperties = {
  fontSize: "30px",
  fontWeight: "700",
  color: "#FA6340",
  textAlign: "center" as const,
  margin: "20px 0",
};

const horizontalRule: CSSProperties = {
  margin: "16px 0",
};

const paragraph: CSSProperties = {
  fontSize: "20px",
  color: "#313743",
  textAlign: "center" as const,
  marginBottom: "46px",
};

const confirmButton: CSSProperties = {
  backgroundColor: "#FA6340",
  borderRadius: "7px",
  color: "#fff",
  fontSize: "14px",
  fontWeight: "700",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "11px 0",
  marginBottom: "20px",
  width: "100%",
};

const footer: CSSProperties = {
  fontSize: "12px",
  fontWeight: "700",
  color: "#acaeb3",
  textAlign: "center" as const,
  margin: "0",
};
