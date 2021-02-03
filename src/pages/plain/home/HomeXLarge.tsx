import { Box, Text } from "grommet";
import React from "react";
import { colorTheme } from "../../../components/colorTheme";
import { FrameMedium } from "./HomeMedium";
import { LinksFloating } from "./Links";

export const HomeXLarge = () => {
  return (
    <Box
      className="home xlarge"
      margin={{ left: "112px", top: "112px", bottom: "20px" }}
      width={{ max: "896px" }}
    >
      <FrameMedium
        textColor={colorTheme.yellow}
        frameColor={colorTheme.black}
        heading="Discriminator"
      >
        <Box
          className="content"
          margin={{ horizontal: "64px", top: "48px", bottom: "64px" }}
          gap={"40px"}
        >
          <Text size="medium">
            Egestas enim cursus pretium leo, egestas blandit egestas nunc magna.
            Lectus euismod mauris faucibus massa nibh condimentum vitae nunc
            quis. Lacus vitae amet aliquam id leo. Interdum vulputate eu et
            aliquet elit morbi bibendum. Tellus euismod metus, id feugiat amet.
          </Text>

          <Box className="start-link" direction="row">
            <Box
              border={{ color: "blue", style: "solid", size: "3px" }}
              pad={{ horizontal: "27px", vertical: "7px" }}
            >
              <Text size="medium" color="blue">
                Start
              </Text>
            </Box>
          </Box>
        </Box>
      </FrameMedium>
      <LinksFloating position="bottom-right" />
    </Box>
  );
};
