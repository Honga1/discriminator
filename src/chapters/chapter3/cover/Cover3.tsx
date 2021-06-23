import { Text } from "grommet";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { ResizeCanvas } from "src/components/ResizeCanvas";
import { WorldOffset } from "src/components/WorldOffset";
import { useCoverAudio } from "src/hooks/useCoverAudio";
import { useHasFirstPrediction } from "src/hooks/useHasFirstPrediction";
import { store, useStore } from "src/store/store";
import { Mask } from "../../chapter2/part1/Mask";
import { RainbowVomit } from "../../chapter2/part1/RainbowVomit";
import { StaticBackground } from "../../../components/StaticBackground";
import { Howl } from "howler";
import { useAnimationFrame } from "src/hooks/useAnimationFrame";

import sound1Caf from "./audio/barf1.caf";
import sound1Ogg from "./audio/barf1.ogg";
import sound2Caf from "./audio/barf2.caf";
import sound2Ogg from "./audio/barf2.ogg";
import sound3Caf from "./audio/barf3.caf";
import sound3Ogg from "./audio/barf3.ogg";
import sound4Caf from "./audio/barf4.caf";
import sound4Ogg from "./audio/barf4.ogg";
import sound5Caf from "./audio/barf5.caf";
import sound5Ogg from "./audio/barf5.ogg";
import sound6Caf from "./audio/barf6.caf";
import sound6Ogg from "./audio/barf6.ogg";
import sound7Caf from "./audio/barf7.caf";
import sound7Ogg from "./audio/barf7.ogg";
import sound8Caf from "./audio/barf8.caf";
import sound8Ogg from "./audio/barf8.ogg";
import sound9Caf from "./audio/barf9.caf";
import sound9Ogg from "./audio/barf9.ogg";
import sound10Caf from "./audio/barf10.caf";
import sound10Ogg from "./audio/barf10.ogg";
import sound11Caf from "./audio/barf11.caf";
import sound11Ogg from "./audio/barf11.ogg";
import sound12Caf from "./audio/barf12.caf";
import sound12Ogg from "./audio/barf12.ogg";
import sound13Caf from "./audio/barf13.caf";
import sound13Ogg from "./audio/barf13.ogg";
import sound14Caf from "./audio/barf14.caf";
import sound14Ogg from "./audio/barf14.ogg";
import sound15Caf from "./audio/barf15.caf";
import sound15Ogg from "./audio/barf15.ogg";
import sound16Caf from "./audio/barf16.caf";
import sound16Ogg from "./audio/barf16.ogg";
import sound17Caf from "./audio/barf17.caf";
import sound17Ogg from "./audio/barf17.ogg";
import sound18Caf from "./audio/barf18.caf";
import sound18Ogg from "./audio/barf18.ogg";
import sound19Caf from "./audio/barf19.caf";
import sound19Ogg from "./audio/barf19.ogg";
import sound20Caf from "./audio/barf20.caf";
import sound20Ogg from "./audio/barf20.ogg";
import sound21Caf from "./audio/barf21.caf";
import sound21Ogg from "./audio/barf21.ogg";

import { usePredictions } from "src/hooks/usePredictions";

const soundSrc = [
  { ogg: sound1Ogg, caf: sound1Caf },
  { ogg: sound2Ogg, caf: sound2Caf },
  { ogg: sound3Ogg, caf: sound3Caf },
  { ogg: sound4Ogg, caf: sound4Caf },
  { ogg: sound5Ogg, caf: sound5Caf },
  { ogg: sound6Ogg, caf: sound6Caf },
  { ogg: sound7Ogg, caf: sound7Caf },
  { ogg: sound8Ogg, caf: sound8Caf },
  { ogg: sound9Ogg, caf: sound9Caf },
  { ogg: sound10Ogg, caf: sound10Caf },
  { ogg: sound11Ogg, caf: sound11Caf },
  { ogg: sound12Ogg, caf: sound12Caf },
  { ogg: sound13Ogg, caf: sound13Caf },
  { ogg: sound14Ogg, caf: sound14Caf },
  { ogg: sound15Ogg, caf: sound15Caf },
  { ogg: sound16Ogg, caf: sound16Caf },
  { ogg: sound17Ogg, caf: sound17Caf },
  { ogg: sound18Ogg, caf: sound18Caf },
  { ogg: sound19Ogg, caf: sound19Caf },
  { ogg: sound20Ogg, caf: sound20Caf },
  { ogg: sound21Ogg, caf: sound21Caf },
];
export default function Cover3() {
  const hasFirstPrediction = useHasFirstPrediction();
  useEffect(() => {
    store.setState({ isCameraEnabled: true });
  }, []);

  useCoverAudio(3);

  const hasWebcamStream = useStore((state) => state.webcamStream !== undefined);

  const [maskType, setMaskType] = useState<"video" | "brett" | "own">("own");
  const webcam = useStore((state) => state.webcamHTMLElement);
  const aspect = useStore((state) => state.webcamAspect);

  const predictions = usePredictions();
  const [openCount, setOpenCount] = useState(0);
  const wasOpenLastFrame = useRef(false);

  useAnimationFrame(10, () => {
    const prediction = predictions.current[0];
    const isOpen =
      prediction !== undefined ? prediction.mouthOpened > 0.5 : false;

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
    const sounds = Array.from({ length: 21 }).map((_, index) => {
      return new Howl({
        src: [soundSrc[index]!.ogg, soundSrc[index]!.caf],
        volume: 0.5,
      });
    });

    function* generator() {
      let lastPlayed = 0;

      while (true) {
        sounds[lastPlayed]?.stop();
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

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
      onClick={() =>
        setMaskType((type) =>
          type === "video" ? "brett" : type === "brett" ? "own" : "video"
        )
      }
    >
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <ResizeCanvas
          style={{
            position: "absolute",
            width: "100%",
            height: "100%",
            OTransform: "scale(-1, 1)",
            transform: "scale(-1, 1)",
          }}
          linear
          orthographic={false}
        >
          <StaticBackground></StaticBackground>
          {hasFirstPrediction && aspect !== undefined && (
            <>
              <WorldOffset targetAspect={aspect}>
                <Mask
                  track="center"
                  maskType={maskType}
                  webcam={webcam}
                  loop={true}
                ></Mask>
              </WorldOffset>
              <RainbowVomit targetAspect={aspect} />
            </>
          )}
        </ResizeCanvas>
        <div
          style={{
            position: "absolute",
            width: "100%",
            padding: "58px",
            top: 0,
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
              ? "Loading..."
              : "Tap the screen to change your mask"}
          </Text>
        </div>
      </div>
    </div>
  );
}
