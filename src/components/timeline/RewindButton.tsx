import { Button } from "grommet";
import React from "react";
import { store } from "../../store/store";
import { colorTheme } from "../../theme";

export const RewindButton = ({ disabled }: { disabled: boolean }) => {
  const offWhite = colorTheme.offWhite;

  return (
    <Button
      plain
      onClick={() => store.getState().chapter?.seekTimeDelta(-10)}
      icon={
        <svg
          width="32"
          height="32"
          viewBox="0 0 32 32"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g clipPath="url(#clip0)">
            <path
              d="M16 6C21.5228 6 26 10.4772 26 16C26 21.5228 21.5228 26 16 26C10.4772 26 6 21.5228 6 16C6 13.239 7.11898 10.7393 8.92817 8.92969"
              stroke={offWhite}
              strokeWidth="3"
            />
            <path
              d="M10.006 5.32348L17.5519 1.86969L15.9737 11.0902L10.006 5.32348Z"
              fill={offWhite}
            />
            <path
              d="M14.1289 19H13V14.6484L11.6523 15.0664V14.1484L14.0078 13.3047H14.1289V19ZM19.8086 16.6484C19.8086 17.4349 19.6458 18.0365 19.3203 18.4531C18.9948 18.8698 18.5182 19.0781 17.8906 19.0781C17.2708 19.0781 16.7969 18.8737 16.4688 18.4648C16.1406 18.056 15.9727 17.4701 15.9648 16.707V15.6602C15.9648 14.8659 16.1289 14.263 16.457 13.8516C16.7878 13.4401 17.263 13.2344 17.8828 13.2344C18.5026 13.2344 18.9766 13.4388 19.3047 13.8477C19.6328 14.2539 19.8008 14.8385 19.8086 15.6016V16.6484ZM18.6797 15.5C18.6797 15.0286 18.6146 14.6862 18.4844 14.4727C18.3568 14.2565 18.1562 14.1484 17.8828 14.1484C17.6172 14.1484 17.4206 14.2513 17.293 14.457C17.168 14.6602 17.1016 14.9792 17.0938 15.4141V16.7969C17.0938 17.2604 17.1562 17.6055 17.2812 17.832C17.4089 18.056 17.612 18.168 17.8906 18.168C18.1667 18.168 18.3659 18.0599 18.4883 17.8438C18.6107 17.6276 18.6745 17.2969 18.6797 16.8516V15.5Z"
              fill={offWhite}
            />
          </g>
          <defs>
            <clipPath id="clip0">
              <rect width="32" height="32" fill={offWhite} />
            </clipPath>
          </defs>
        </svg>
      }
      color="offWhite"
      disabled={disabled}
    ></Button>
  );
};
