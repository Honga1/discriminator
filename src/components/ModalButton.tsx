import { Button, ButtonProps } from "grommet";
import React from "react";
import { useHistory } from "react-router-dom";
import { store } from "src/store/store";
import { useQuery } from "../hooks/useQuery";

export const OpenModalButton = (
  props: ButtonProps & {
    modal: "about" | "privacy" | "support";
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
        store.getState().chapter?.pause();
        props.onClick?.(event);
        query.set("modal", props.modal);
        history.push({
          ...history.location,
          search: query.toString(),
        });
      }}
    />
  );
};

export const CloseModalButton = (
  props: ButtonProps &
    Pick<
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
        query.delete("modal");
        history.push({
          ...history.location,
          search: query.toString(),
        });
      }}
    />
  );
};
