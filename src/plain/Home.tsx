import { Anchor, Box, BoxProps, Image, ResponsiveContext, Text } from "grommet";
import React, { PropsWithChildren, useContext } from "react";
import { FullWidthStack } from "src/components/FullWidthStack";
import imposterMediaLogoSrc from "src/images/imposter-media-logo.png";
import tribecaLogoSrc from "src/images/tribeca-logo.png";
import { PageFrame, PageFrameWithCameraIndicator } from "../components/Frames";
import { colorTheme } from "../theme";
import { Links } from "./Links";
import { Logos } from "./Logos";
import { PageBodyButton } from "./PageBodyButton";

export const Home = () => {
  return (
    <>
      <HomeContainer>
        <HomeContent />
      </HomeContainer>
    </>
  );
};

export const HomeContainer = ({ children }: PropsWithChildren<{}>) => {
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

  const Frame = size === "small" ? SmallFrame : PageFrame;

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

export const TribecaLaurel = () => {
  return (
    <Anchor href="https://tribecafilm.com/festival" target="_blank">
      <Image width="100%" src={tribecaLogoSrc} fit="contain"></Image>
    </Anchor>
  );
};

export const ImposterMediaLogo = () => {
  return (
    <Anchor href="https://impostermedia.com/" target="_blank">
      <Image
        width="100%"
        src={imposterMediaLogoSrc}
        fit="contain"
        style={{ imageRendering: "crisp-edges" }}
      ></Image>
    </Anchor>
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

  const isCoilUser = !!(document as any).monetization;

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

      <Box direction={isSmall ? "column" : "row"} gap="16px">
        <PageBodyButton
          color="blue"
          textContent="Start"
          config={{ type: "href", href: "/permissions" }}
          size={isSmall ? "small" : "large"}
        />
        <Box alignSelf={isSmall ? "start" : "center"}>
          <Text size="18px" style={{ lineHeight: "18px" }} color="black">
            Total running time: 15 minutes.
          </Text>
        </Box>
      </Box>
      <Text
        size={"20px"}
        style={{
          lineHeight: "30px",
          paddingRight: size === "small" || size === "medium" ? "0" : "128px",
        }}
        color="black"
      >
        {isCoilUser ? (
          <>
            As a Coil subscriber, please enjoy this personalized viewing
            experience! All payments for viewing this film as a Coil subscriber
            support the{" "}
          </>
        ) : (
          <>
            {" "}
            If you’re interested in a more personalized experience, consider
            joining{" "}
            <Anchor target="_blank" href="https://coil.com/">
              Coil
            </Anchor>
            , a micropayments service to support creators. All payments for
            viewing this film as a Coil subscriber support the{" "}
          </>
        )}
        <Anchor target="_blank" href="https://www.stopspying.org/">
          Surveillance Technology Oversight Project
        </Anchor>
        .
      </Text>
    </Box>
  );
};

const SmallFrame = ({
  children,
  frameColor,
  textColor,
  heading,
}: PropsWithChildren<{
  frameColor: string;
  textColor: string;
  heading: string;
}>) => {
  const style = {
    outlineOffset: `-3px`,
    outline: `3px ${frameColor} solid`,
  };

  const size = useContext(ResponsiveContext) as "small" | string;
  const isSmall = size === "small";
  const textSize = isSmall ? "24px" : "48px";

  return (
    <Box
      className="page frame with camera indicator"
      style={style}
      flex={false}
    >
      <FullWidthStack fill anchor="top-fill">
        <Box fill>{children}</Box>

        <Box
          className="heading-block"
          direction="row"
          flex={false}
          justify="between"
          align="start"
          style={{ userSelect: "none", pointerEvents: "none" }}
        >
          <Box
            background={frameColor}
            pad={{ horizontal: isSmall ? "16px" : "20px", vertical: "12px" }}
          >
            <Text
              size={textSize}
              color={textColor}
              style={{ lineHeight: "100%" }}
            >
              {heading}
            </Text>
          </Box>
        </Box>
      </FullWidthStack>
    </Box>
  );
};
