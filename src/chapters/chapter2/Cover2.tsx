import React, { useContext, useEffect, useRef, useState } from "react";
import { useAnimationFrame } from "src/hooks/useAnimationFrame";
import { useAsyncMemo } from "src/hooks/useAsyncMemo";
import { store } from "../../store/store";
import { eyes } from "./eyes/eyes";
import { SceneContext } from "./part1/SceneContext";

export default function Cover2() {
  const ref = useRef<HTMLCanvasElement>(null);
  const predictions = useContext(SceneContext).facemesh;

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
    const image = images[Math.floor(Math.random() * images.length)]!;

    const x = Math.random() * ref.current.width;
    const y = Math.random() * ref.current.height;
    const width = Math.random() * 75 + 25;
    const height = (width * image.naturalHeight) / image.naturalWidth;
    context.drawImage(image, x - width / 2, y - height / 2, width, height);
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
      <canvas
        width={window.innerWidth / 2}
        height={window.innerHeight / 2}
        style={{ width: "100%", height: "100%" }}
        ref={ref}
      ></canvas>
    </div>
  );
}
