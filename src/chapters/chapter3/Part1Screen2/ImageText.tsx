import { Box, ResponsiveContext, Text } from "grommet";
import { CSSProperties, useContext } from "react";
import { colorTheme } from "src/theme";
import styled from "styled-components";
import { MegafaceImageDescriptor } from "./Part1Screen2Store";

export function ImageText({
  descriptor,
}: {
  descriptor: MegafaceImageDescriptor;
}) {
  const printData = { ...descriptor } as Partial<MegafaceImageDescriptor>;
  printData.image_url = printData.url;
  delete printData["url"];

  const isSmall = useContext(ResponsiveContext) === "small";
  const smallSide: CSSProperties = {
    position: "absolute",
    top: "110%",
    left: "50%",
    transform: "translateX(-50%)",
  };
  const notSmallSide: CSSProperties = {
    position: "absolute",
    left: "110%",
    top: "50%",
    transform: "translateY(-50%)",
  };

  return (
    <Box style={isSmall ? smallSide : notSmallSide}>
      <StyledText size={isSmall ? "15%" : "30%"}>&#123;</StyledText>
      <StyledText size={isSmall ? "15%" : "30%"}>
        &nbsp;&nbsp;date: {printData.date},
      </StyledText>
      <StyledText size={isSmall ? "15%" : "30%"}>
        &nbsp;&nbsp;image_url: {printData.image_url},
      </StyledText>
      <StyledText size={isSmall ? "15%" : "30%"}>
        &nbsp;&nbsp;license: {printData.license},
      </StyledText>
      <StyledText size={isSmall ? "15%" : "30%"}>
        &nbsp;&nbsp;nsid: {printData.nsid},
      </StyledText>
      <StyledText size={isSmall ? "15%" : "30%"}>
        &nbsp;&nbsp;path_alias: {printData.path_alias},
      </StyledText>
      <StyledText size={isSmall ? "15%" : "30%"}>
        &nbsp;&nbsp;photo_id: {printData.photo_id},
      </StyledText>
      <StyledText size={isSmall ? "15%" : "30%"}>
        &nbsp;&nbsp;tagged: {printData.tagged},
      </StyledText>
      <StyledText size={isSmall ? "15%" : "30%"}>&#125;</StyledText>
    </Box>
  );
}

const StyledText = styled(Text)`
  font-smooth: always !important;
  -webkit-font-smoothing: subpixel-antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  text-rendering: optimizeLegibility;
  color: ${colorTheme.offWhite};
`;
