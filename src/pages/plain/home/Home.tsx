import { ResponsiveContext } from "grommet";
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
      return <HomeSmall />;
    case "medium":
      return <HomeMedium />;
    case "large":
      return <HomeLarge />;
    case "xlarge":
      return <HomeXLarge />;
  }
};
