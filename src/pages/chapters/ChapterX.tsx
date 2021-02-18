import { Box } from "grommet";
import videoSrc from "./../../720p.mp4";
export const ChapterX = () => {
  // return <Box></Box>;
  return (
    <video
      style={{ boxSizing: "border-box", outline: "none" }}
      width="100%"
      src={videoSrc}
      controls
    ></video>
  );
};
