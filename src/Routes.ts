export const routes = [
  "/",
  "/home",
  "/cover",
  "/chapter",
  "/permissions",
  "/coil",
  "/error",
  "/chapter/1?isCover",
  "/chapter/1?isChapter",
  "/chapter/2?isCover",
  "/chapter/2?isChapter",
  "/chapter/3?isCover",
  "/chapter/3?isChapter",
  "/chapter/4?isCover",
  "/chapter/4?isChapter",
  "/chapter/5?isCover",
  "/chapter/5?isChapter",
  "/end",
] as const;

export type Routes = typeof routes[number];
export type PlainPageRoutes = Exclude<Routes, `/chapter/${string}`>;
export type ChapterRoutes = Routes & `/chapter/${string}`;

export const plainPageRoutes: readonly PlainPageRoutes[] = [
  "/",
  "/coil",
  "/end",
  "/error",
] as const;

export const chapterRoutes: readonly ChapterRoutes[] = [
  "/chapter/1?isCover",
  "/chapter/1?isChapter",
  "/chapter/2?isCover",
  "/chapter/2?isChapter",
  "/chapter/3?isCover",
  "/chapter/3?isChapter",
  "/chapter/4?isCover",
  "/chapter/4?isChapter",
  "/chapter/5?isCover",
  "/chapter/5?isChapter",
] as const;

export type ChapterNumbers = ChapterRoutes &
  `/chapter/${number}?isCover` extends `/chapter/${infer ChapterNumber}?isCover`
  ? ChapterNumber
  : never;

export const chapterNumbers: ChapterNumbers[] = ["1", "2", "3", "4", "5"];

export const chapterFlow: Record<
  ChapterRoutes,
  { next: Routes; previous: Routes }
> = {
  "/chapter/1?isCover": {
    next: "/chapter/1?isChapter",
    previous: "/",
  },
  "/chapter/1?isChapter": {
    next: "/chapter/2?isCover",
    previous: "/chapter/1?isCover",
  },
  "/chapter/2?isCover": {
    next: "/chapter/2?isChapter",
    previous: "/chapter/1?isCover",
  },
  "/chapter/2?isChapter": {
    next: "/chapter/3?isCover",
    previous: "/chapter/2?isCover",
  },
  "/chapter/3?isCover": {
    next: "/chapter/3?isChapter",
    previous: "/chapter/2?isCover",
  },
  "/chapter/3?isChapter": {
    next: "/chapter/4?isCover",
    previous: "/chapter/3?isCover",
  },
  "/chapter/4?isCover": {
    next: "/chapter/4?isChapter",
    previous: "/chapter/3?isCover",
  },
  "/chapter/4?isChapter": {
    next: "/chapter/5?isCover",
    previous: "/chapter/4?isCover",
  },
  "/chapter/5?isCover": {
    next: "/chapter/5?isChapter",
    previous: "/chapter/4?isCover",
  },
  "/chapter/5?isChapter": {
    next: "/end",
    previous: "/chapter/5?isCover",
  },
} as const;

export const chapterRouteNames: { [key in ChapterRoutes]: string } = {
  "/chapter/1?isChapter": " Chapter 1",
  "/chapter/2?isChapter": " Chapter 2",
  "/chapter/3?isChapter": " Chapter 3",
  "/chapter/4?isChapter": " Chapter 4",
  "/chapter/5?isChapter": " Chapter 5",
  "/chapter/1?isCover": " Cover 1",
  "/chapter/2?isCover": " Cover 2",
  "/chapter/3?isCover": " Cover 3",
  "/chapter/4?isCover": " Cover 4",
  "/chapter/5?isCover": " Cover 5",
} as const;

export const plainPageRouteNames: { [key in PlainPageRoutes]: string } = {
  "/": "Home",
  "/cover": "Template Cover",
  "/chapter": "Template Chapter",
  "/home": "Home",
  "/permissions": "Permissions",
  "/coil": "Coil",
  "/end": "End",
  "/error": "Error",
} as const;
