import { Box, BoxProps, Heading, ResponsiveContext, Text } from "grommet";
import React, {
  CSSProperties,
  PropsWithChildren,
  useContext,
  useState,
} from "react";
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
    <Box className="about container" {...props} background="yellow">
      <ScrollableFrame
        textColor={colorTheme.white}
        frameColor={colorTheme.blue}
        heading="Discriminator"
      >
        {children}
      </ScrollableFrame>
    </Box>
  );
};

const ScrollableFrame = ({
  children,
  frameColor,
  textColor,
  heading,
  small = false,
}: PropsWithChildren<{
  small?: boolean;
  frameColor: string;
  textColor: string;
  heading: string;
}>) => {
  const style: CSSProperties = {
    outlineOffset: `-4px`,
    outline: `4px ${frameColor} solid`,
  };

  const [showBorder, setShowBorder] = useState(false);

  return (
    <Box className="scrollable-frame" style={style} flex={false} fill>
      <ScrollingHeadingBlock frameColor={frameColor} showBorder={showBorder}>
        <Heading
          level={1}
          color={textColor}
          margin="0"
          size={small ? "small" : "medium"}
        >
          {heading}
        </Heading>
      </ScrollingHeadingBlock>

      <Box fill>
        <Box
          flex={false}
          overflow="auto"
          onScroll={(event) =>
            setShowBorder((event.target as HTMLElement).scrollTop !== 0)
          }
          height="100%"
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

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

  return (
    <Box
      flex={false}
      className="heading-block medium"
      direction="row"
      style={bottomBorderStyle}
      background="yellow"
      justify={"between"}
    >
      <Box
        background={frameColor}
        pad={{ horizontal: "20px", vertical: "12px" }}
      >
        {children}
      </Box>
      <Box pad={{ horizontal: "20px", vertical: "12px" }}>
        <Text>X</Text>
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

  const isSmall = size === "small";
  const marginTop = isSmall ? "56px" : "48px";
  const marginHorizontal = isSmall ? "32px" : "64px";

  return (
    <Box
      gap={"40px"}
      margin={{ horizontal: marginHorizontal, top: marginTop, bottom: "64px" }}
    >
      <Text size={size === "small" ? "small" : "medium"}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget euism
        neque, sed justo, nibh pulvinar fringilla euismod scelerisque. Eu et
        scelerisque maecenas magna dolor id arcu massa orci. Nunc commodo neque,
        quis eu eget imperdiet purus duis. Venenatis, amet sapien sollicitudin
        auctor sed gravida aliquet bibendum. Lorem ipsum dolor sit amet,
        consectetur adipiscing elit. Eget euismod neque, sed justo, nibh
        pulvinar fringilla euismod scelerisque. Eu et scelerisque maecenas magna
        dolor id arcu massa orci. Nunc commodo neque, quis eu eget imperdiet
        purus duis. Venenatis, amet sapien sollicitudin auctor sed gravida
        aliquet bibendum. Lorem ipsum dolor sit amet, consectetur adipiscing
        elit. Eget euismod neque, sed justo, nibh pulvinar fringilla euismod
        scelerisque. Eu et scelerisque maecenas magna dolor id arcu massa orci.
        Nunc commodo neque, quis eu eget imperdiet purus duis. Venenatis, amet
        sapien sollicitudin auctor sed gravida aliquet bibendum.
      </Text>

      <CustomButton
        color={"red"}
        textContent={
          <span>
            Continue{" "}
            <span style={{ textDecoration: "underline" }}>without</span> webcam
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
  );
};
