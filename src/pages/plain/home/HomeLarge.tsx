import { Box } from "grommet";
import React, { PropsWithChildren } from "react";
import { colorTheme } from "../../../components/colorTheme";
import { Frame } from "./Frames";
import { Links } from "./Links";

export const HomeLarge = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Box
      className="home large"
      margin={{ left: "64px", top: "96px", bottom: "20px" }}
      width={{ max: "896px" }}
    >
      <Frame
        textColor={colorTheme.yellow}
        frameColor={colorTheme.black}
        heading="Discriminator"
      >
        {children}
      </Frame>
      <Links />
    </Box>
  );
};
