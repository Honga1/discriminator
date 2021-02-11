import { ResponsiveContext, Text } from "grommet";
import React, { useContext } from "react";

export const Privacy = () => {
  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";
  return (
    <>
      <Text size={size === "small" ? "small" : "medium"}>
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
      </Text>
    </>
  );
};
