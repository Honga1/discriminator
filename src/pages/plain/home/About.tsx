import {
  Box,
  BoxProps,
  Heading,
  ResponsiveContext,
  Stack,
  Text,
} from "grommet";
import React, {
  CSSProperties,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
import styled from "styled-components";
import { colorTheme } from "../../../components/colorTheme";
import { CustomButton } from "./CustomButton";

export const About = () => {
  return (
    <Box fill background="yellowAlternative" overflow="hidden">
      <AboutContainer>
        <AboutContent />
      </AboutContainer>
    </Box>
  );
};

export const AboutContainer = ({ children }: PropsWithChildren<{}>) => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  let props: BoxProps;
  switch (size) {
    case "small":
      props = {
        margin: { horizontal: "32px", top: "32px", bottom: "-4px" },
        gap: "48px",
      };
      break;
    case "medium":
      props = {
        margin: { horizontal: "48px", top: "48px", bottom: "-4px" },
        gap: "48px",
      };
      break;
    case "large":
      props = {
        margin: { horizontal: "48px", top: "48px", bottom: "-4px" },
      };
      break;
    case "xlarge":
      props = {
        margin: { horizontal: "48px", top: "48px", bottom: "-4px" },
      };
      break;
  }

  const Frame =
    size === "small" || size === "medium"
      ? ScrollableFrame
      : ScrollableFrameLarge;
  return (
    <Box className="about container" {...props} background="yellow">
      <Frame
        textColor={colorTheme.white}
        frameColor={colorTheme.blue}
        heading="About"
      >
        {children}
      </Frame>
    </Box>
  );
};

const ScrollableFrame = ({
  children,
  frameColor,
  textColor,
  heading,
}: PropsWithChildren<{
  frameColor: string;
  textColor: string;
  heading: string;
}>) => {
  const style: CSSProperties = {
    outlineOffset: `-4px`,
    outline: `4px ${frameColor} solid`,
  };

  const [showBorder, setShowBorder] = useState(false);
  const isSmall = useContext(ResponsiveContext) === "small";

  const ScrollableBox = isSmall ? Box : CustomScrollbarBox;

  return (
    <Box className="scrollable-frame" style={style} flex={false} fill>
      <ScrollingHeadingBlock frameColor={frameColor} showBorder={showBorder}>
        <Heading
          level={1}
          color={textColor}
          margin="0"
          size={isSmall ? "small" : "medium"}
        >
          {heading}
        </Heading>
      </ScrollingHeadingBlock>

      <Box fill>
        <ScrollableBox
          flex={false}
          overflow={{ horizontal: "hidden", vertical: "auto" }}
          onScroll={(event) =>
            setShowBorder((event.target as HTMLElement).scrollTop !== 0)
          }
          height="100%"
          margin={{ right: isSmall ? "0" : "12px" }}
        >
          {children}
        </ScrollableBox>
      </Box>
    </Box>
  );
};

const ScrollableFrameLarge = ({
  children,
  frameColor,
  textColor,
  heading,
}: PropsWithChildren<{
  frameColor: string;
  textColor: string;
  heading: string;
}>) => {
  const style: CSSProperties = {
    outlineOffset: `-4px`,
    outline: `4px ${frameColor} solid`,
  };
  const isSmall = useContext(ResponsiveContext) === "small";

  const ScrollableBox = isSmall ? Box : CustomScrollbarBox;

  return (
    <Box className="scrollable-frame" style={style} flex={false} fill>
      <Stack fill interactiveChild="first">
        <Box fill>
          <ScrollableBox
            flex={false}
            overflow={{ horizontal: "hidden", vertical: "auto" }}
            height="100%"
            pad={{ top: "76px" }}
            margin={{ right: "12px", top: "12px" }}
          >
            {children}
          </ScrollableBox>
        </Box>
        <Box margin={{ right: "32px" }}>
          <ScrollingHeadingBlock frameColor={frameColor} showBorder={false}>
            <Heading
              level={1}
              color={textColor}
              margin="0"
              size={isSmall ? "small" : "medium"}
            >
              {heading}
            </Heading>
          </ScrollingHeadingBlock>
        </Box>
      </Stack>
    </Box>
  );
};

const CustomScrollbarBox = styled(Box)`
  &::-webkit-scrollbar {
    width: 20px;
  }

  &::-webkit-scrollbar-track {
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${colorTheme.yellowAlternative};
    outline-offset: -2px;
    outline: 2px solid ${colorTheme.black};
  }
`;

const ScrollingHeadingBlock = ({
  frameColor,
  children,
  showBorder,
}: PropsWithChildren<{
  frameColor: string;
  showBorder: boolean;
}>) => {
  const bottomBorderStyle = showBorder
    ? { borderBottom: `4px solid ${colorTheme.yellowAlternative}` }
    : {};
  const isSmall = useContext(ResponsiveContext) === "small";

  return (
    <Box
      flex={false}
      className="heading-block"
      direction="row"
      style={bottomBorderStyle}
      justify={"between"}
    >
      <Box
        background={frameColor}
        pad={{ horizontal: "20px", vertical: "12px" }}
      >
        {children}
      </Box>
      <Box pad={{ horizontal: "20px", vertical: "12px" }}>
        <Heading level={1} margin="0" size={isSmall ? "small" : "medium"}>
          X
        </Heading>
      </Box>
    </Box>
  );
};

const AboutContent = () => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  let props: BoxProps;
  switch (size) {
    case "small":
      props = {
        margin: { left: "18px", right: "18px", top: "56px" },
      };
      break;
    case "medium":
      props = {
        margin: { left: "60px", right: "28px", top: "48px" },
        width: { max: "768px" },
      };
      break;
    case "large":
      props = {
        margin: { left: "168px", right: "136px", top: "48px" },
        width: { max: "768px" },
      };
      break;
    case "xlarge":
      props = {
        margin: { left: "288px", right: "256px", top: "48px" },
        width: { max: "768px" },
      };
      break;
  }
  return (
    <Box align="center">
      <Box gap={"40px"} {...props} flex={false}>
        <Text size={size === "small" ? "small" : "medium"}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget euism
          neque, sed justo, nibh pulvinar fringilla euismod scelerisque. Eu et
          scelerisque maecenas magna dolor id arcu massa orci. Nunc commodo
          neque, quis eu eget imperdiet purus duis. Venenatis, amet sapien
          sollicitudin auctor sed gravida aliquet bibendum.
          <br />
          <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget euismod
          neque, sed justo, nibh pulvinar fringilla euismod scelerisque. Eu et
          scelerisque maecenas magna dolor id arcu massa orci. Nunc commodo
          neque, quis eu eget imperdiet purus duis. Venenatis, amet sapien
          sollicitudin auctor sed gravida aliquet bibendum.
          <br />
          <br />
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget euismod
          neque, sed justo, nibh pulvinar fringilla euismod scelerisque. Eu et
          scelerisque maecenas magna dolor id arcu massa orci. Nunc commodo
          neque, quis eu eget imperdiet purus duis. Venenatis, amet sapien
          sollicitudin auctor sed gravida aliquet bibendum.
        </Text>

        <CustomButton
          color={"red"}
          textContent={
            <span>
              Continue{" "}
              <span style={{ textDecoration: "underline" }}>without</span>{" "}
              webcam
            </span>
          }
          href="/chapter/1?isCover"
        />
        <CustomButton
          color={"green"}
          textContent={
            <span>
              Continue <span style={{ textDecoration: "underline" }}>with</span>{" "}
              webcam
            </span>
          }
          href="/chapter/1?isCover"
        />
      </Box>
    </Box>
  );
};
