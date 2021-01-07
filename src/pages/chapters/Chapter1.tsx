import { Box, Stack, Text, Video } from "grommet";
import video from "./../../720p.mp4";

export const Chapter1 = () => {
  return (
    <Stack interactiveChild="first">
      <Box fill>
        <Video fit="contain" controls={false} autoPlay muted>
          <source src={video} type="video/mp4" />
        </Video>
      </Box>
      <Box fill align="center" justify="center" alignSelf="center">
        <Text>Chapter1</Text>
      </Box>
    </Stack>
  );
};
