import { Box, BoxProps, ResponsiveContext } from "grommet";
import React, { PropsWithChildren, useContext } from "react";
import { colorTheme } from "../../../components/colorTheme";
import { Cover1 } from "../../covers/Cover1";
import { CameraIndicator } from "./CameraIndicator";
import { CoverFrame } from "./Frames";

export const Cover = () => {
  return (
    <Box fill background="black">
      <CameraIndicator showBorder={false} backgroundColor="black" />
      <CoverContainer>
        <CoverContent />
      </CoverContainer>
    </Box>
  );
};

export const CoverContainer = ({ children }: PropsWithChildren<{}>) => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  let props: BoxProps;
  switch (size) {
    case "small":
      props = {
        margin: { horizontal: "16px", top: "16px", bottom: "16px" },
        gap: "48px",
      };
      break;
    case "medium":
      props = {
        margin: { horizontal: "64px", top: "16px", bottom: "64px" },
        gap: "48px",
      };
      break;
    case "large":
      props = {
        margin: { left: "64px", top: "20px", bottom: "20px" },
        width: { max: "896px" },
      };
      break;
    case "xlarge":
      props = {
        margin: { left: "112px", top: "36px", bottom: "20px" },
        width: { max: "896px" },
      };
      break;
  }

  return (
    <Box className="cover container" {...props} fill="vertical">
      <CoverFrame
        textColor={colorTheme.black}
        frameColor={colorTheme.yellow}
        heading="Discriminator"
      >
        {children}
      </CoverFrame>
    </Box>
  );
};

const CoverContent = () => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  const isSmall = size === "small";
  const marginTop = isSmall ? "4px" : "48px";
  const marginHorizontal = isSmall ? "4px" : "64px";

  return (
    <Box
      gap={"40px"}
      margin={{ horizontal: marginHorizontal, top: marginTop, bottom: "4px" }}
    >
      <Cover1 />
    </Box>
  );
};
