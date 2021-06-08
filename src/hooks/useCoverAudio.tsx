import device from "current-device";
import { Howl } from "howler";
import { useEffect, useMemo } from "react";
import cover2Caf from "src/audio/cover2_drone.caf";
import cover2Ogg from "src/audio/cover2_drone.ogg";
import cover3Caf from "src/audio/cover3_drone.caf";
import cover3Ogg from "src/audio/cover3_drone.ogg";
import cover4Caf from "src/audio/cover4_drone.caf";
import cover4Ogg from "src/audio/cover4_drone.ogg";
import { useStore } from "src/store/store";

export function useCoverAudio(cover: 2 | 3 | 4) {
  const audio = useMemo(() => {
    const useHTML5Loading = !device.ios();

    switch (cover) {
      case 2:
        return new Howl({
          src: [cover2Ogg, cover2Caf],
          html5: useHTML5Loading,
          loop: true,
          volume: 0.0,
        });
      case 3:
        return new Howl({
          src: [cover3Ogg, cover3Caf],
          html5: useHTML5Loading,
          loop: true,
          volume: 0.0,
        });
      case 4:
        return new Howl({
          src: [cover4Ogg, cover4Caf],
          html5: useHTML5Loading,
          loop: true,
          volume: 0.0,
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pageAnimationState = useStore((state) => state.pageAnimationState);

  useEffect(() => {
    if (pageAnimationState === "ANIMATE_OUT") {
      audio.fade(audio.volume(), 0.0, 1000);
    } else {
      audio.fade(audio.volume(), 0.1, 2000);
    }
  }, [audio, pageAnimationState]);

  useEffect(() => {
    audio.play();
    audio.fade(audio.volume(), 0.1, 2000);
    return () => {
      audio.unload();
      audio.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isMuted = useStore((state) => state.isMuted);
  useEffect(() => {
    audio.mute(isMuted);
  }, [audio, isMuted]);
}
