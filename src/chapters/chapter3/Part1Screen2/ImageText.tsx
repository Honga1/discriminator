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
    top: "130%",
    paddingLeft: "5%",
    left: "10%",
    backfaceVisibility: "hidden",
  };
  const notSmallSide: CSSProperties = {
    position: "absolute",
    left: "110%",
    paddingLeft: "10%",
    top: "50%",
    transform: "translateY(-50%)",
    backfaceVisibility: "hidden",
  };

  return (
    <Box width={"100%"} style={isSmall ? smallSide : notSmallSide}>
      <StyledText small={isSmall} size={isSmall ? "7%" : "12%"}>
        &#123;
      </StyledText>
      <StyledText small={isSmall} size={isSmall ? "7%" : "12%"}>
        &nbsp;&nbsp;date: {printData.date},
      </StyledText>
      <StyledText small={isSmall} size={isSmall ? "7%" : "12%"}>
        &nbsp;&nbsp;license: {printData.license},
      </StyledText>
      <StyledText small={isSmall} size={isSmall ? "7%" : "12%"}>
        &nbsp;&nbsp;nsid: {printData.nsid},
      </StyledText>
      <StyledText small={isSmall} size={isSmall ? "7%" : "12%"}>
        &nbsp;&nbsp;path_alias: {printData.path_alias},
      </StyledText>
      <StyledText small={isSmall} size={isSmall ? "7%" : "12%"}>
        &nbsp;&nbsp;photo_id: {printData.photo_id},
      </StyledText>
      <StyledText small={isSmall} size={isSmall ? "7%" : "12%"}>
        &nbsp;&nbsp;tagged: {printData.tagged},
      </StyledText>
      <StyledText small={isSmall} size={isSmall ? "7%" : "12%"}>
        &#125;
      </StyledText>
    </Box>
  );
}

const StyledText = styled(Text)<{ small: boolean }>`
  line-height: ${(props) => (props.small ? `175%` : `150%`)};
  font-smooth: always !important;
  -webkit-font-smoothing: subpixel-antialiased !important;
  -moz-osx-font-smoothing: grayscale !important;
  text-rendering: optimizeLegibility;
  color: ${colorTheme.offWhite};
  user-select: none;
`;
