const routes = [
  "/",
  "/home",
  "/permissions",
  "/chapter/1?type=chapter",
  "/chapter/2?type=cover",
  "/chapter/2?type=chapter",
  "/chapter/3?type=cover",
  "/chapter/3?type=chapter",
  "/chapter/4?type=cover",
  "/chapter/4?type=chapter",
] as const;

export const validateChapterNumber = (
  maybeValidStringChapterNumber?: string
) => {
  return [..."1234"].some(
    (chapterNumber) => chapterNumber === maybeValidStringChapterNumber
  );
};

export const parseChapterNumber = (
  maybeStringChapterNumber?: string
): 1 | 2 | 3 | 4 => {
  if (
    maybeStringChapterNumber === undefined ||
    !validateChapterNumber(maybeStringChapterNumber)
  ) {
    throw new Error("Invalid chapter number");
  } else {
    return parseInt(maybeStringChapterNumber, 10) as 1 | 2 | 3 | 4;
  }
};

export const validatePageTypeQuery = (
  query: URLSearchParams,
  chapterNumber: number
) => {
  const type = query.get("type");
  if (chapterNumber === 1 && type === "cover") return false;
  const isValidQuery = type === "cover" || type === "chapter";

  return isValidQuery;
};

export const parsePageTypeQuery = (
  query: URLSearchParams,
  chapterNumber: number
) => {
  if (!validatePageTypeQuery(query, chapterNumber)) {
    throw new Error("Invalid page type");
  } else {
    return query.get("type") as "cover" | "chapter";
  }
};

export type Routes = typeof routes[number];
