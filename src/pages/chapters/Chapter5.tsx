import { Box, Stack, Text, Video } from "grommet";
import React from "react";
import video from "./../../720p.mp4";

export const Chapter5 = () => {
  return (
    <Stack interactiveChild="first">
      <Box fill>
        <Video fit="contain" controls={false} autoPlay muted>
          <source src={video} type="video/mp4" />
        </Video>
      </Box>
      <Text>Chapter5</Text>
    </Stack>
  );
};
