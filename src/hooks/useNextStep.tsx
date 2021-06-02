import { useHistory } from "react-router-dom";
import { store } from "../store/store";
import { useChapterNumber } from "./useChapterNumber";
import { usePageType } from "./usePageType";
import { useQuery } from "./useQuery";

export function useNextStep() {
  const history = useHistory();
  const chapterNumber = useChapterNumber();
  const pageType = usePageType();

  const nextPageType = pageType === "cover" ? "chapter" : "cover";
  const nextChapterNumber =
    pageType === "cover" ? chapterNumber : chapterNumber + 1;

  const query = useQuery();

  const nextStep = () => {
    if (nextPageType === "chapter") {
      store.getState().chapter?.play();
    } else {
      store.getState().chapter?.pause();
      store.getState().chapter?.rewind();
    }

    if (nextChapterNumber === 5) {
      query.set("modal", "support");
      history.push({
        ...history.location,
        search: query.toString(),
      });
    } else {
      history.push(`/chapter/${nextChapterNumber}?type=${nextPageType}`);
    }
  };
  return nextStep;
}
