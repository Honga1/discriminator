import React, { createContext, memo, PropsWithChildren, useMemo } from "react";
import { images } from "../images/images";

export const yearsInShownOrder = [2011, 2010, 2007, 2013, 2006, 2012] as const;
export type Years = typeof yearsInShownOrder[number];
export type ImagesByYear = Record<Years, MegafaceImageDescriptor[]>;

export type Tinting = "wedding" | "family" | "party";

export const Part1Screen2Context = createContext<{
  yearsShown: Set<Years>;
  images: ImagesByYear;
  tinting: Set<Tinting>;
}>({
  yearsShown: new Set(),
  images: {
    "2006": [],
    "2007": [],
    "2010": [],
    "2011": [],
    "2012": [],
    "2013": [],
  },
  tinting: new Set(),
});

export const Part1Screen2Provider = memo(
  ({
    yearsShown = new Set(yearsInShownOrder),
    tinting = new Set(),
    children,
  }: PropsWithChildren<{
    yearsShown?: Set<Years>;
    tinting?: Set<Tinting>;
  }>) => {
    const images = useMemo(resolveImages, []);
    return (
      <Part1Screen2Context.Provider value={{ yearsShown, images, tinting }}>
        {children}
      </Part1Screen2Context.Provider>
    );
  }
);

export interface MegafaceImageDescriptor {
  url: string;
  image_url: string;
  path_alias: string;
  nsid: string;
  photo_id: number;
  license: string;
  date: string;
  year: Years;
  tagged: "family" | "party" | "wedding";
}

const resolveImages = () => {
  const result = Object.fromEntries(
    yearsInShownOrder.map((year) => {
      const imagesThisYear = images.user.datasets.megaface.images.filter(
        ({ date }) => date.includes(year.toFixed())
      );
      return [year, imagesThisYear];
    })
  ) as ImagesByYear;
  return result;
};
