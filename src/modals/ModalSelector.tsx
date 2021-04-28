import { Box, BoxProps, Layer, ResponsiveContext, Text } from "grommet";
import {
  CSSProperties,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { useHistory } from "react-router-dom";
import { ModalButton } from "../components/ModalButton";
import { useQuery } from "../hooks/useQuery";
import { useStore } from "../store/store";
import { colorTheme } from "../theme";
import { About } from "./About";
import { Credits } from "./Credits";
import { CustomScrollbarBox } from "../components/CustomScrollbarBox";
import { Privacy } from "./Privacy";

export const ModalSelector = () => {
  const query = useQuery();
  const history = useHistory();

  const close = useCallback(() => {
    query.delete("modal");
    history.push({
      ...history.location,
      search: query.toString(),
    });
  }, [history, query]);

  switch (query.get("modal")) {
    case "about":
      return (
        <Modal
          onClose={close}
          frameColor={colorTheme.blue}
          textColor={colorTheme.white}
          heading="About"
        >
          <About />
        </Modal>
      );
    case "privacy":
      return (
        <Modal
          onClose={close}
          frameColor={colorTheme.red}
          textColor={colorTheme.white}
          heading="Privacy"
        >
          <Privacy />
        </Modal>
      );
    case "credits":
      return (
        <Modal
          onClose={close}
          frameColor={colorTheme.green}
          textColor={colorTheme.white}
          heading="Credits"
        >
          <Credits />
        </Modal>
      );
    default:
      return null;
  }
};

const Modal = ({
  onClose,
  children,
  frameColor,
  textColor,
  heading,
}: PropsWithChildren<{
  onClose: () => void;
  frameColor: string;
  textColor: string;
  heading: string;
}>) => {
  const backgroundColor = useStore((state) =>
    state.chapter !== undefined ? "black" : "yellowAlternative"
  );
  return (
    <>
      <Layer
        full
        responsive={false}
        animate
        position={"bottom"}
        onEsc={onClose}
        animation={"fadeIn"}
      >
        <Box fill background={backgroundColor}></Box>
      </Layer>
      <Layer
        full
        responsive={false}
        animate
        position={"bottom"}
        onEsc={onClose}
        animation={"slide"}
        style={{
          backgroundColor: "rgba(0,0,0,0)",
        }}
      >
        <ModalContainer
          frameColor={frameColor}
          textColor={textColor}
          heading={heading}
        >
          <ModalContent>{children}</ModalContent>
        </ModalContainer>
      </Layer>
    </>
  );
};

const ModalContainer = ({
  children,
  textColor,
  frameColor,
  heading,
}: PropsWithChildren<{
  frameColor: string;
  textColor: string;
  heading: string;
}>) => {
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
          bottom: "-4px",
        },
        gap: "48px",
      };
      break;
    case "medium":
      props = {
        margin: { horizontal: "48px", top: "48px", bottom: "-4px" },
        gap: "48px",
      };
      break;
    case "large":
      props = {
        margin: { horizontal: "48px", top: "48px", bottom: "-4px" },
        width: { max: "1080px" },
      };
      break;
    case "xlarge":
      props = {
        margin: { horizontal: "48px", top: "48px", bottom: "-4px" },
        width: { max: "1080px" },
      };
      break;
  }

  return (
    <Box fill overflow="hidden" align="center">
      <Box className="modal container" {...props} background="yellow">
        <ScrollableFrame
          textColor={textColor}
          frameColor={frameColor}
          heading={heading}
        >
          {children}
        </ScrollableFrame>
      </Box>
    </Box>
  );
};

