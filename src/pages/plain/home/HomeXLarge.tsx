import { Box } from "grommet";
import React, { PropsWithChildren } from "react";
import { colorTheme } from "../../../components/colorTheme";
import { Frame } from "./Frames";
import { Links } from "./Links";

export const HomeXLarge = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Box
      className="home xlarge"
      margin={{ left: "112px", top: "112px", bottom: "20px" }}
      width={{ max: "896px" }}
    >
      <Frame
        textColor={colorTheme.yellow}
        frameColor={colorTheme.black}
        heading="Discriminator"
      >
        <Box
          className="content"
          margin={{ horizontal: "64px", top: "48px", bottom: "64px" }}
          gap={"40px"}
        >
          {children}
        </Box>
      </Frame>
      <Links />
    </Box>
  );
};
