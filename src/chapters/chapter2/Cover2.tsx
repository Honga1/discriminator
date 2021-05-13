import { Text } from "grommet";
import React, { useEffect, useRef, useState } from "react";
import { useAnimationFrame } from "src/hooks/useAnimationFrame";
import { useAsyncMemo } from "src/hooks/useAsyncMemo";
import { usePredictions } from "src/hooks/usePredictions";
import { store } from "../../store/store";
import { eyes } from "./eyes/eyes";

export default function Cover2() {
  const ref = useRef<HTMLCanvasElement>(null);
  const predictions = usePredictions();

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
              image.onerror = () => reject();
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
              border: `1px solid rgba(0, 0, 0, 0.25)`,
            }}
          >
            You have blinked {openCount} time{openCount === 1 ? "" : "s"}
          </Text>
        </div>
        <canvas
          width={window.innerWidth / 2}
          height={window.innerHeight / 2}
          style={{ width: "100%", height: "100%" }}
          ref={ref}
        ></canvas>
      </div>
    </div>
  );
}
