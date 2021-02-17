import { Box, BoxProps, Grid, ResponsiveContext } from "grommet";
import React, { PropsWithChildren, useContext } from "react";
import { colorTheme } from "../../../components/colorTheme";
import { Cover1 } from "../../covers/Cover1";
import { CameraIndicator } from "./CameraIndicator";
import { CoverFrame } from "./Frames";

export const Cover = () => {
  return (
    <Box fill background="grey">
      <CameraIndicator showBorder={false} backgroundColor="black" />
      <CoverContainer>
        <CoverContent />
      </CoverContainer>
    </Box>
  );
};

export const CoverContainer = ({ children }: PropsWithChildren<{}>) => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  let props: BoxProps;
  switch (size) {
    case "small":
      props = {
        margin: { horizontal: "16px", top: "16px", bottom: "16px" },
        gap: "48px",
      };
      break;
    case "medium":
      props = {
        margin: { horizontal: "16px", top: "16px", bottom: "16px" },
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
    <Box className="cover container" {...props}>
      <Grid
        responsive={false}
        areas={[
          { name: "cover", start: [0, 0], end: [0, 0] },
          {
            name: "timeline",
            start: [0, 1],
            end: [0, 1],
          },
        ]}
        fill
        columns={["full"]}
        rows={["flex", "auto"]}
        gap="15px"
      >
        <Box gridArea="cover">
          <CoverFrame
            textColor={colorTheme.black}
            frameColor={colorTheme.yellow}
            heading="Discriminator"
          >
            {children}
          </CoverFrame>
        </Box>
        <Box gridArea="timeline" gap="8px">
          <Grid
            fill
            responsive={false}
            columns={{ count: 4, size: "auto" }}
            gap={"4px"}
          >
            <Box
              background={{ color: "yellowAlternative", opacity: 0.8 }}
              height="8px"
            ></Box>
            <Box
              background={{ color: "yellowAlternative", opacity: 0.8 }}
              height="8px"
            ></Box>
            <Box
              background={{ color: "yellowAlternative", opacity: 0.8 }}
              height="8px"
            ></Box>
            <Box
              background={{ color: "yellowAlternative", opacity: 0.8 }}
              height="8px"
            ></Box>
          </Grid>

          <Box direction="row" justify="start" gap={"20px"} flex={false}>
            <Box>Pause</Box>
            <Box>Back</Box>
          </Box>
        </Box>
      </Grid>
    </Box>
  );
};

const CoverContent = () => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  const isSmall = size === "small";
  const marginTop = isSmall ? "4px" : "4px";
  const marginHorizontal = isSmall ? "4px" : "4px";

  return (
    <Box
      gap={"40px"}
      margin={{ horizontal: marginHorizontal, top: marginTop, bottom: "4px" }}
      className="cover content"
    >
      <Cover1 />
    </Box>
  );
};
