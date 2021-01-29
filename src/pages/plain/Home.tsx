import {
  Box,
  Button,
  ButtonProps,
  Heading,
  Paragraph,
  ResponsiveContext,
  Text,
} from "grommet";
import React, { PropsWithChildren, ReactNode, useContext, useRef } from "react";
import { ThemeContext } from "styled-components";
import { RoutedButton } from "../../components/RoutedAnchor";

export const Home = () => {
  const size = useContext(ResponsiveContext);
  const leftMargin =
    size === "large" ? "182px" : size === "medium" ? "45px" : "small";

  const rightMargin =
    size === "large" ? "70px" : size === "medium" ? "70px" : "small";
  const textSize = size === "small" ? "small" : "medium";

  const ref = useRef<HTMLDivElement>(null);

  return (
    <>
      <Box
        pad={{ left: leftMargin, right: rightMargin, bottom: "54px" }}
        overflow={{ vertical: "auto" }}
      >
        <Box
          ref={ref}
          margin={{ top: "xlarge" }}
          width={{ max: "950px" }}
          flex={true}
        >
          <LabelledBox heading="Discriminator" color="black">
            <Paragraph size={textSize}>
              Egestas enim cursus pretium leo, egestas blandit egestas nunc
              magna. Lectus euismod mauris faucibus massa nibh condimentum vitae
              nunc quis. Lacus vitae amet aliquam id leo. Interdum vulputate eu
              et aliquet elit morbi bibendum. Tellus euismod metus, id feugiat
              amet.
            </Paragraph>
            <Box direction="row">
              <StyledButton color="blue" text="Start" />
            </Box>
          </LabelledBox>
        </Box>
      </Box>
      <Links />
    </>
  );
};

// ::-webkit-scrollbar {
//   -webkit-appearance: none;
//   width: 7px;
//   margin-right: 4px;
// }

// ::-webkit-scrollbar {
//   width: 0!important;
// }
// ::-webkit-scrollbar-thumb {
//   border-radius: 4px;
//   background-color: hsla(0,0%,100%,.4);
//   box-shadow: 0 0 1px rgb(0 0 0 / 40%);
// }

export const StyledButton = ({
  color,
  text,
  ...props
}: {
  color: "black" | "red" | "blue" | "green";
  text: string;
} & ButtonProps) => {
  const size = useContext(ResponsiveContext);
  const textSize = size === "small" ? "small" : "medium";

  return (
    <Box direction="row" fill>
      <Button
        color={color}
        label={
          <Text size={textSize} color={color}>
            {text}
          </Text>
        }
        size="small"
        {...props}
      ></Button>
    </Box>
  );
};

export const Links = ({}) => {
  const size = useContext(ResponsiveContext);
  const rightMargin =
    size === "large" ? "70px" : size === "medium" ? "70px" : "small";
  return (
    <Box
      direction="row"
      wrap
      gap={"small"}
      justify="end"
      margin={{ right: rightMargin }}
    >
      <RoutedButton
        margin={{ top: "medium" }}
        plain
        href={"/about"}
        label={
          <OutlinedBoxWithHeader
            color={"blue"}
            heading={<Text>About</Text>}
          ></OutlinedBoxWithHeader>
        }
      />
      <RoutedButton
        plain
        href={"/privacy"}
        label={
          <OutlinedBoxWithHeader
            color={"red"}
            heading={<Text>Privacy</Text>}
          ></OutlinedBoxWithHeader>
        }
      />
      <RoutedButton
        margin={{ top: "large" }}
        plain
        href={"/credits"}
        label={
          <OutlinedBoxWithHeader
            color={"green"}
            heading={<Text>Credits</Text>}
          ></OutlinedBoxWithHeader>
        }
      />
    </Box>
  );
};

const OutlinedBox = ({
  children,
  color,
}: PropsWithChildren<{ color: "black" | "red" | "blue" | "green" }>) => {
  const size = useContext(ResponsiveContext);
  const theme = useContext(ThemeContext);
  const borderWidth = size === "small" ? 3 : 5;

  const colorValue = theme.global.colors[color];
  return (
    <Box
      style={{
        outlineOffset: `-${borderWidth}px`,
        outline: `${borderWidth}px ${colorValue} solid`,
      }}
      flex={false}
    >
      {children}
    </Box>
  );
};

const OutlinedBoxWithHeader = ({
  children,
  heading,
  color,
}: PropsWithChildren<{
  heading: ReactNode;
  color: "black" | "red" | "blue" | "green";
}>) => {
  return (
    <OutlinedBox color={color}>
      <HeadingBlock color={color} heading={heading} />
      <Box>{children}</Box>
    </OutlinedBox>
  );
};

const HeadingBlock = ({
  heading,
  color,
}: {
  heading: ReactNode;
  color: "black" | "red" | "blue" | "green";
}) => {
  const size = useContext(ResponsiveContext);
  const rightMargin = size === "small" ? "small" : "70px";
  return (
    <Box direction="row">
      <Box
        pad={{ left: "medium", vertical: "small", right: "medium" }}
        margin={{ bottom: "large", right: rightMargin }}
        background={color}
      >
        {heading}
      </Box>
    </Box>
  );
};

export const LabelledBox = ({
  heading,
  children,
  color,
}: PropsWithChildren<{
  heading: string;
  color: "black" | "red" | "blue" | "green";
}>) => {
  const size = useContext(ResponsiveContext);
  console.log(size);
  const leftMargin = size === "large" ? "108px" : "small";
  const rightMargin = size === "small" ? "small" : "70px";

  return (
    <OutlinedBoxWithHeader
      color={color}
      heading={
        <Heading margin="none" color={color === "black" ? "yellow" : "white"}>
          {heading}
        </Heading>
      }
    >
      <Box
        pad={{
          left: leftMargin,
          right: rightMargin,
          bottom: "54px",
        }}
        gap="small"
      >
        {children}
      </Box>
    </OutlinedBoxWithHeader>
  );
};
