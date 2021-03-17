import { memo, MutableRefObject, useEffect, useMemo, useRef } from "react";
import { IMediaElement } from "../../../IMediaElement";
import { MultipleMediaElementChain } from "../../../MultipleMediaElementChain";

export const ChainedAudio = memo(
  ({
    srcArray,
    forwardRef,
    onTimeUpdate,
  }: {
    onTimeUpdate?: (event: Event) => void;
    forwardRef: MutableRefObject<IMediaElement | null> | null;
    srcArray: string[];
  }) => {
    const elementRefs = useRef<(IMediaElement | null)[]>([]);
    useEffect(() => {
      if (!forwardRef) return;
      const elements = elementRefs.current.flatMap((element) =>
        element ? [element] : []
      );
      forwardRef.current = new MultipleMediaElementChain(elements);
    }, [forwardRef]);

    useEffect(() => {
      if (onTimeUpdate) {
        forwardRef?.current?.addEventListener("timeupdate", onTimeUpdate);
        return () => {
          forwardRef?.current?.removeEventListener("timeupdate", onTimeUpdate);
        };
      }
    }, [forwardRef, onTimeUpdate]);

    const elements = useMemo(
      () =>
        srcArray.map((src, index) => (
          <audio
            ref={(ref) => (elementRefs.current[index] = ref)}
            src={src}
            key={index}
            controls={false}
            hidden
          />
        )),
      [srcArray]
    );
    return <>{elements}</>;
  }
);
