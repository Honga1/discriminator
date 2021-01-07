import { Box } from "grommet";
import { PropsWithChildren, useEffect, useState } from "react";
import { ChapterButtons } from "./ChapterButtons";

export const ChapterContainer = ({
  children,
  chapterNumber,
}: PropsWithChildren<{ chapterNumber: number }>) => {
  const dimensions = use169Dimensions();

  return (
    <Box fill background="black" justify="center">
      <ChapterButtons chapterNumber={chapterNumber} />
      <Box
        alignContent="center"
        height={dimensions.height + "px"}
        width={dimensions.width + "px"}
        background="grey"
        justify="center"
        alignSelf="center"
        align="center"
      >
        {children}
      </Box>
    </Box>
  );
};

const useWindowDimensions = () => {
  const [dimensions, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  useEffect(() => {
    const onResize = () => {
      setSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  });

  return dimensions;
};

const use169Dimensions = () => {
  const dimensions = useWindowDimensions();
  const pageWidth = dimensions.width;
  const pageHeight = dimensions.height;

  const heightAt16by9 = (pageWidth / 16) * 9;
  const widthAt16by9 = (pageHeight / 9) * 16;

  let width;
  let height;
  // Use height to check if at this height, the page would be too wide
  if (widthAt16by9 > pageWidth) {
    width = pageWidth;
    height = heightAt16by9;
  } else {
    width = widthAt16by9;
    height = pageHeight;
  }

  return { width, height };
};
