import { useHistory } from "react-router-dom";
import { store } from "../store/store";
import { useChapterNumber } from "./useChapterNumber";
import { usePageType } from "./usePageType";

export function useNextStep() {
  const history = useHistory();
  const chapterNumber = useChapterNumber();
  const pageType = usePageType();

  const nextPageType = pageType === "cover" ? "chapter" : "cover";
  const nextChapterNumber =
    pageType === "cover" ? chapterNumber : chapterNumber + 1;

  const nextStep = () => {
    if (nextPageType === "chapter") {
      store.getState().chapter?.play();
    } else {
      store.getState().chapter?.rewind();
    }

    history.push(`/chapter/${nextChapterNumber}?type=${nextPageType}`);
  };
  return nextStep;
}
