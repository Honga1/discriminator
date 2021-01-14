import { Box } from "grommet";
import React, { useEffect, useState } from "react";
import { ChapterNumbers } from "../../Routes";
import { Chapter1 } from "./Chapter1";
import { Chapter2 } from "./Chapter2";
import { Chapter3 } from "./Chapter3";
import { Chapter4 } from "./Chapter4";
import { Chapter5 } from "./Chapter5";
import { ChapterButtons } from "./ChapterButtons";

const chapters = [
  <Chapter1 />,
  <Chapter2 />,
  <Chapter3 />,
  <Chapter4 />,
  <Chapter5 />,
];

export const Chapters = ({
  chapterNumber,
}: {
  chapterNumber: ChapterNumbers;
}) => {
  const dimensions = use169Dimensions();
  const chapterIndex = parseInt(chapterNumber) - 1;

  if (Number.isInteger(chapterIndex) && chapters[chapterIndex] !== undefined) {
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
          {chapters[chapterIndex]}
        </Box>
      </Box>
    );
  } else {
    throw new Error(`Could not get chapter`);
  }
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