const ScrollableFrame = ({
  children,
  frameColor,
  textColor,
  heading,
}: PropsWithChildren<{
  frameColor: string;
  textColor: string;
  heading: string;
}>) => {
  const style: CSSProperties = {
    outlineOffset: `-3px`,
    outline: `3px ${frameColor} solid`,
  };

  const [showBorder, setShowBorder] = useState(false);
  const isSmall = useContext(ResponsiveContext) === "small";
  const textSize = isSmall ? "24px" : "48px";

  const ScrollableBox = isSmall ? Box : CustomScrollbarBox;

  return (
    <Box className="scrollable-frame" style={style} flex={false} fill>
      <ScrollingHeadingBlock frameColor={frameColor} showBorder={showBorder}>
        <Text size={textSize} color={textColor} style={{ lineHeight: "100%" }}>
          {heading}
        </Text>
      </ScrollingHeadingBlock>

      <Box fill>
        <ScrollableBox
          flex={false}
          overflow={{ horizontal: "hidden", vertical: "auto" }}
          onScroll={(event) =>
            setShowBorder((event.target as HTMLElement).scrollTop !== 0)
          }
          height="100%"
          margin={{ right: isSmall ? "0" : "12px" }}
        >
          {children}
        </ScrollableBox>
      </Box>
    </Box>
  );
};

const ScrollingHeadingBlock = ({
  frameColor,
  children,
  showBorder,
}: PropsWithChildren<{
  frameColor: string;
  showBorder: boolean;
}>) => {
  let bottomBorderStyle = showBorder
    ? { borderBottom: `3px solid ${colorTheme.yellowAlternative}` }
    : { borderBottom: `3px solid ${colorTheme.yellow}` };

  const isSmall = useContext(ResponsiveContext) === "small";

  return (
    <Box
      flex={false}
      className="heading-block"
      direction="row"
      style={bottomBorderStyle}
      justify={"between"}
    >
      <Box
        background={frameColor}
        pad={{ horizontal: isSmall ? "16px" : "20px", vertical: "12px" }}
      >
        {children}
      </Box>
      {isSmall ? <CloseButtonSmall /> : <CloseButtonNotSmall />}
    </Box>
  );
};

const CloseButtonSmall = () => {
  return (
    <Box pad={{ right: "11px", top: "10px" }}>
      <ModalButton
        query={{ key: "modal", operation: "close" }}
        plain
        fill
        label={
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="6.82837"
              y="4"
              width="29.1079"
              height="4"
              transform="rotate(45 6.82837 4)"
              fill="#202122"
            />
            <rect
              x="27.4109"
              y="6.82849"
              width="29.1079"
              height="4"
              transform="rotate(135 27.4109 6.82849)"
              fill="#202122"
            />
          </svg>
        }
      />
    </Box>
  );
};

const CloseButtonNotSmall = () => {
  return (
    <Box pad={{ right: "6px", top: "4px" }}>
      <ModalButton
        query={{ key: "modal", operation: "close" }}
        plain
        fill
        label={
          <svg
            width="64"
            height="64"
            viewBox="0 0 64 64"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="13.6567"
              y="8"
              width="58.2158"
              height="8"
              transform="rotate(45 13.6567 8)"
              fill="#202122"
            />
            <rect
              x="54.8218"
              y="13.6567"
              width="58.2158"
              height="8"
              transform="rotate(135 54.8218 13.6567)"
              fill="#202122"
            />
          </svg>
        }
      />
    </Box>
  );
};

const ModalContent = ({ children }: PropsWithChildren<{}>) => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  let props: BoxProps;
  switch (size) {
    case "small":
      props = {
        margin: { left: "18px", right: "18px", top: "56px" },
        pad: { bottom: "68px" },
      };
      break;
    case "medium":
      props = {
        margin: { left: "60px", right: "28px", top: "48px" },
        width: { max: "600px" },
        pad: { bottom: "132px" },
      };
      break;
    case "large":
      props = {
        margin: { top: "48px", left: "192px", right: 192 - 32 + "px" },
        width: { max: "600px" },
        pad: { bottom: "132px" },
      };
      break;
    case "xlarge":
      props = {
        margin: { top: "48px", left: "240px", right: 240 - 32 + "px" },
        width: { max: "600px" },
        pad: { bottom: "132px" },
      };
      break;
  }
  return (
    <Box align="center">
      <Box gap={"40px"} {...props} flex={false}>
        {children}
      </Box>
    </Box>
  );
};
