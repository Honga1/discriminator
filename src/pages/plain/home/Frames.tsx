import { Box, Heading, ResponsiveContext, Stack } from "grommet";
import React, { PropsWithChildren, useContext } from "react";

export const PageFrame = ({
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
    outlineOffset: `-4px`,
    outline: `4px ${frameColor} solid`,
  };

  const size = useContext(ResponsiveContext) as "small" | string;
  const isSmall = size === "small";
  return (
    <Box className="frame" style={style} flex={false}>
      <HeadingBlock frameColor={frameColor}>
        <Heading
          level={1}
          color={textColor}
          margin="0"
          size={isSmall ? "small" : "medium"}
        >
          {heading}
        </Heading>
      </HeadingBlock>
      {children}
    </Box>
  );
};

export const CoverFrame = ({
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
    outlineOffset: `-4px`,
    outline: `4px ${frameColor} solid`,
  };

  const size = useContext(ResponsiveContext) as "small" | string;
  const isSmall = size === "small";
  return (
    <Box className="cover-frame" style={style}>
      <Stack fill anchor="top-left">
        <Box fill>{children}</Box>
        <HeadingBlock frameColor={frameColor}>
          <Heading
            level={2}
            color={textColor}
            margin="0"
            size={isSmall ? "small" : "medium"}
          >
            {heading}
          </Heading>
        </HeadingBlock>
      </Stack>
    </Box>
  );
};

const HeadingBlock = ({
  frameColor,
  children,
}: PropsWithChildren<{
  frameColor: string;
}>) => {
  return (
    <Box className="heading-block" direction="row">
      <Box
        background={frameColor}
        pad={{ horizontal: "20px", vertical: "12px" }}
      >
        {children}
      </Box>
    </Box>
  );
};
