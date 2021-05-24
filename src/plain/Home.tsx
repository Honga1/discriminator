import { Anchor, Box, BoxProps, Image, ResponsiveContext, Text } from "grommet";
import React, { PropsWithChildren, useContext, useEffect } from "react";
import { colorTheme } from "../theme";
import { PageBodyButton } from "./PageBodyButton";
import { PageFrame, PageFrameWithCameraIndicator } from "../components/Frames";
import { Links } from "./Links";
import { store } from "../store/store";

import imposterMediaLogoSrc from "src/images/imposter-media-logo.png";
import tribecaLogoSrc from "src/images/tribeca-logo.png";
import { CameraIndicatorBox } from "src/components/CameraIndicator";

export const Home = () => {
  useEffect(() => {
    store.setState({ isCameraEnabled: true });
  }, []);

  const isSmall = useContext(ResponsiveContext) === "small";

  return (
    <>
      {!isSmall && <CameraIndicator />}
      <HomeContainer>
        <HomeContent />
      </HomeContainer>
    </>
  );
};

const HomeContainer = ({ children }: PropsWithChildren<{}>) => {
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

const Logos = () => {
  const size = useContext(ResponsiveContext);
  const isSmall = size === "small";
  const isLargeOrXL = size === "large" || size === "xlarge";
  return (
    <Box
      direction={isSmall ? "column" : "row"}
      gap={isSmall ? "64px" : "32px"}
      flex={false}
      align="center"
      justify={isLargeOrXL ? "start" : "center"}
      pad={{ top: size === "medium" ? "212px" : isLargeOrXL ? "100px" : "0px" }}
    >
      <Box width="150px">
        <TribecaLaurel />
      </Box>
      <Box width="228px">
        <ImposterMediaLogo />
      </Box>
    </Box>
  );
};

const TribecaLaurel = () => {
  return <Image src={tribecaLogoSrc} fit="contain"></Image>;
};

const ImposterMediaLogo = () => {
  return (
    <Image
      src={imposterMediaLogoSrc}
      fit="contain"
      style={{ imageRendering: "crisp-edges" }}
    ></Image>
  );
};

const HomeContent = () => {
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

  return (
    <Box
      gap={"40px"}
      margin={{ horizontal: marginHorizontal, top: marginTop, bottom: "64px" }}
    >
      <Text size={textSize} style={{ lineHeight: lineHeight }} color="black">
        Discriminator is an{" "}
        <Text
          size={textSize}
          style={{ lineHeight: lineHeight }}
          color="black"
          weight="bold"
        >
          interactive documentary about facial recognition databases
        </Text>{" "}
        directed by Brett Gaylor.
      </Text>

      <Text size={textSize} style={{ lineHeight: lineHeight }} color="black">
        For the best experience, enable your webcam so we can demonstrate how
        facial recognition works. We don’t store your data - for more
        information, read our privacy policy.
      </Text>

      <Box direction={isSmall ? "column" : "row"} gap="16px">
        <PageBodyButton
          color="blue"
          textContent="Start"
          href="/chapter/1?type=chapter"
          size={isSmall ? "small" : "large"}
        />
        <Box alignSelf={isSmall ? "start" : "center"}>
          <Text size="18px" style={{ lineHeight: "18px" }} color="black">
            Total running time: 15 minutes.
          </Text>
        </Box>
      </Box>
      <Text size={textSize} style={{ lineHeight: lineHeight }} color="black">
        If you’re interested in a more personalized experience, consider joining{" "}
        <Anchor href="https://coil.com/">Coil</Anchor>, a micropayments service
        to support creators. All payments for viewing this film as a Coil
        subscriber support the{" "}
        <Anchor href="https://www.stopspying.org/">
          Surveillance Technology Oversight Project
        </Anchor>
        .
      </Text>
    </Box>
  );
};

const CameraIndicator = () => {
  return (
    <Box
      style={{ position: "sticky", width: "100%", height: 0, top: 0 }}
      align="end"
    >
      <CameraIndicatorBox />
    </Box>
  );
};
