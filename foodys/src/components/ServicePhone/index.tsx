import { CSSProperties } from "react";

const constainerStyle: CSSProperties = {
  background: 'url("/img/dashboard/service-phone-bg.png") no-repeat',
  backgroundSize: "100% auto",
  color: "#a50f78",
  fontFamily: "'Arial'",
  fontWeight: "bold",
  textAlign: "left",
  fontStyle: "normal",
  height: "26px",
  lineHeight: "26px",
  position: "relative",
  width: "231px",
  display: "block",
};

const phoneStyle: CSSProperties = {
  display: "inline-block",
  fontSize: "16px",
  textAlign: "center",
  width: "124px",
};

export function ServicePhone() {
  return (
    <a href="tel:0899186149" style={constainerStyle}>
      <span style={phoneStyle}>0899 186 149</span>
    </a>
  );
}
