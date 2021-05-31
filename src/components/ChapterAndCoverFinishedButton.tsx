import { useChapterNumber } from "src/hooks/useChapterNumber";
import { useIsActive } from "src/hooks/useIsActive";
import { useNextStep } from "../hooks/useNextStep";
import { usePageType } from "../hooks/usePageType";
import { useStore } from "../store/store";
import { FinishedButton } from "./FinishedButton";

export const ChapterAndCoverNextButton = () => {
  const pageType = usePageType();
  const nextStep = useNextStep();
  const isChapterComplete = useStore((state) => state.chapter?.progress === 1);
  const isActive = useIsActive();
  const shouldShow = pageType === "cover" || isChapterComplete;
  const chapterNumber = useChapterNumber();

  let text: string;
  if (chapterNumber === 4 && pageType === "chapter") {
    text = "Want to help?";
  } else if (pageType === "cover") {
    text = "Start chapter";
  } else {
    text = "Next chapter";
  }

  const width = pageType === "cover" ? "240px" : "240px";

  return (
    <FinishedButton
      shouldProgress={isChapterComplete && !isActive}
      shouldShow={shouldShow}
      text={text}
      textWidth={width}
      toProgress={nextStep}
      expanded={pageType === "cover" ? true : "auto"}
    />
  );
};
