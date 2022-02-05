import * as React from "react";
import { styled } from "@mui/material/styles";

const FixedLink = styled("a")({
  position: "fixed",
  padding: "0.5rem",
  top: "1rem",
  left: "1rem",
  zIndex: 2000,
  transition: "0.3s ease-out",
  display: "inline-flex",
  "&:hover": {
    transform: "rotate(90deg)",
  },
  "&:active": {
    transform: "rotate(90deg) scale(0.9)",
  },
});

export default function Webring() {
  return (
    <FixedLink
      href="https://webring.wonderful.software#siriwatk.dev"
      title="วงแหวนเว็บ"
    >
      <img
        alt="วงแหวนเว็บ"
        width="32"
        height="32"
        src="https://webring.wonderful.software/webring.white.svg"
      />
    </FixedLink>
  );
}
