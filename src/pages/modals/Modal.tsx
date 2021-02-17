import { Box, BoxProps, Heading, Layer, ResponsiveContext } from "grommet";
import {
  CSSProperties,
  PropsWithChildren,
  useCallback,
  useContext,
  useState,
} from "react";
import { useHistory } from "react-router-dom";
import styled from "styled-components";
import { colorTheme } from "../../theme";
import { InteractiveStack } from "../../components/InteractiveStack";
import { QueryButton } from "../../components/RoutedAnchor";
import { useQuery } from "../../hooks/useQuery";
import { About } from "./About";
import { Privacy } from "./Privacy";

export const Modal = ({
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
        <Box fill background="yellowAlternative"></Box>
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
      props = {
        margin: { horizontal: "32px", top: "32px", bottom: "-4px" },
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
      };
      break;
    case "xlarge":
      props = {
        margin: { horizontal: "48px", top: "48px", bottom: "-4px" },
      };
      break;
  }

  const Frame =
    size === "small" || size === "medium"
      ? ScrollableFrame
      : ScrollableFrameLarge;
  return (
    <Box fill overflow="hidden">
      <Box className="modal container" {...props} background="yellow">
        <Frame textColor={textColor} frameColor={frameColor} heading={heading}>
          {children}
        </Frame>
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
    outlineOffset: `-4px`,
    outline: `4px ${frameColor} solid`,
  };

  const [showBorder, setShowBorder] = useState(false);
  const isSmall = useContext(ResponsiveContext) === "small";

  const ScrollableBox = isSmall ? Box : CustomScrollbarBox;

  return (
    <Box className="scrollable-frame" style={style} flex={false} fill>
      <ScrollingHeadingBlock frameColor={frameColor} showBorder={showBorder}>
        <Heading
          level={1}
          color={textColor}
          margin="0"
          size={isSmall ? "small" : "medium"}
        >
          {heading}
        </Heading>
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

const ScrollableFrameLarge = ({
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
    outlineOffset: `-4px`,
    outline: `4px ${frameColor} solid`,
  };
  const isSmall = useContext(ResponsiveContext) === "small";

  const ScrollableBox = isSmall ? Box : CustomScrollbarBox;

  return (
    <Box className="scrollable-frame" style={style} flex={false} fill>
      <InteractiveStack fill>
        <Box fill>
          <ScrollableBox
            flex={false}
            overflow={{ horizontal: "hidden", vertical: "auto" }}
            height="100%"
            pad={{ top: "76px" }}
            margin={{ right: "12px", top: "12px" }}
          >
            {children}
          </ScrollableBox>
        </Box>
        <Box margin={{ right: "32px" }}>
          <ScrollingHeadingBlock frameColor={frameColor} showBorder={false}>
            <Heading
              level={1}
              color={textColor}
              margin="0"
              size={isSmall ? "small" : "medium"}
            >
              {heading}
            </Heading>
          </ScrollingHeadingBlock>
        </Box>
      </InteractiveStack>
    </Box>
  );
};

const CustomScrollbarBox = styled(Box)`
  &::-webkit-scrollbar {
    width: 20px;
  }

  &::-webkit-scrollbar-track {
  }

  &::-webkit-scrollbar-thumb {
    background-color: ${colorTheme.yellowAlternative};
    outline-offset: -2px;
    outline: 2px solid ${colorTheme.black};
  }
`;

const ScrollingHeadingBlock = ({
  frameColor,
  children,
  showBorder,
}: PropsWithChildren<{
  frameColor: string;
  showBorder: boolean;
}>) => {
  const size = useContext(ResponsiveContext);

  let bottomBorderStyle = {};
  if (size === "small" || size === "medium") {
    bottomBorderStyle = showBorder
      ? { borderBottom: `4px solid ${colorTheme.yellowAlternative}` }
      : { borderBottom: `4px solid ${colorTheme.yellow}` };
  }
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
        pad={{ horizontal: "20px", vertical: "12px" }}
      >
        {children}
      </Box>
      <Box pad={{ horizontal: "20px", vertical: "12px" }}>
        <QueryButton
          query={{ key: "modal", value: "credits", operation: "close" }}
          href="/credits"
          plain
          fill
          label={
            <Heading level={1} margin="0" size={isSmall ? "small" : "medium"}>
              X
            </Heading>
          }
        />
      </Box>
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
        width: { max: "768px" },
        pad: { bottom: "132px" },
      };
      break;
    case "large":
      props = {
        margin: { left: "168px", right: "136px", top: "48px" },
        width: { max: "768px" },
        pad: { bottom: "132px" },
      };
      break;
    case "xlarge":
      props = {
        margin: { left: "288px", right: "256px", top: "48px" },
        width: { max: "768px" },
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
          <Privacy />
        </Modal>
      );
    default:
      return null;
  }
};
