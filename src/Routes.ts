const routes = [
  "/",
  "/home",
  "/cover",
  "/permissions",
  "/coil",
  "/chapter/1",
  "/chapter/2",
  "/chapter/3",
  "/chapter/4",
  "/chapter/5",
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

export const validatePageTypeQuery = (query: URLSearchParams) => {
  const type = query.get("type");
  const isValidQuery = type === "cover" || type === "chapter";

  return isValidQuery;
};

export const parsePageTypeQuery = (query: URLSearchParams) => {
  if (!validatePageTypeQuery(query)) {
    throw new Error("Invalid page type");
  } else {
    return query.get("type") as "cover" | "chapter";
  }
};

export type Routes = typeof routes[number];
