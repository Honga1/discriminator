import React from "react";
import { ChapterContainer } from "./ChapterContainer";
import { Chapter1 } from "./Chapter1";
import { Chapter2 } from "./Chapter2";
import { Chapter3 } from "./Chapter3";
import { Chapter4 } from "./Chapter4";
import { Chapter5 } from "./Chapter5";

const chapters = {
  1: <Chapter1 />,
  2: <Chapter2 />,
  3: <Chapter3 />,
  4: <Chapter4 />,
  5: <Chapter5 />,
};

export const Chapters = ({
  chapterNumber,
}: {
  chapterNumber: keyof typeof chapters;
}) => {
  return (
    <ChapterContainer chapterNumber={chapterNumber}>
      {chapters[chapterNumber]}
    </ChapterContainer>
  );
};
