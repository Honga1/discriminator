import { Box, Button, ResponsiveContext, Text } from "grommet";
import { memo, useContext } from "react";
import { Years } from "../Part2Screen3";
import { ChevronLeft } from "./ChevronLeft";
import { ChevronRight } from "./ChevronRight";
import { MapIcon } from "./MapIcon";

export const HeaderBar = memo(
  ({
    year,
    downloads,
    onNavigationClicked,
    onMapClicked,
  }: {
    year: Years;
    downloads: number;
    onNavigationClicked: (destinationYear: Years) => void;
    onMapClicked: () => void;
  }) => {
    const isSmall = useContext(ResponsiveContext) === "small";

    return (
      <Box
        flex={false}
        width="100%"
        height="48px"
        justify="between"
        direction="row"
        background="black"
        align="center"
        overflow="hidden"
        border={{ side: "bottom", size: "4px", color: "offWhiteOpaque" }}
        pad={{ left: "8px", right: "59px" }}
        style={{ position: "relative" }}
      >
        <HeaderText
          year={year}
          onNavigationClicked={onNavigationClicked}
          onMapClicked={onMapClicked}
        ></HeaderText>
        {!isSmall && (
          <Box direction="row" justify="end">
            <Text size="24px" style={{ lineHeight: "24px" }} color="offWhite">
              {downloads} Downloads
            </Text>
          </Box>
        )}
      </Box>
    );
  }
);

HeaderBar.displayName = "HeaderBar";

const HeaderText = memo(
  ({
    year,
    onMapClicked,
    onNavigationClicked,
  }: {
    year: Years;
    onMapClicked: () => void;
    onNavigationClicked: (destinationYear: Years) => void;
  }) => {
    const isSmall = useContext(ResponsiveContext) === "small";

    return (
      <Box flex={false} direction="row" gap="16px" align="center">
        {!isSmall && (
          <Text
            size="24px"
            style={{
              lineHeight: "24px",
            }}
            color="yellow"
          >
            Discriminator
          </Text>
        )}

        <Text
          size="24px"
          style={{
            lineHeight: "24px",
          }}
          color="redLight"
          weight="bold"
        >
          <Button
            style={{
              pointerEvents: "all",
              paddingRight: "10px",
              paddingLeft: isSmall ? "10px" : "0px",
            }}
            onClick={() => {
              const destinationYear = Math.max(2015, year - 1) as Years;
              onNavigationClicked(destinationYear);
            }}
            plain
            label={<ChevronLeft />}
          />
          {year}
          <Button
            style={{
              pointerEvents: "all",
              paddingLeft: "10px",
              paddingRight: isSmall ? "10px" : "0px",
            }}
            onClick={() => {
              const destinationYear = Math.min(2019, year + 1) as Years;
              onNavigationClicked(destinationYear);
            }}
            plain
            label={<ChevronRight />}
          />
        </Text>
        {isSmall && <Button onClick={onMapClicked} label={<MapIcon />} plain />}
      </Box>
    );
  }
);

HeaderText.displayName = "HeaderText";
