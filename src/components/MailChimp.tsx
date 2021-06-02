import { Box, Button, ResponsiveContext, Text } from "grommet";
import React, { useContext, useState } from "react";
import { colorTheme } from "src/theme";
import styled from "styled-components";

export function MailchimpForm<T extends string>({
  fields,
  action,
  className,
}: Props<T>) {
  const [state, setState] = useState<
    {
      EMAIL: string | undefined;
    } & { [K in T]?: string }
  >({ EMAIL: undefined });

  const size = useContext(ResponsiveContext) as
    | "small"
    | "medium"
    | "large"
    | "xlarge";

  const isSmall = size === "small";

  const textSize = isSmall ? "20px" : "24px";
  const lineHeight = isSmall ? "30px" : "36px";

  const pad =
    size === "small"
      ? { horizontal: "13px", vertical: "3px" }
      : { horizontal: "13px", vertical: "3px" };

  return (
    <form action={action} className={className} method="POST" target="_blank">
      {fields.map((input, index) => (
        <label>
          <Text
            size={textSize}
            style={{ lineHeight: lineHeight }}
            color="black"
          >
            {input.label}
          </Text>
          :
          <br />
          <input
            style={{
              lineHeight,
              fontSize: textSize,
              paddingLeft: "13px",
              paddingRight: "13px",
              paddingTop: "3px",
              paddingBottom: "3px",
              background: colorTheme.offWhite,
            }}
            name={input.name}
            placeholder={input.placeholder}
            type={input.type}
            required={input.required}
            key={input.name}
            onChange={({ target }) =>
              setState((state) => ({ ...state, [input.name]: target.value }))
            }
            defaultValue={state[input.name]}
          />
        </label>
      ))}
      <Button
        plain
        type="submit"
        label={
          <OnHoverBox
            fillColor="blue"
            pad={pad}
            border={{ color: "blue", style: "solid", size: "3px" }}
            margin={{ horizontal: "13px" }}
          >
            <Text size={textSize} style={{ lineHeight }} color={"blue"}>
              Subscribe
            </Text>
          </OnHoverBox>
        }
      />

      {/* Bot protection */}
      <div style={{ position: "absolute", left: "-5000px" }} aria-hidden="true">
        <input
          type="text"
          name="b_5aaeb25c155592449bceaf3ee_6181594551"
          tabIndex={-1}
          defaultValue=""
        />
      </div>
    </form>
  );
}

interface Field<T extends string> {
  name: T;
  placeholder?: string;
  type?: string;
  required?: boolean;
  label: string;
}

interface Props<T extends string> {
  action: string;
  fields: [Field<"EMAIL">, ...Field<T>[]];
  className?: string;
  buttonClassName?: string;
}

const OnHoverBox = styled(Box)<{ fillColor: string }>`
  &:hover {
    background-color: ${(props) => props.fillColor};

    & > span {
      color: ${colorTheme.offWhite};
    }
  }

  & > span {
    color: ${(props) => props.fillColor};
  }

  transition: color 0.2s, background-color 0.2s;
`;
