import fromEntries from "fromentries";
import { NonFunctionProperties } from "src/@types/NonFunctionProperties";
import createStoreHook from "zustand";
import create from "zustand/vanilla";
import { imageData, ImageMetaData } from "../../images/imageData";
import { getImagesForId } from "../../images/images";

export const tintingInShownOrder = ["wedding", "party", "family"] as const;
export type Tinting = typeof tintingInShownOrder[number];
type ImagesByTinting = Record<Tinting, MegafaceImageDescriptor[]>;

type State = {
  images: ImagesByTinting;
  autoPickableImageCards: Map<string, { current: HTMLElement | null }>;
  tinting: Set<Tinting>;
  focusedElement: HTMLElement | undefined;
  userControl: boolean;
  setTinting: (tinting: Set<Tinting>) => void;
  setFocusedElement(focusedElement: HTMLElement | undefined): void;
};

const resolveImages = () => {
  const result: ImagesByTinting = fromEntries(
    tintingInShownOrder.map((tinting) => {
      const images = imageData
        .filter(({ tagged }) => tagged.includes(tinting))
        .map((data) => {
          const { overlay, image } = getImagesForId(data.photo_id);
          const result: MegafaceImageDescriptor = {
            ...data,
            overlaySrc: overlay,
            imageSrc: image,
          };
          return result;
        });
      return [tinting, images];
    })
  ) as ImagesByTinting;
  return result;
};

const initialState: NonFunctionProperties<State> = {
  images: resolveImages(),
  tinting: new Set(),
  focusedElement: undefined,
  autoPickableImageCards: new Map(),
  userControl: false,
};

export const part3Store = create<State>((set, get) => ({
  ...initialState,
  reset: () => set({ ...initialState }),

  setTinting: (tinting) => {
    const { tinting: current } = get();
    if (!isSetEqual(tinting, current)) {
      set({ tinting });
      return;
    }
  },

  setFocusedElement(element) {
    if (get().userControl) {
      set({ focusedElement: element });
    }
  },
}));

export const usePart3Store = createStoreHook(part3Store);

export interface MegafaceImageDescriptor extends ImageMetaData {
  overlaySrc: string | undefined;
  imageSrc: string;
}

function isSetEqual<T extends unknown>(a: Set<T>, bs: Set<T>) {
  if (a.size !== bs.size) return false;
  for (const aElement of a) if (!bs.has(aElement)) return false;
  return true;
}
