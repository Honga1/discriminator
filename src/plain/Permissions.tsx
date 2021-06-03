import { Box, BoxProps, ResponsiveContext, Text } from "grommet";
import React, { PropsWithChildren, useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { CameraIndicatorBox } from "src/components/CameraIndicator";
import { PageFrame, PageFrameWithCameraIndicator } from "src/components/Frames";
import { colorTheme } from "src/theme";
import { store } from "../store/store";
import { Links } from "./Links";
import { Logos } from "./Logos";
import { PageBodyButton } from "./PageBodyButton";

export const Permissions = () => {
  useEffect(() => {
    store.setState({ isCameraEnabled: false });
  }, []);

  const isSmall = useContext(ResponsiveContext) === "small";

  return (
    <>
      {!isSmall && <CameraIndicator />}
      <PermissionsContainer>
        <Content />
      </PermissionsContainer>
    </>
  );
};

const PermissionsContainer = ({ children }: PropsWithChildren<{}>) => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  let props: BoxProps;
  switch (size) {
    case "small":
      const isXSmall = window.innerWidth < 500;
      props = {
        margin: isXSmall ? "8px" : "16px",
        gap: "48px",
        pad: { bottom: "72px" },
      };
      break;
    case "medium":
      props = {
        margin: { horizontal: "64px", top: "96px", bottom: "64px" },
        gap: "48px",
      };
      break;
    case "large":
      props = {
        margin: { left: "64px", top: "96px", bottom: "20px" },
        width: { max: "904px" },
      };
      break;
    case "xlarge":
      props = {
        margin: { left: "112px", top: "112px", bottom: "20px" },
        width: { max: "1024px" },
      };
      break;
  }

  const Frame = size === "small" ? PageFrameWithCameraIndicator : PageFrame;

  return (
    <Box className="home container" {...props}>
      <Frame
        textColor={colorTheme.yellow}
        frameColor={colorTheme.black}
        heading="Discriminator"
      >
        {children}
      </Frame>
      <Links />
      <Logos />
    </Box>
  );
};

const Content = () => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  const isSmall = size === "small";
  const marginTop = isSmall ? "104px" : "48px";
  const marginHorizontal = isSmall ? "32px" : "64px";

  const textSize = isSmall ? "20px" : "24px";
  const lineHeight = isSmall ? "30px" : "36px";

  const history = useHistory();

  return (
    <Box
      gap={"40px"}
      margin={{ horizontal: marginHorizontal, top: marginTop, bottom: "64px" }}
    >
      <Text size={textSize} style={{ lineHeight: lineHeight }} color="black">
        For the best experience, enable your webcam so we can demonstrate how
        facial recognition works. We don’t store your data - for more
        information, read our privacy policy.
      </Text>

      <Box direction={"column"} gap="16px">
        <PageBodyButton
          color="green"
          textContent="Yes, start with webcam"
          config={{
            type: "onClick",
            onClick: async () => {
              store.setState({ isCameraEnabled: false });
              store.getState().turnOnCamera();
              history.push("/chapter/1?type=cover");
            },
          }}
          size={isSmall ? "small" : "large"}
        />
        <PageBodyButton
          color="red"
          textContent="No, I don't want to use the webcam"
          config={{
            type: "onClick",
            onClick: async () => {
              store.setState({ isCameraEnabled: false });
              store.getState().turnOffCamera();
              history.push("/chapter/1?type=chapter");
            },
          }}
          size={isSmall ? "small" : "large"}
        />
      </Box>
    </Box>
  );
};

const CameraIndicator = () => {
  return (
    <Box
      style={{ position: "sticky", width: "100%", height: 0, top: 0 }}
      align="end"
    >
      <Box style={{ position: "relative" }}>
        <CameraIndicatorBox />
      </Box>
    </Box>
  );
};
