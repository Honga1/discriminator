import {
  memo,
  MutableRefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IMediaElement } from "../../../hooks/IMediaElement";
import { MultipleMediaElementChain } from "../../../hooks/MultipleMediaElementChain";
import { useChapter } from "../../../hooks/useChapter";
import part1AudioSrc from "./Chapter3Part1.mp3";
import { Part1Screen1 } from "./Part1Screen1";
import { Part1Screen2, Part1Screen2Props } from "./Part1Screen2";

export default function Chapter3() {
  const ref = useRef<IMediaElement>(null);
  useChapter(ref);

  const [seconds, setSeconds] = useState(0);

  const onTimeUpdate = useCallback((event: Event) => {
    const audio = event.target as IMediaElement;
    const seconds = Math.round(audio.currentTime);
    setSeconds(seconds);
  }, []);

  const render = useMemo(() => {
    if (seconds < 30) {
      return <Part1Screen1 />;
    } else {
      let stage: Part1Screen2Props["stage"];

      // Start at the time above it, ends at the if statement.
      if (seconds < 38) {
        stage = "NO_YEARS";
      } else if (seconds < 42) {
        stage = "2011";
      } else if (seconds < 45) {
        stage = "2010";
      } else if (seconds < 48) {
        stage = "2007";
      } else if (seconds < 52) {
        stage = "2013";
      } else if (seconds < 54) {
        stage = "2006";
      } else if (seconds < 56) {
        stage = "2012";
      } else if (seconds < 57) {
        stage = "ZOOMED_OUT";
      } else if (seconds < 60) {
        //  I see you
        stage = 0;
      } else if (seconds < 61) {
        stage = "ZOOMED_OUT";
      } else if (seconds < 65) {
        // "A kid with a pumpkin" ZOOMIN 1
        stage = 1;
      } else if (seconds < 66) {
        stage = "ZOOMED_OUT";
      } else if (seconds < 70) {
        // "I see, looks like you" ZOOMIN 2
        stage = 2;
      } else if (seconds < 72) {
        stage = "ZOOMED_OUT";
      } else if (seconds < 76) {
        // "There's a woman" ZOOMIN 3
        stage = 3;
      } else if (seconds < 77) {
        stage = "ZOOMED_OUT";
      } else if (seconds < 93) {
        //  "There's you" ZOOMIN 4
        stage = 4;
      } else if (seconds < 94) {
        stage = "ZOOMED_OUT";
      } else {
        stage = "USER_CONTROL";
      }

      return <Part1Screen2 stage={stage} />;
    }
  }, [seconds]);

  const srcArray = useMemo(() => [part1AudioSrc, part1AudioSrc], []);
  return (
    <>
      <ChainedAudio
        forwardRef={ref}
        srcArray={srcArray}
        onTimeUpdate={onTimeUpdate}
      />

      {render}
    </>
  );
}

const ChainedAudio = memo(
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
