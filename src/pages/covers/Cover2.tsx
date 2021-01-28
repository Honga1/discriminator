import { Stack } from "grommet";
import React, { useRef } from "react";
import { WebcamPermissions } from "../../components/WebcamPermissions";
import { useStore } from "../../store/store";
import { FaceTracker } from "./FaceTracker";
import { IKeyPoints, VideoDetector } from "./VideoDetector";

export const Cover2 = () => {
  const stream = useStore((state) => state.webcamStream);
  const results = useRef<IKeyPoints>();

  return (
    <>
      <Stack alignSelf="center" guidingChild={"last"}>
        <FaceTracker keyPoints={results} />
        {stream instanceof MediaStream ? (
          <VideoDetector stream={stream} results={results} />
        ) : (
          `  : Web camera not enabled`
        )}
      </Stack>
      <WebcamPermissions />
    </>
  );
};
