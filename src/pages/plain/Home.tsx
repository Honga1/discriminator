import {
  Box,
  Button,
  ButtonProps,
  Heading,
  Paragraph,
  ResponsiveContext,
  Text,
} from "grommet";
import React, { PropsWithChildren, useContext, useRef } from "react";
import { RoutedButton } from "../../components/RoutedAnchor";
import { HomeMedium } from "./HomeMedium";
import { HomeSmall } from "./HomeSmall";
import { OutlinedBoxWithHeader } from "./OutlinedBox";

export const Home = () => {
  const size = useContext(ResponsiveContext);
  const ref = useRef<HTMLDivElement>(null);

  if (size === "small") {
    return <HomeSmall />;
  }

  if (size === "medium") {
    return <HomeMedium />;
  }
  const leftMargin =
    size === "large" ? "182px" : size === "medium" ? "45px" : "small";

  const rightMargin =
    size === "large" ? "70px" : size === "medium" ? "70px" : "small";
  const textSize = size === "small" ? "small" : "medium";

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
