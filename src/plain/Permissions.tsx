import { Box, ResponsiveContext, Text } from "grommet";
import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router";
import { CameraIndicatorBox } from "src/components/CameraIndicator";
import { store } from "../store/store";
import { HomeContainer } from "./Home";
import { PageBodyButton } from "./PageBodyButton";

export const Permissions = () => {
  useEffect(() => {
    store.setState({ isCameraEnabled: true });
  }, []);

  const isSmall = useContext(ResponsiveContext) === "small";

  return (
    <>
      {!isSmall && <CameraIndicator />}
      <HomeContainer>
        <Content />
      </HomeContainer>
    </>
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
              history.push("/chapter/1?type=chapter");
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
