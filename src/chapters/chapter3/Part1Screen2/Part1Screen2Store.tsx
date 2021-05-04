import { NonFunctionProperties } from "src/store/CallbackFunctionVariadic";
import createStoreHook from "zustand";
import create from "zustand/vanilla";
import { images } from "../images/images";

export const yearsInShownOrder = [2011, 2010, 2007, 2013, 2006, 2012] as const;
export type Years = typeof yearsInShownOrder[number];
export type ImagesByYear = Record<Years, MegafaceImageDescriptor[]>;

export type Tinting = "wedding" | "family" | "party";

type State = {
  yearsShown: Set<Years>;
  images: ImagesByYear;
  autoPickableImageCards: Map<string, { current: HTMLElement | null }>;
  tinting: Set<Tinting>;
  revealedImage: undefined | "SHOW_ALL" | HTMLElement;
  focusedElement: HTMLElement | undefined;
  showData: boolean;
  userControl: boolean;
  reset: () => void;
  setRevealedImage: (image: HTMLElement | "SHOW_ALL") => void;
  setTinting: (tinting: Set<Tinting>) => void;
  setYearsShown: (yearsShown: Set<Years>) => void;
  setFocusedElement(focusedElement: HTMLElement | undefined): void;
};

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

const initialState: NonFunctionProperties<State> = {
  yearsShown: new Set(),
  images: resolveImages(),
  tinting: new Set(),
  revealedImage: undefined,
  focusedElement: undefined,
  showData: false,
  autoPickableImageCards: new Map(),
  userControl: false,
};

export const part1Screen2Store = create<State>((set, get) => ({
  ...initialState,
  reset: () => set({ ...initialState }),
  setRevealedImage: (image) => {
    set({ revealedImage: image });
  },

  setTinting: (tinting) => {
    const { tinting: current } = get();
    if (!isSetEqual(tinting, current)) {
      set({ tinting });
      return;
    }
  },

  setYearsShown: (yearsShown) => {
    const { yearsShown: current } = get();
    if (!isSetEqual(yearsShown, current)) {
      set({ yearsShown });
      return;
    }
  },
  setFocusedElement(element) {
    if (get().userControl) {
      set({ focusedElement: element });
    }
  },
}));

export const usePart1Screen2Store = createStoreHook(part1Screen2Store);

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

function isSetEqual<T extends unknown>(a: Set<T>, bs: Set<T>) {
  if (a.size !== bs.size) return false;
  for (const aElement of a) if (!bs.has(aElement)) return false;
  return true;
}
