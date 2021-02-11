import { Anchor, AnchorProps, Button, ButtonProps } from "grommet";
import React, { useMemo } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { Routes } from "../Routes";

export function useQuery() {
  const location = useLocation().search;
  return useMemo(() => new URLSearchParams(location), [location]);
}

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

export const QueryButton = (
  props: ButtonProps & {
    query: {
      key: "modal";
      value: "about" | "privacy" | "credits";
      operation: "open" | "close";
    };
  } & Pick<
      React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >,
      "onClick"
    >
) => {
  const query = useQuery();
  const history = useHistory();

  return (
    <Button
      {...props}
      as={"div"}
      onClick={() => {
        if (props.query.operation === "close") {
          query.delete(props.query.key);
        } else {
          query.set(props.query.key, props.query.value);
        }
        history.push({
          ...history.location,
          search: query.toString(),
        });
      }}
    />
  );
};
