import { Box } from "grommet";
import React, { PropsWithChildren } from "react";
import { colorTheme } from "../../../components/colorTheme";
import { Frame } from "./Frames";
import { Links } from "./Links";

export const HomeSmall = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Box className="home small" margin="32px" gap={"48px"}>
      <Frame
        textColor={colorTheme.yellow}
        frameColor={colorTheme.black}
        heading="Discriminator"
        small
      >
        <Box
          className="content"
          margin={{ horizontal: "32px", top: "56px", bottom: "64px" }}
        >
          {children}
        </Box>
      </Frame>
      <Links />
    </Box>
  );
};
