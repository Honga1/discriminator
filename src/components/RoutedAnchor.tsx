import { Anchor, AnchorProps, Button, ButtonProps } from "grommet";
import React from "react";
import { Link } from "react-router-dom";
import { Routes } from "../Routes";

export const RoutedAnchor = (props: AnchorProps & { href: Routes }) => {
  return (
    <Link to={props.href}>
      <Anchor {...props} as={"div"} />
    </Link>
  );
};

export const RoutedButton = (
  props: ButtonProps & { href: Routes } & Pick<
      React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >,
      "onClick"
    >
) => {
  return (
    <Link to={props.href}>
      <Button {...props} as={"div"} />
    </Link>
  );
};
