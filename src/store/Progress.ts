export const numberToProgress = {
  0: "COVER_1",
  1: "CHAPTER_1",
  2: "COVER_2",
  3: "CHAPTER_2",
  4: "COVER_3",
  5: "CHAPTER_3",
  6: "COVER_4",
  7: "CHAPTER_4",
  8: "COVER_5",
  9: "CHAPTER_5",
  10: "END",
} as const;

export type ProgressNames = typeof numberToProgress[ProgressNumber];
export type ProgressNumber = keyof typeof numberToProgress;

export const progressToNumber: Record<ProgressNames, ProgressNumber> = {
  COVER_1: 0,
  CHAPTER_1: 1,
  COVER_2: 2,
  CHAPTER_2: 3,
  COVER_3: 4,
  CHAPTER_3: 5,
  COVER_4: 6,
  CHAPTER_4: 7,
  COVER_5: 8,
  CHAPTER_5: 9,
  END: 10,
} as const;

export type ChapterNumbers = 1 | 2 | 3 | 4 | 5;
export type CoverNumbers = 1 | 2 | 3 | 4 | 5;

export const chapterNumberToProgress: Record<ChapterNumbers, ProgressNames> = {
  1: "CHAPTER_1",
  2: "CHAPTER_2",
  3: "CHAPTER_3",
  4: "CHAPTER_4",
  5: "CHAPTER_5",
} as const;

export const coverNumberToProgress: Record<CoverNumbers, ProgressNames> = {
  1: "COVER_1",
  2: "COVER_2",
  3: "COVER_3",
  4: "COVER_4",
  5: "COVER_5",
} as const;

export const progressNameToHumanName: Record<ProgressNames, string> = {
  CHAPTER_1: "Chapter 1",
  CHAPTER_2: "Chapter 2",
  CHAPTER_3: "Chapter 3",
  CHAPTER_4: "Chapter 4",
  CHAPTER_5: "Chapter 5",

  COVER_1: "Cover 1",
  COVER_2: "Cover 2",
  COVER_3: "Cover 3",
  COVER_4: "Cover 4",
  COVER_5: "Cover 5",

  END: "End",
};
export const progressNumberToRoute: Record<ProgressNumber, string> = {
  0: "/cover1",
  1: "/chapter1",
  2: "/cover2",
  3: "/chapter2",
  4: "/cover3",
  5: "/chapter3",
  6: "/cover4",
  7: "/chapter4",
  8: "/cover5",
  9: "/chapter5",
  10: "/end",
};
