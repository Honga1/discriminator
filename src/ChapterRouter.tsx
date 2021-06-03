import React, { useEffect } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Chapter } from "./chapters/Chapters";
import { Media } from "./components/MediaContainer";
import {
  parseChapterNumber,
  parsePageTypeQuery,
  validateChapterNumber,
  validatePageTypeQuery,
} from "./Routes";

const ChapterRouter = ({ match, history, location }: RouteComponentProps) => {
  const maybeChapterNumber = (match.params as any)["chapterNumber"] as
    | string
    | undefined;

  useEffect(() => {
    const isValidChapterNumber = validateChapterNumber(maybeChapterNumber);
    if (!isValidChapterNumber) {
      history.replace(`/chapter/1?type=chapter`);
      return;
    }

    const chapterNumber = parseChapterNumber(maybeChapterNumber);
    const query = new URLSearchParams(location.search);
    const isValidQuery = validatePageTypeQuery(query);

    if (!isValidQuery) {
      history.replace(
        `${match.url}?type=${chapterNumber === 1 ? "chapter" : "cover"}`
      );
      return;
    }
  }, [history, location.search, match.url, maybeChapterNumber]);

  const isValidChapterNumber = validateChapterNumber(maybeChapterNumber);
  if (!isValidChapterNumber) return null;
  const chapterNumber = parseChapterNumber(maybeChapterNumber);
  const query = new URLSearchParams(location.search);
  const isValidQuery = validatePageTypeQuery(query);

  if (!isValidQuery) return null;

  const type = parsePageTypeQuery(query);
  return (
    <Media>
      <Chapter isCover={type !== "chapter"} chapterNumber={chapterNumber} />
    </Media>
  );
};

export default ChapterRouter;
