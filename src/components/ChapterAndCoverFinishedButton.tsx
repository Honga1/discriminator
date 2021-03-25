import { useIsActive } from "../hooks/useIsActive";
import { useNextStep } from "../hooks/useNextStep";
import { usePageType } from "../hooks/usePageType";
import { useStore } from "../store/store";
import { FinishedButton } from "./FinishedButton";

export const ChapterAndCoverNextButton = () => {
  const pageType = usePageType();
  const nextStep = useNextStep();
  const isActive = useIsActive();
  const isChapterComplete = useStore((state) => state.chapter?.progress === 1);
  const shouldShow = pageType === "cover" || isChapterComplete;

  const text = pageType === "cover" ? "Go to chapter" : "Go to next chapter";
  const width = pageType === "cover" ? "235px" : "286px";

  return (
    <FinishedButton
      shouldProgress={!isActive && shouldShow}
      shouldShow={shouldShow}
      text={text}
      textWidth={width}
      toProgress={nextStep}
    />
  );
};
