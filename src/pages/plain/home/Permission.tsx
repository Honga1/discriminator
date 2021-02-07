import { Box, BoxProps, ResponsiveContext, Text } from "grommet";
import React, { PropsWithChildren, useContext, useState } from "react";
import { colorTheme } from "../../../components/colorTheme";
import { CameraIndicator } from "./CameraIndicator";
import { CustomButton } from "./CustomButton";
import { Frame } from "./Frames";
import { Links } from "./Links";

export const Permission = () => {
  const [showBorder, setShowBorder] = useState(false);
  return (
    <Box fill>
      <CameraIndicator showBorder={showBorder} />
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

export const PermissionContainer = ({ children }: PropsWithChildren<{}>) => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  let props: BoxProps;
  switch (size) {
    case "small":
      props = {
        margin: { horizontal: "32px", top: "16px", bottom: "32px" },
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
  const marginTop = isSmall ? "56px" : "48px";
  const marginHorizontal = isSmall ? "32px" : "64px";

  return (
    <Box
      gap={"40px"}
      margin={{ horizontal: marginHorizontal, top: marginTop, bottom: "64px" }}
    >
      <Text size={size === "small" ? "small" : "medium"}>
        Egestas enim cursus pretium leo, egestas blandit egestas nunc magna.
        Lectus euismod mauris faucibus massa nibh condimentum vitae nunc quis.
        Lacus vitae amet aliquam id leo. Interdum vulputate eu et aliquet elit
        morbi bibendum. Tellus euismod metus, id feugiat amet.
      </Text>

      <CustomButton
        color={"red"}
        textContent={
          <span>
            Continue{" "}
            <span style={{ textDecoration: "underline" }}>without</span> webcam
          </span>
        }
        href="/chapter/1?isCover"
      />
      <CustomButton
        color={"green"}
        textContent={
          <span>
            Continue <span style={{ textDecoration: "underline" }}>with</span>{" "}
            webcam
          </span>
        }
        href="/chapter/1?isCover"
      />
    </Box>
  );
};
