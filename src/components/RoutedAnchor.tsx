import { Button, ButtonProps } from "grommet";
import React from "react";
import { Link } from "react-router-dom";
import { Routes } from "../Routes";

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
