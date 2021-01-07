import { Box, Text, Video } from "grommet";

export const Chapter1 = () => {
  return (
    <Box fill>
      <Text>Chapter1</Text>
      <Video controls={false} messages={{ openMenu: "cat" }}>
        <source src="small.mp4" type="video/mp4" />
        <source
          src="http://techslides.com/demos/sample-videos/small.webm"
          type="video/webm"
        />
        <source
          src="http://techslides.com/demos/sample-videos/small.ogv"
          type="video/ogg"
        />
        <source
          src="http://techslides.com/demos/sample-videos/small.3gp"
          type="video/3gp"
        />
      </Video>
    </Box>
  );
};
