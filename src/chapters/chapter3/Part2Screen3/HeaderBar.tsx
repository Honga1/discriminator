import { Box, Button, ResponsiveContext, Text } from "grommet";
import { memo, useContext } from "react";
import styled from "styled-components";
import { ChevronLeft } from "./ChevronLeft";
import { ChevronRight } from "./ChevronRight";
import { MapIcon } from "./MapIcon";
import { Years } from "./Part2Screen3";

export const HeaderBar = memo(
  ({
    isShown,
    year,
    downloads,
    onNavigationClicked,
    onMapClicked,
  }: {
    isShown: boolean;
    year: Years;
    downloads: number;
    onNavigationClicked: (destinationYear: Years) => void;
    onMapClicked: () => void;
  }) => {
    const isSmall = useContext(ResponsiveContext) === "small";

    return (
      <SlideInBox
        flex={false}
        width="100%"
        height="48px"
        justify="between"
        isShown={isShown}
        direction="row"
        background="black"
        align="center"
        border={{ side: "bottom", size: "4px", color: "offWhiteOpaque" }}
        pad={{ left: "8px", right: "59px" }}
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
      </SlideInBox>
    );
  }
);

HeaderBar.displayName = "HeaderBar";

const SlideInBox = styled(Box)<{ isShown: boolean }>`
  overflow: hidden;
  height: ${(props) => (props.isShown ? "48px" : "0px")};
  border-width: ${(props) => (props.isShown ? "4px" : "0px")};
  transition: height 0.2s, border-width 0.2s;
`;

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
