import { useMemo } from "react";
import { images } from "./images/images";

const years = [2006, 2007, 2010, 2011, 2012, 2013] as const;
export function useImages() {
  return useMemo(() => {
    const result = Object.fromEntries(
      years.map((year) => {
        const imagesThisYear = images.user.datasets.megaface.images.filter(
          ({ date }) => date.includes(year.toFixed())
        );
        return [year, imagesThisYear];
      })
    ) as Record<
      typeof years[number],
      {
        image_url: string;
        path_alias: string;
        nsid: string;
        photo_id: number;
        license: string;
        date: string;
        tagged: "family" | "party" | "wedding";
      }[]
    >;
    return result;
  }, []);
}
