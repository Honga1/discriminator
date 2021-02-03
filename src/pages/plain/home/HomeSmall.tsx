import { Box } from "grommet";
import React, { PropsWithChildren } from "react";
import { colorTheme } from "../../../components/colorTheme";
import { Frame } from "./Frames";
import { Links } from "./Links";

export const HomeSmall = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Box className="home" margin="32px" gap={"48px"}>
      <Frame
        textColor={colorTheme.yellow}
        frameColor={colorTheme.black}
        heading="Discriminator"
        small
      >
        {children}
      </Frame>
      <Links />
    </Box>
  );
};
