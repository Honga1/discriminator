import fromEntries from "fromentries";
import { NonFunctionProperties } from "src/@types/NonFunctionProperties";
import createStoreHook from "zustand";
import create from "zustand/vanilla";
import { imageData, ImageMetaData } from "../../images/imageData";
import { getImagesForId } from "../../images/images";

export const yearsInShownOrder = [2011, 2010, 2007, 2013, 2006, 2012] as const;
export type Years = typeof yearsInShownOrder[number];
type ImagesByYear = Record<Years, MegafaceImageDescriptor[]>;

type State = {
  yearsShown: Set<Years>;
  images: ImagesByYear;
  autoPickableImageCards: Map<string, { current: HTMLElement | null }>;
  revealedImage: undefined | "SHOW_ALL" | HTMLElement;
  focusedElement: HTMLElement | undefined;
  focusedData: MegafaceImageDescriptor | undefined;
  userControl: boolean;
  setYearsShown: (yearsShown: Set<Years>) => void;
};

const resolveImages = () => {
  const result = fromEntries(
    yearsInShownOrder.map((year) => {
      const imagesThisYear = imageData
        .filter(({ date }) => date.includes(year.toFixed()))
        .map((data) => {
          const { overlay, image } = getImagesForId(data.photo_id);
          const result: MegafaceImageDescriptor = {
            ...data,
            overlaySrc: overlay,
            imageSrc: image,
          };
          return result;
        });
      return [year, imagesThisYear];
    })
  ) as ImagesByYear;
  return result;
};

const initialState: NonFunctionProperties<State> = {
  yearsShown: new Set(),
  images: resolveImages(),
  revealedImage: undefined,
  focusedElement: undefined,
  autoPickableImageCards: new Map(),
  userControl: false,
  focusedData: undefined,
};

export const part1Screen2Store = create<State>((set, get) => ({
  ...initialState,
  setYearsShown: (yearsShown) => {
    const { yearsShown: current } = get();
    if (!isSetEqual(yearsShown, current)) {
      set({ yearsShown });
      return;
    }
  },
}));

export const usePart1Screen2Store = createStoreHook(part1Screen2Store);

export interface MegafaceImageDescriptor extends ImageMetaData {
  overlaySrc: string | undefined;
  imageSrc: string;
  year: Years;
}

function isSetEqual<T extends unknown>(a: Set<T>, bs: Set<T>) {
  if (a.size !== bs.size) return false;
  for (const aElement of a) if (!bs.has(aElement)) return false;
  return true;
}
