import { Text } from "grommet";
import { Howl } from "howler";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ResizeCanvas } from "src/components/ResizeCanvas";
import { StaticBackground } from "src/components/StaticBackground";
import { useAnimationFrame } from "src/hooks/useAnimationFrame";
import { useAsyncMemo } from "src/hooks/useAsyncMemo";
import { useCoverAudio } from "src/hooks/useCoverAudio";
import { useHasFirstPrediction } from "src/hooks/useHasFirstPrediction";
import { usePredictions } from "src/hooks/usePredictions";
import { store, useStore } from "src/store/store";
import sound1Caf from "./audio/1.caf";
import sound1Ogg from "./audio/1.ogg";
import sound2Caf from "./audio/2.caf";
import sound2Ogg from "./audio/2.ogg";
import sound3Caf from "./audio/3.caf";
import sound3Ogg from "./audio/3.ogg";
import sound4Caf from "./audio/4.caf";
import sound4Ogg from "./audio/4.ogg";
import sound5Caf from "./audio/5.caf";
import sound5Ogg from "./audio/5.ogg";
import sound6Caf from "./audio/6.caf";
import sound6Ogg from "./audio/6.ogg";
import { eyes } from "./eyes/eyes";

const soundSrc = {
  1: { ogg: sound1Ogg, caf: sound1Caf },
  2: { ogg: sound2Ogg, caf: sound2Caf },
  3: { ogg: sound3Ogg, caf: sound3Caf },
  4: { ogg: sound4Ogg, caf: sound4Caf },
  5: { ogg: sound5Ogg, caf: sound5Caf },
  6: { ogg: sound6Ogg, caf: sound6Caf },
};

export default function Cover2() {
  const ref = useRef<HTMLCanvasElement>(null);
  const predictions = usePredictions();

  useCoverAudio(2);

  const hasFirstPrediction = useHasFirstPrediction();
  const hasWebcamStream = useStore((state) => state.webcamStream !== undefined);

  const [openCount, setOpenCount] = useState(0);
  const wasOpenLastFrame = useRef(false);

  const images = useAsyncMemo(
    async () =>
      Promise.all(
        eyes.map(
          async (src) =>
            new Promise<HTMLImageElement>((resolve, reject) => {
              const image = new Image();
              image.onload = () => resolve(image);
              image.onerror = (error) => reject(error);
              image.src = src;
            })
        )
      ),
    [],
    []
  );
  useEffect(() => {
    store.setState({ isCameraEnabled: true });
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (!ref.current) return;
      const context = ref.current?.getContext("2d");
      if (!context) return;
      context.clearRect(0, 0, ref.current.width, ref.current.height);
      setOpenCount(0);
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
    };
  }, []);
  useAnimationFrame(10, () => {
    const isOpen = predictions.current[0]?.eyesOpened ?? false;

    if (isOpen && !wasOpenLastFrame.current) {
      setOpenCount((count) => count + 1);
    }

    if (isOpen) {
      wasOpenLastFrame.current = true;
    } else {
      wasOpenLastFrame.current = false;
    }
  });

  const sounds = useMemo(() => {
    const sounds = Array.from({ length: 6 }).map((_, index) => {
      return new Howl({
        src: [
          soundSrc[(index + 1) as keyof typeof soundSrc].ogg,
          soundSrc[(index + 1) as keyof typeof soundSrc].caf,
        ],
        volume: 0.5,
      });
    });

    function* generator() {
      let lastPlayed = 0;

      while (true) {
        let toPlay = Math.floor(Math.random() * sounds.length);
        if (toPlay === lastPlayed) {
          toPlay++;
        }

        toPlay %= sounds.length;
        lastPlayed = toPlay;

        yield sounds[lastPlayed]!;
      }
    }

    return generator();
  }, []);

  useEffect(() => {
    if (openCount === 0) return;
    sounds.next().value?.play();
  }, [openCount, sounds]);

  useEffect(() => {
    if (!ref.current) return;
    const context = ref.current?.getContext("2d");
    if (!context) return;
    if (images.length === 0) return;

    const amountOfImages = Math.min(Math.floor(openCount ** 1.5), 10);

    for (let index = 0; index < amountOfImages; index++) {
      const image = images[Math.floor(Math.random() * images.length)]!;
      const x = Math.random() * ref.current.width;
      const y = Math.random() * ref.current.height;
      const width = Math.random() * 75 + 25;
      const height = (width * image.naturalHeight) / image.naturalWidth;
      context.drawImage(image, x - width / 2, y - height / 2, width, height);
    }
  }, [images, openCount]);

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: "50%",
        transform: "translate(-50%, -50%)",
        left: "50%",
      }}
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <div
          style={{
            position: "absolute",
            width: "100%",
            padding: "58px",
            boxSizing: "border-box",
            textAlign: "center",
          }}
        >
          <Text
            color="yellow"
            size="32px"
            style={{
              textShadow: `0px 4px 4px rgba(0, 0, 0, 0.25)`,
            }}
          >
            {!hasWebcamStream
              ? ""
              : !hasFirstPrediction
              ? `Do not blink`
              : `You have blinked ${openCount} time${
                  openCount === 1 ? `` : "s"
                }`}
          </Text>
        </div>
        {hasWebcamStream ? (
          <canvas
            width={window.innerWidth / 2}
            height={window.innerHeight / 2}
            style={{ width: "100%", height: "100%" }}
            ref={ref}
          ></canvas>
        ) : (
          <ResizeCanvas
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              pointerEvents: "none",
            }}
            orthographic={false}
            linear
          >
            <StaticBackground />
          </ResizeCanvas>
        )}
      </div>
    </div>
  );
}
