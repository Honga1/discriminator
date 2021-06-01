import { Anchor, ResponsiveContext, Text } from "grommet";
import React, { useContext } from "react";

export const Privacy = () => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  const isSmall = size === "small";
  const textSize = isSmall ? "20px" : "24px";
  const lineHeight = isSmall ? "30px" : "36px";
  return (
    <>
      <Text size={textSize} style={{ lineHeight: lineHeight }} color="black">
        This website does not store any information about users. Preferences as
        to whether you have selected to share your webcam are stored on your
        computer.
        <br />
        <br />
        Images from the webcam are processed in the following manner: Webcam
        images are sent to a cloud based virtual computer to run the “wav2lip”
        software library, which creates a video file of a users face, lip
        synched to a previously recorded audio file. This file is then sent back
        to discriminator.film and inserted into the film.
        <br />
        <br />
        The video is deleted after your session.
        <br />
        <br />
        This website does not use Google Analytics. We use{" "}
        <Anchor target="_blank" href="https://www.goatcounter.com/">
          Goat Counter
        </Anchor>
        , a privacy respecting analytics tool.
        <br />
        <br />
        There is a possibility that this Privacy Policy will be adapted in the
        future, to clarify or modify it in response to feature changes or user
        feedback. You can refer to the last updated timestamp at the bottom of
        the page.
        <br />
        <br />
        Last updated: May 19 2021
      </Text>
    </>
  );
};
