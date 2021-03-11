import { ResponsiveContext, Text } from "grommet";
import React, { useContext } from "react";

export const About = () => {
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
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget euism
        neque, sed justo, nibh pulvinar fringilla euismod scelerisque. Eu et
        scelerisque maecenas magna dolor id arcu massa orci. Nunc commodo neque,
        quis eu eget imperdiet purus duis. Venenatis, amet sapien sollicitudin
        auctor sed gravida aliquet bibendum.
        <br />
        <br />
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget euismod
        neque, sed justo, nibh pulvinar fringilla euismod scelerisque. Eu et
        scelerisque maecenas magna dolor id arcu massa orci. Nunc commodo neque,
        quis eu eget imperdiet purus duis. Venenatis, amet sapien sollicitudin
        auctor sed gravida aliquet bibendum.
        <br />
        <br />
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget euismod
        neque, sed justo, nibh pulvinar fringilla euismod scelerisque. Eu et
        scelerisque maecenas magna dolor id arcu massa orci. Nunc commodo neque,
        quis eu eget imperdiet purus duis. Venenatis, amet sapien sollicitudin
        auctor sed gravida aliquet bibendum.
        <br />
        <br />
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget euismod
        neque, sed justo, nibh pulvinar fringilla euismod scelerisque. Eu et
        scelerisque maecenas magna dolor id arcu massa orci. Nunc commodo neque,
        quis eu eget imperdiet purus duis. Venenatis, amet sapien sollicitudin
        auctor sed gravida aliquet bibendum.
        <br />
        <br />
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget euismod
        neque, sed justo, nibh pulvinar fringilla euismod scelerisque. Eu et
        scelerisque maecenas magna dolor id arcu massa orci. Nunc commodo neque,
        quis eu eget imperdiet purus duis. Venenatis, amet sapien sollicitudin
        auctor sed gravida aliquet bibendum.
        <br />
        <br />
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Eget euismod
        neque, sed justo, nibh pulvinar fringilla euismod scelerisque. Eu et
        scelerisque maecenas magna dolor id arcu massa orci. Nunc commodo neque,
        quis eu eget imperdiet purus duis. Venenatis, amet sapien sollicitudin
        auctor sed gravida aliquet bibendum.
      </Text>
    </>
  );
};