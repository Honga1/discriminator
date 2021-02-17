import { Box, Stack, Text } from "grommet";
import { useEffect, useRef } from "react";
import { Playable } from "../../components/playable/Playable";
import { PlayableVideo } from "../../components/playable/PlayableVideo";
import { store, useStore } from "../../store/store";
import video from "./../../720p.mp4";

export const Chapter1 = ({ onFinished }: { onFinished: () => void }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const setNextVideoToPlay = useStore((state) => state.setNextVideoToPlay);

  useEffect(() => {
    const video = ref.current;
    if (video === null) return;
    setNextVideoToPlay(video);

    return () => {
      if (store.getState().nextVideoToPlay === video) {
        setNextVideoToPlay(undefined);
      }
    };
  }, [ref, setNextVideoToPlay]);

  return (
    <>
      <Stack fill interactiveChild="first">
        <Box fill>
          <Playable
            fit="cover"
            ref={ref}
            playable={PlayableVideo([{ src: video, type: "video/mp4" }])}
          ></Playable>
        </Box>
      </Stack>
      {/* <WebcamPermissions /> */}
    </>
  );
};
