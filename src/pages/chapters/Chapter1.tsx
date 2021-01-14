import { Box, Stack, Text, Video } from "grommet";
import { useEffect, useRef } from "react";
import { WebcamPermissions } from "../../components/WebcamPermissions";
import { store, useStore } from "../../store/store";
import video from "./../../720p.mp4";

export const Chapter1 = () => {
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
      <Stack interactiveChild="first">
        <Box fill>
          <Video fit="contain" controls={false} autoPlay ref={ref as any}>
            <source src={video} type="video/mp4" />
          </Video>
        </Box>
        <Box fill align="center" justify="center" alignSelf="center">
          <Text>Chapter1</Text>
        </Box>
      </Stack>
      <WebcamPermissions />
    </>
  );
};
