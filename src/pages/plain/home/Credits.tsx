import { ResponsiveContext, Text } from "grommet";
import React, { useContext } from "react";
import { CustomButton } from "./CustomButton";

export const Credits = () => {
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

      <CustomButton
        color={"red"}
        textContent={
          <span>
            Continue{" "}
            <span style={{ textDecoration: "underline" }}>without</span> webcam
          </span>
        }
        href="/chapter/1?isCover"
      />
      <CustomButton
        color={"green"}
        textContent={
          <span>
            Continue <span style={{ textDecoration: "underline" }}>with</span>{" "}
            webcam
          </span>
        }
        href="/chapter/1?isCover"
      />
    </>
  );
};
