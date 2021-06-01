import { Anchor, ResponsiveContext, Text } from "grommet";
import React, { useContext } from "react";

export const Support = () => {
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
        Discriminator is a 100% independent production, supported by grants from
        the Canada Council For The Arts, CreativeBC and Grant For The Web. Since
        all the creators of this work have been paid, you can show your support
        by helping activists.
        <br />
        <br />
        By watching this film with a Coil membership, micropayments are sent to
        the{" "}
        <Anchor target="_blank" href={"https://www.stopspying.org/"}>
          Surveillance Technology Oversight Project
        </Anchor>
        , an advocacy and policy group in New York that campaigns against mass
        surveillance.
        <br />
        <br />
        You can also donate to S.T.O.P. using the form below.
        <br />
        <br />
        Please sign up to our mailing list to keep up to date with Brett Gaylor
        and Imposter Media.
        <br />
        <br />
        <div
          data-ab-form
          data-ab-token="wmfRiNtihQRta36GbM4bSmvU"
          data-ab-height="auto"
        >
          <Anchor
            target="_blank"
            href="https://secure.actblue.com/donate/stopfilm"
          >
            Donate
          </Anchor>
        </div>
      </Text>
    </>
  );
};
