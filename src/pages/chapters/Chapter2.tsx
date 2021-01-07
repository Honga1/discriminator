import { Box, Image, Stack, Text } from "grommet";
import image from "../../1920x1080.png";
export const Chapter2 = () => {
  return (
    <Stack>
      <Box fill>
        <Image fill src={image}></Image>
      </Box>
      <Text>Chapter 2</Text>
    </Stack>
  );
};
