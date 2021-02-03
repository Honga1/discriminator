import { Box, Heading } from "grommet";
import React, { PropsWithChildren } from "react";

export const Frame = ({
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
  const style = {
    outlineOffset: `-${4}px`,
    outline: `${4}px ${frameColor} solid`,
  };
  return (
    <Box className="frame medium" style={style}>
      <HeadingBlock frameColor={frameColor}>
        <Heading
          level={1}
          color={textColor}
          margin="0"
          size={small ? "small" : "medium"}
        >
          {heading}
        </Heading>
      </HeadingBlock>
      {children}
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
    <Box className="heading-block medium" direction="row">
      <Box
        background={frameColor}
        pad={{ horizontal: "20px", vertical: "12px" }}
      >
        {children}
      </Box>
    </Box>
  );
};
