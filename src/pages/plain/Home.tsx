import {
  Box,
  Button,
  ButtonProps,
  Heading,
  Paragraph,
  ResponsiveContext,
  Stack,
  Text,
} from "grommet";
import React, { PropsWithChildren, useContext } from "react";

export const Home = () => {
  const size = useContext(ResponsiveContext);
  const leftMargin =
    size === "large" ? "182px" : size === "medium" ? "45px" : "small";

  const rightMargin =
    size === "large" ? "70px" : size === "medium" ? "70px" : "small";
  const textSize = size === "small" ? "small" : "medium";

  return (
    <Box
      pad={{ left: leftMargin, right: rightMargin, bottom: "54px" }}
      overflow={{ vertical: "auto" }}
    >
      <Box margin={{ top: "xlarge" }} width={{ max: "950px" }} flex={true}>
        <LabelledBox heading="Discriminator" color="black">
          <Paragraph size={textSize}>
            Egestas enim cursus pretium leo, egestas blandit egestas nunc magna.
            Lectus euismod mauris faucibus massa nibh condimentum vitae nunc
            quis. Lacus vitae amet aliquam id leo. Interdum vulputate eu et
            aliquet elit morbi bibendum. Tellus euismod metus, id feugiat amet.
            Egestas enim cursus pretium leo, egestas blandit egestas nunc magna.
            Lectus euismod mauris faucibus massa nibh condimentum vitae nunc
            quis. Lacus vitae amet aliquam id leo. Interdum vulputate eu et
            aliquet elit morbi bibendum. Tellus euismod metus, id feugiat amet.
            Egestas enim cursus pretium leo, egestas blandit egestas nunc magna.
            Lectus euismod mauris faucibus massa nibh condimentum vitae nunc
            quis. Lacus vitae amet aliquam id leo. Interdum vulputate eu et
            aliquet elit morbi bibendum. Tellus euismod metus, id feugiat amet.
          </Paragraph>
          <Box direction="row">
            <StyledButton color="blue" text="Start" />
          </Box>
        </LabelledBox>
      </Box>
    </Box>
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

export const LabelledBox = ({
  heading,
  children,
  color,
}: PropsWithChildren<{
  heading: string;
  color: "black" | "red" | "blue" | "green";
}>) => {
  const size = useContext(ResponsiveContext);
  const leftMargin =
    size === "xlarge" ? "108px" : size === "large" ? "large" : "small";
  const rightMargin = size === "small" ? "small" : "70px";
  const borderWidth = size === "small" ? 3 : 5;

  return (
    <Box
      className="LabelledBox"
      style={{
        outlineOffset: `-${borderWidth}px`,
        outline: `${borderWidth}px #202122 solid`,
      }}
      flex={false}
    >
      <Stack guidingChild="last">
        <Box direction="row">
          <Box
            border={{ color, size: "medium", style: "solid" }}
            pad={{ left: "medium", vertical: "small", right: "medium" }}
            background="black"
          >
            <Heading margin="none" color="yellow">
              {heading}
            </Heading>
          </Box>
        </Box>
        <Box
          pad={{
            left: leftMargin,
            right: rightMargin,
            top: "xlarge",
            bottom: "54px",
          }}
          gap="small"
        >
          {children}
        </Box>
      </Stack>
    </Box>
  );
};
