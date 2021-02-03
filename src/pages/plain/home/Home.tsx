import { Box, ResponsiveContext, Text } from "grommet";
import React, { useContext } from "react";
import { HomeLarge } from "./HomeLarge";
import { HomeMedium } from "./HomeMedium";
import { HomeSmall } from "./HomeSmall";
import { HomeXLarge } from "./HomeXLarge";

export const Home = () => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  switch (size) {
    case "small":
      return (
        <HomeSmall>
          <HomeContent />
        </HomeSmall>
      );
    case "medium":
      return (
        <HomeMedium>
          <HomeContent />
        </HomeMedium>
      );
    case "large":
      return (
        <HomeLarge>
          <HomeContent />
        </HomeLarge>
      );
    case "xlarge":
      return (
        <HomeXLarge>
          <HomeContent />
        </HomeXLarge>
      );
  }
};

const HomeContent = () => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  return (
    <Box gap={"40px"}>
      <Text size={size === "small" ? "small" : "medium"}>
        Egestas enim cursus pretium leo, egestas blandit egestas nunc magna.
        Lectus euismod mauris faucibus massa nibh condimentum vitae nunc quis.
        Lacus vitae amet aliquam id leo. Interdum vulputate eu et aliquet elit
        morbi bibendum. Tellus euismod metus, id feugiat amet.
      </Text>

      <StartButton />
    </Box>
  );
};

const StartButton = () => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  return (
    <Box className="start button" direction="row">
      <Box
        border={{ color: "blue", style: "solid", size: "3px" }}
        pad={{ horizontal: "27px", vertical: "7px" }}
      >
        <Text size={size === "small" ? "small" : "medium"} color="blue">
          Start
        </Text>
      </Box>
    </Box>
  );
};
