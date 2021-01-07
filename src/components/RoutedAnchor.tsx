import { Anchor, AnchorProps, Button, ButtonProps } from "grommet";
import React from "react";
import { Link } from "react-router-dom";

export const RoutedAnchor = (props: AnchorProps & { href: string }) => {
  return (
    <Link to={props.href}>
      <Anchor {...props} as={"div"} />
    </Link>
  );
};

export const RoutedButton = (props: ButtonProps & { href: string }) => {
  return (
    <Link to={props.href}>
      <Button {...props} as={"div"} />
    </Link>
  );
};
