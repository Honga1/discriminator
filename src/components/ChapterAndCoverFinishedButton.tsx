import { useChapterNumber } from "src/hooks/useChapterNumber";
import { useIsActive } from "src/hooks/useIsActive";
import { useNextStep } from "../hooks/useNextStep";
import { usePageType } from "../hooks/usePageType";
import { useStore } from "../store/store";
import { FinishedButton } from "./FinishedButton";

export const ChapterAndCoverNextButton = () => {
  const pageType = usePageType();
  const nextStep = useNextStep();
  const isChapterComplete = useStore(
    (state) => (state.chapter?.progress ?? 0) >= 1
  );

  const isActive = useIsActive();
  const shouldShow = pageType === "cover" || isChapterComplete;
  const chapterNumber = useChapterNumber();

  const hasPhoto = useStore((state) => state.photo !== undefined);
  let text: string;

  if (chapterNumber === 1 && pageType === "cover") {
    if (hasPhoto) {
      text = "Enjoy the film";
    } else {
      text = "No photo taken";
    }
  } else if (chapterNumber === 4 && pageType === "chapter") {
    text = "Want to help?";
  } else if (pageType === "cover") {
    text = "Start chapter";
  } else {
    text = "Next chapter";
  }

  const width = pageType === "cover" ? "255px" : "240px";

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
