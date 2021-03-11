import { Box, BoxProps, Grid, ResponsiveContext } from "grommet";
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
        { name: "a2006", start: [0, 0], end: [0, 0] },
        { name: "a2007", start: [1, 0], end: [1, 0] },
        { name: "a2010", start: [2, 0], end: [3, 0] },
        { name: "a2011", start: [4, 0], end: [5, 0] },
        { name: "a2012", start: [6, 0], end: [6, 0] },
        { name: "a2013", start: [7, 0], end: [7, 0] },
      ]}
      columns={["flex", "flex", "flex", "flex", "flex", "flex", "flex", "flex"]}
      rows={["fit"]}
    >
      <Box gridArea="a2006" margin="16px" justify="end">
        <StackedBoxes amount={3} />
      </Box>
      <Box gridArea="a2007" margin="16px" justify="end">
        <StackedBoxes amount={6} />
      </Box>
      <Box gridArea="a2010" margin="16px" justify="end">
        <StackedBoxes amount={15} />
      </Box>
      <Box gridArea="a2011" margin="16px" justify="end">
        <StackedBoxes amount={16} />
      </Box>
      <Box gridArea="a2012" margin="16px" justify="end">
        <StackedBoxes amount={1} />
      </Box>
      <Box gridArea="a2013" margin="16px" justify="end">
        <StackedBoxes amount={5} />
      </Box>
    </Grid>
  );

  return (
    <Box flex={false} height="100%" width="100%" justify="center" pad="48px">
      {isSmall ? NormalLayout : NormalLayout}
    </Box>
  );
};

const AspectRatioBox = ({
  children,
  ...props
}: PropsWithChildren<BoxProps>) => {
  return (
    <Box
      className="aspect ratio box"
      style={{ height: "20%" }}
      {...props}
    ></Box>
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
        >
          <Box flex={false} gap={rowGap + "px"} justify="end">
            {boxesLeft}
          </Box>
          <Box
            flex={false}
            gap={rowGap + "px"}
            justify="start"
            direction="column-reverse"
          >
            {boxesRight}
          </Box>
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
