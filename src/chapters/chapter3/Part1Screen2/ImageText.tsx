import { Box, ResponsiveContext, Text } from "grommet";
import { CSSProperties, useContext } from "react";
import { colorTheme } from "src/theme";
import { MegafaceImageDescriptor } from "./Part1Screen2Context";

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
      <Text
        size={isSmall ? "15%" : "30%"}
        color={colorTheme.offWhite}
        style={{ textRendering: "optimizeLegibility" }}
      >
        &#123;
      </Text>
      <Text
        size={isSmall ? "15%" : "30%"}
        color={colorTheme.offWhite}
        style={{ textRendering: "optimizeLegibility" }}
      >
        &nbsp;&nbsp;date: {printData.date},
      </Text>
      <Text
        size={isSmall ? "15%" : "30%"}
        color={colorTheme.offWhite}
        style={{ textRendering: "optimizeLegibility" }}
      >
        &nbsp;&nbsp;image_url: {printData.image_url},
      </Text>
      <Text
        size={isSmall ? "15%" : "30%"}
        color={colorTheme.offWhite}
        style={{ textRendering: "optimizeLegibility" }}
      >
        &nbsp;&nbsp;license: {printData.license},
      </Text>
      <Text
        size={isSmall ? "15%" : "30%"}
        color={colorTheme.offWhite}
        style={{ textRendering: "optimizeLegibility" }}
      >
        &nbsp;&nbsp;nsid: {printData.nsid},
      </Text>
      <Text
        size={isSmall ? "15%" : "30%"}
        color={colorTheme.offWhite}
        style={{ textRendering: "optimizeLegibility" }}
      >
        &nbsp;&nbsp;path_alias: {printData.path_alias},
      </Text>
      <Text
        size={isSmall ? "15%" : "30%"}
        color={colorTheme.offWhite}
        style={{ textRendering: "optimizeLegibility" }}
      >
        &nbsp;&nbsp;photo_id: {printData.photo_id},
      </Text>
      <Text
        size={isSmall ? "15%" : "30%"}
        color={colorTheme.offWhite}
        style={{ textRendering: "optimizeLegibility" }}
      >
        &nbsp;&nbsp;tagged: {printData.tagged},
      </Text>
      <Text
        size={isSmall ? "15%" : "30%"}
        color={colorTheme.offWhite}
        style={{ textRendering: "optimizeLegibility" }}
      >
        &#125;
      </Text>
    </Box>
  );
}
