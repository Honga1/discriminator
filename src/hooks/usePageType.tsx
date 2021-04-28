import { parsePageTypeQuery } from "../Routes";
import { useChapterNumber } from "./useChapterNumber";
import { useQuery } from "./useQuery";

export function usePageType() {
  const query = useQuery();
  const chapterNumber = useChapterNumber();
  return parsePageTypeQuery(query, chapterNumber);
}
