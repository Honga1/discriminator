import { Box, ResponsiveContext, Text } from "grommet";
import React, { useContext } from "react";
import { CustomButton } from "./CustomButton";
import { HomeContainer } from "./Home";

export const Permission = () => {
  return (
    <HomeContainer>
      <PermissionContent />
    </HomeContainer>
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
        To get out the best out of this experience, we recommend to enable your
        webcam. We do not store any of your information (see our privacy
        policy). If you choose to not enable your webcam you will see xyz.
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
