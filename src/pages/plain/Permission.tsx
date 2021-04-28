import { Box, BoxProps, ResponsiveContext, Text } from "grommet";
import React, {
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { colorTheme } from "../../theme";
import { PageBodyButton } from "./PageBodyButton";
import {
  PageFrame,
  PageFrameWithCameraIndicator,
} from "./../../components/Frames";
import { Links } from "./Links";
import { CameraIndicatorBox } from "../../components/CameraIndicator";
import { store } from "../../store/store";

export const Permission = () => {
  useEffect(() => {
    store.setState({ isCameraEnabled: true });
  }, []);
  const [showBorder, setShowBorder] = useState(false);
  const isSmall = useContext(ResponsiveContext) === "small";
  return (
    <Box fill>
      {!isSmall && <CameraIndicator showBorder={showBorder} />}
      <Box
        overflow="auto"
        onScroll={(event) =>
          setShowBorder((event.target as HTMLElement).scrollTop !== 0)
        }
        height="100%"
      >
        <PermissionContainer>
          <PermissionContent />
        </PermissionContainer>
      </Box>
    </Box>
  );
};

const PermissionContainer = ({ children }: PropsWithChildren<{}>) => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  let props: BoxProps;
  switch (size) {
    case "small":
      const isXSmall = window.innerWidth < 500;

      props = {
        margin: {
          horizontal: isXSmall ? "8px" : "16px",
          top: isXSmall ? "8px" : "16px",
          bottom: "32px",
        },
        gap: "48px",
      };
      break;
    case "medium":
      props = {
        margin: { horizontal: "64px", top: "16px", bottom: "64px" },
        gap: "48px",
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

  const Frame = size === "small" ? PageFrameWithCameraIndicator : PageFrame;

  return (
    <Box className="permission container" {...props}>
      <Frame
        textColor={colorTheme.yellow}
        frameColor={colorTheme.black}
        heading="Discriminator"
      >
        {children}
      </Frame>
      <Links />
    </Box>
  );
};

const PermissionContent = () => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  const isSmall = size === "small";
  const marginTop = isSmall ? "104px" : "48px";
  const marginHorizontal = isSmall ? "32px" : "64px";

  const textSize = isSmall ? "20px" : "24px";
  const lineHeight = isSmall ? "30px" : "36px";

  const DeclineText = () =>
    isSmall ? (
      <span>
        <span style={{ textDecoration: "underline" }}>Do not use</span> webcam
      </span>
    ) : (
      <span>
        Continue <span style={{ textDecoration: "underline" }}>without</span>{" "}
        webcam
      </span>
    );
  const AcceptText = () =>
    isSmall ? (
      <span>
        <span style={{ textDecoration: "underline" }}>Use</span> webcam
      </span>
    ) : (
      <span>
        Continue <span style={{ textDecoration: "underline" }}>with</span>{" "}
        webcam
      </span>
    );

  return (
    <Box
      gap={"40px"}
      margin={{ horizontal: marginHorizontal, top: marginTop, bottom: "64px" }}
    >
      <Text size={textSize} style={{ lineHeight: lineHeight }} color="black">
        To get out the best out of this experience, we recommend to enable your
        webcam. We do not store any of your information (see our privacy
        policy). If you choose to not enable your webcam you will see xyz.
      </Text>

      <PageBodyButton
        color={"red"}
        onClick={() => store.setState({ webcamStream: undefined })}
        textContent={<DeclineText />}
        href="/chapter/1?type=chapter"
      />
      <PageBodyButton
        color={"green"}
        onClick={() => store.getState().turnOnCamera()}
        textContent={<AcceptText />}
        href="/chapter/1?type=chapter"
      />
    </Box>
  );
};

const CameraIndicator = ({
  showBorder,
  backgroundColor = "yellow",
}: {
  showBorder: boolean;
  backgroundColor?: "black" | "yellow";
}) => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  const margins =
    size === "small" || size === "medium"
      ? { right: "16px", top: "16px", bottom: "12px" }
      : { right: "13px", top: "12px", bottom: "12px" };
  const bottomBorderStyle = showBorder
    ? { borderBottom: `3px solid ${colorTheme.yellowAlternative}` }
    : {};
  return (
    <Box
      fill="horizontal"
      background={backgroundColor}
      flex={false}
      style={bottomBorderStyle}
    >
      <Box direction="row" justify="end" margin={margins}>
        <CameraIndicatorBox />
      </Box>
    </Box>
  );
};
