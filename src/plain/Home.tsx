import { Anchor, Box, BoxProps, ResponsiveContext, Text } from "grommet";
import React, { PropsWithChildren, useContext, useEffect } from "react";
import { colorTheme } from "../theme";
import { PageBodyButton } from "./PageBodyButton";
import { PageFrame } from "../components/Frames";
import { Links } from "./Links";
import { store } from "../store/store";

export const Home = () => {
  useEffect(() => {
    store.setState({ isCameraEnabled: true });
  }, []);

  return (
    <HomeContainer>
      <HomeContent />
    </HomeContainer>
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
      props = { margin: isXSmall ? "8px" : "16px", gap: "48px" };
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
        width: { max: "896px" },
      };
      break;
    case "xlarge":
      props = {
        margin: { left: "112px", top: "112px", bottom: "20px" },
        width: { max: "896px" },
      };
      break;
  }

  return (
    <Box className="home container" {...props}>
      <PageFrame
        textColor={colorTheme.yellow}
        frameColor={colorTheme.black}
        heading="Discriminator"
      >
        {children}
      </PageFrame>
      <Links />
    </Box>
  );
};

const HomeContent = () => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  const isSmall = size === "small";
  const marginTop = isSmall ? "56px" : "48px";
  const marginHorizontal = isSmall ? "32px" : "64px";

  const textSize = isSmall ? "20px" : "24px";
  const lineHeight = isSmall ? "30px" : "36px";

  return (
    <Box
      gap={"40px"}
      margin={{ horizontal: marginHorizontal, top: marginTop, bottom: "64px" }}
    >
      <Text size={textSize} style={{ lineHeight: lineHeight }} color="black">
        Discriminator is an interactive documentary about facial recognition
        databases directed by Brett Gaylor.
      </Text>
      <Text size={textSize} style={{ lineHeight: lineHeight }} color="black">
        Total running time: 15 minutes.
      </Text>
      <Text size={textSize} style={{ lineHeight: lineHeight }} color="black">
        For the best experience, enable your webcam so we can demonstrate how
        facial recognition works. We don’t store your data - for more
        information, read our privacy policy.
      </Text>
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

      <PageBodyButton
        color="blue"
        textContent="Start"
        href="/permissions"
        size={isSmall ? "small" : "large"}
      />
    </Box>
  );
};
