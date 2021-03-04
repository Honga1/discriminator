import { Button, ButtonProps } from "grommet";
import React from "react";
import { useHistory } from "react-router-dom";
import { useQuery } from "../hooks/useQuery";


export const ModalButton = (
  props: ButtonProps & {
    query: {
      key: "modal";
      value: "about" | "privacy" | "credits";
      operation: "open";
    } |
    {
      key: "modal";
      operation: "close";
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
      onClick={(event) => {
        props.onClick?.(event);
        if (props.query.operation === "close") {
          query.delete(props.query.key);
        } else {
          query.set(props.query.key, props.query.value);
        }
        history.push({
          ...history.location,
          search: query.toString(),
        });
      }} />
  );
};
