import { Box, BoxProps, Grid, ResponsiveContext, Text } from "grommet";
import {
  PropsWithChildren,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useResize } from "../../../hooks/useResize";

export const Part1Screen2 = () => {
  const isSmall = useContext(ResponsiveContext) === "small";

  const NormalLayout = (
    <Grid
      fill="vertical"
      areas={[
        { name: "stackedBoxes2006", start: [0, 0], end: [0, 0] },
        { name: "stackedBoxes2007", start: [1, 0], end: [1, 0] },
        { name: "stackedBoxes2010", start: [2, 0], end: [3, 0] },
        { name: "stackedBoxes2011", start: [4, 0], end: [5, 0] },
        { name: "stackedBoxes2012", start: [6, 0], end: [6, 0] },
        { name: "stackedBoxes2013", start: [7, 0], end: [7, 0] },
        { name: "text2006", start: [0, 1], end: [0, 1] },
        { name: "text2007", start: [1, 1], end: [1, 1] },
        { name: "text2010", start: [2, 1], end: [3, 1] },
        { name: "text2011", start: [4, 1], end: [5, 1] },
        { name: "text2012", start: [6, 1], end: [6, 1] },
        { name: "text2013", start: [7, 1], end: [7, 1] },
      ]}
      columns={["flex", "flex", "flex", "flex", "flex", "flex", "flex", "flex"]}
      rows={["flex", "auto"]}
    >
      <Box gridArea="stackedBoxes2006" margin="16px" align="center">
        <StackedBoxes amount={3} />
      </Box>
      <Box gridArea="stackedBoxes2007" margin="16px" align="center">
        <StackedBoxes amount={6} />
      </Box>
      <Box gridArea="stackedBoxes2010" margin="16px" align="center">
        <StackedBoxes amount={15} />
      </Box>
      <Box gridArea="stackedBoxes2011" margin="16px" align="center">
        <StackedBoxes amount={16} />
      </Box>
      <Box gridArea="stackedBoxes2012" margin="16px" align="center">
        <StackedBoxes amount={1} />
      </Box>
      <Box gridArea="stackedBoxes2013" margin="16px" align="center">
        <StackedBoxes amount={5} />
      </Box>
      <Box gridArea="text2006" align="center">
        <Text color="white">2006</Text>
      </Box>
      <Box gridArea="text2007" align="center">
        <Text color="white">2007</Text>
      </Box>
      <Box gridArea="text2010" align="center">
        <Text color="white">2010</Text>
      </Box>
      <Box gridArea="text2011" align="center">
        <Text color="white">2011</Text>
      </Box>
      <Box gridArea="text2012" align="center">
        <Text color="white">2012</Text>
      </Box>
      <Box gridArea="text2013" align="center">
        <Text color="white">2013</Text>
      </Box>
    </Grid>
  );

  return (
    <Box flex={false} height="100%" width="100%" justify="center" pad="48px">
      {isSmall ? NormalLayout : NormalLayout}
    </Box>
  );
};

const StackedBoxes = ({ amount }: { amount: number }) => {
  const [[width, height], setDimensions] = useState([0, 0]);
  const cellsPerColumn = 8;
  const rowGap = 8;
  const columnGap = 8;
  const columnCount = Math.ceil(amount / cellsPerColumn);

  const dimensions = useResize();

  const boxesLeft = [...new Array(Math.min(amount, cellsPerColumn))].map(
    (_, index) => {
      return (
        <Box
          flex={false}
          width={width + "px"}
          height={height + "px"}
          key={index}
          border={{ size: "2px", color: "#FF4E4E" }}
          background="rgba(255, 89, 89, 0.2)"
        ></Box>
      );
    }
  );
  const boxesRight = [
    ...new Array(Math.max(amount - Math.min(amount, cellsPerColumn), 0)),
  ].map((_, index) => {
    return (
      <Box
        flex={false}
        width={width + "px"}
        height={height + "px"}
        key={index}
        border={{ size: "2px", color: "#FF4E4E" }}
        background="rgba(255, 89, 89, 0.2)"
      ></Box>
    );
  });
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ref.current) return;
    const containerDimensions = ref.current.getBoundingClientRect();
    const maxHeight = containerDimensions.height / cellsPerColumn;
    const desiredAspect = 16 / 9;

    // First try fit by scaling width
    const columnWidth = maxHeight * desiredAspect;
    const maxWidth = containerDimensions.width / columnCount;

    const isColumnTooWide = maxWidth <= columnWidth;

    if (isColumnTooWide) {
      const reducedHeight = maxWidth / desiredAspect;

      const reducedWithGap = shrinkAndMaintainAspectRatio(
        maxWidth,
        reducedHeight,
        columnGap,
        rowGap
      );
      setDimensions(reducedWithGap);
    } else {
      const reducedWithGap = shrinkAndMaintainAspectRatio(
        columnWidth,
        maxHeight,
        columnGap,
        rowGap
      );

      setDimensions(reducedWithGap);
    }
  }, [columnCount, dimensions]);

  return (
    <Box
      width="100%"
      height="100%"
      pad={{ horizontal: (columnCount - 1) * 16 + "px" }}
    >
      <Box ref={ref} flex={false} width="100%" height="100%" justify="end">
        <Box
          width="100%"
          flex={false}
          direction="row"
          gap={columnGap + "px"}
          align="start"
          justify="center"
        >
          <Box flex={false} gap={rowGap + "px"} justify="end">
            {boxesLeft}
          </Box>
          {columnCount !== 1 && (
            <Box
              flex={false}
              gap={rowGap + "px"}
              justify="start"
              direction="column-reverse"
            >
              {boxesRight}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

const shrinkAndMaintainAspectRatio = (
  width: number,
  height: number,
  shrinkWidth: number,
  shrinkHeight: number
): [width: number, height: number] => {
  const reducedWidth = width - shrinkWidth;
  const reducedHeight = height - shrinkHeight;

  const originalAspectRatio = width / height;

  const newAspect = reducedWidth / reducedHeight;
  if (newAspect > originalAspectRatio) {
    return [reducedHeight * originalAspectRatio, reducedHeight];
  } else {
    return [reducedWidth, reducedWidth / originalAspectRatio];
  }
};
