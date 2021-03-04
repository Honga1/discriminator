import { useLocation } from "react-router-dom";
import { parseChapterNumber } from "../Routes";


export function useChapterNumber() {
  const location = useLocation();
  const maybeChapterNumber = location.pathname.split("/chapter/", 2)[1][0] as string |
    undefined;

  return parseChapterNumber(maybeChapterNumber);
}
