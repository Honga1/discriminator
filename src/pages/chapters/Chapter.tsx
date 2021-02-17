import { Box, Grid, Heading, ResponsiveContext, Text, Timeout } from "grommet";
import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";
import { CameraIndicator } from "../../components/CameraIndicator";
import { FullWidthStack } from "../../components/FullWidthStack";
import { Timeline } from "../../components/Timeline";
import { colorTheme } from "../../theme";
import { Chapter1 } from "./Chapter1";

export const Chapter = () => {
  return (
    <Box fill background="black">
      <ChapterContainer>
        <ChapterContent />
      </ChapterContainer>
    </Box>
  );
};

const ChapterContainer = ({ children }: PropsWithChildren<{}>) => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  if (size === "small" || size === "medium") {
    return (
      <ChapterContainerSmallMedium>{children}</ChapterContainerSmallMedium>
    );
  } else {
    return (
      <ChapterContainerLargeXLarge>{children}</ChapterContainerLargeXLarge>
    );
  }
};

const ChapterContainerSmallMedium = ({ children }: PropsWithChildren<{}>) => {
  return (
    <>
      <CameraIndicator showBorder={false} backgroundColor="black" />
      <Box className="cover container" margin="16px">
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
            <ChapterFrame textColor={colorTheme.black} heading="Discriminator">
              {children}
            </ChapterFrame>
          </Box>
          <Timeline gridArea="timeline" />
        </Grid>
      </Box>
    </>
  );
};

const ChapterContainerLargeXLarge = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Box className="cover container" margin="16px">
      <ChapterFrame textColor={colorTheme.black} heading="Discriminator">
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
          gap="12px"
        >
          <Box gridArea="cover">{children}</Box>
          <Timeline gridArea="timeline" />
        </Grid>
      </ChapterFrame>
    </Box>
  );
};

const ChapterContent = () => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  const isSmall = size === "small";
  const marginTop = isSmall ? "4px" : "4px";
  const marginHorizontal = isSmall ? "4px" : "4px";
  const marginBottom = size === "large" || size === "xlarge" ? "0" : "4px";

  return (
    <Box
      gap={"40px"}
      margin={{
        horizontal: marginHorizontal,
        top: marginTop,
        bottom: marginBottom,
      }}
      className="cover content"
    >
      <Chapter1 onFinished={() => {}} />
    </Box>
  );
};

const FadingOutline = styled(Box)<{ outlineColor: string }>`
  outline-color: ${(props) => props.outlineColor};
  outline-offset: -4px;
  outline-style: solid;
  outline-width: 4px;

  transition: all 0.4s;
`;

function useIsActive() {
  const [isActive, setIsActive] = useState(true);
  useEffect(() => {
    let timeout: Timeout | undefined;
    const onActivity = () => {
      setIsActive(true);
      if (timeout) clearTimeout(timeout);

      timeout = (setTimeout(() => {
        setIsActive(false);
      }, 4000) as unknown) as number;
    };
    window.addEventListener("mousemove", onActivity);

    return () => {
      timeout && clearTimeout(timeout);
      window.removeEventListener("mousemove", onActivity);
    };
  }, []);

  return isActive;
}

const ChapterFrame = ({
  children,
  textColor,
  heading,
}: PropsWithChildren<{
  textColor: string;
  heading: string;
}>) => {
  const size = useContext(ResponsiveContext) as "small" | string;
  const isSmall = size === "small";

  const isActive = useIsActive();
  return (
    <FadingOutline
      outlineColor={isActive ? colorTheme.yellow : colorTheme.yellowOpaque}
      className="cover-frame"
    >
      {/* <Box className="cover-frame" style={style}> */}
      <FullWidthStack fill anchor="top-fill">
        <Box fill>{children}</Box>
        <ChapterHeadingBlock frameColor={colorTheme.yellow} isActive={isActive}>
          <Heading
            level={2}
            color={textColor}
            margin="0"
            size={isSmall ? "small" : "medium"}
          >
            {heading}
          </Heading>
        </ChapterHeadingBlock>
      </FullWidthStack>
    </FadingOutline>
  );
};

const OpacityFade = styled(Box)<{ isShown: boolean }>`
  opacity: ${(props) => (props.isShown ? 1 : 0)};
  transition: all 0.4s;
`;

const ChapterHeadingBlock = ({
  frameColor,
  children,
  isActive,
}: PropsWithChildren<{
  isActive: boolean;
  frameColor: string;
}>) => {
  const size = useContext(ResponsiveContext) as "small" | string;
  const isSmall = size === "small";
  const isSmallOrMedium = isSmall || size === "medium";

  return (
    <Box
      className="heading-block"
      direction="row"
      flex={false}
      justify="between"
      align="start"
    >
      <OpacityFade
        background={frameColor}
        isShown={isActive}
        pad={{ horizontal: "20px", vertical: "12px" }}
      >
        {children}
      </OpacityFade>
      {!isSmallOrMedium && (
        <Box justify="end">
          <ChapterCameraIndicator />
        </Box>
      )}
    </Box>
  );
};

const ChapterCameraIndicator = () => {
  return (
    <Box fill="horizontal" background={"black"} flex={false}>
      <Box direction="row" justify="end">
        <Box direction="row" border={{ color: "yellow", size: "3px" }}>
          <Box
            background="redLight"
            pad={{ horizontal: "17px", vertical: "7px" }}
          >
            <Text size="small" color="grayLight">
              Camera
            </Text>
          </Box>
          <Box
            background="charcoal"
            pad={{ horizontal: "17px", vertical: "7px" }}
          >
            <Text size="small" color="grayLight">
              off
            </Text>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};
