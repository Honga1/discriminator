import { Button, ButtonProps } from "grommet";
import React from "react";
import { useNextStep } from "../hooks/useNextStep";

export const NextStepButton = (
  props: ButtonProps & {} & Pick<
      React.DetailedHTMLProps<
        React.ButtonHTMLAttributes<HTMLButtonElement>,
        HTMLButtonElement
      >,
      "onClick"
    >
) => {
  const nextStep = useNextStep();
  return <Button {...props} as={"div"} onClick={nextStep} />;
};
