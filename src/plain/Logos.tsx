import { Box, ResponsiveContext } from "grommet";
import React, { useContext } from "react";
import { TribecaLaurel, ImposterMediaLogo } from "./Home";

export const Logos = () => {
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
