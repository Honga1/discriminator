import { Box, DropButton, Text } from "grommet";
import React, { useState } from "react";
import { colorTheme } from "../../theme";
import { RoutedButton } from "../RoutedAnchor";

export const ChapterSelectDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const onOpen = () => {
    setIsOpen(true);
  };
  const onClose = () => {
    setIsOpen(false);
  };

  return (
    <DropButton
      plain
      onOpen={onOpen}
      onClose={onClose}
      open={isOpen}
      dropProps={{ align: { top: "bottom" } }}
      label={
        <Box direction="row">
          <Text color="offWhite" size="24px" style={{ lineHeight: "36px" }}>
            1/4
          </Text>
          {!isOpen ? (
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6 19.9646L8.98938 22.954L16 15.9434L23.0106 22.954L26 19.9646L16.0354 10L16 10.0354L15.9646 10L6 19.9646Z"
                fill={colorTheme.offWhite}
              />
            </svg>
          ) : (
            <svg
              width="32"
              height="32"
              viewBox="0 0 32 32"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M26 12.9894L23.0106 10L16 17.0106L8.98938 10L6 12.9894L15.9646 22.954L16 22.9186L16.0354 22.954L26 12.9894Z"
                fill="#F8F9FA"
              />
            </svg>
          )}
        </Box>
      }
      dropContent={
        <Box
          background="black"
          pad="24px"
          border={{ color: "offWhite", size: "3px" }}
          gap="24px"
        >
          <RoutedButton
            plain
            href="/chapter/1"
            onClick={onClose}
            label={
              <Text color="offWhite" size="24px" style={{ lineHeight: "36px" }}>
                Chapter 1
              </Text>
            }
          />
          <RoutedButton
            plain
            href="/chapter/2"
            onClick={onClose}
            label={
              <Text color="offWhite" size="24px" style={{ lineHeight: "36px" }}>
                Chapter 2
              </Text>
            }
          />
          <RoutedButton
            plain
            href="/chapter/3"
            onClick={onClose}
            label={
              <Text color="offWhite" size="24px" style={{ lineHeight: "36px" }}>
                Chapter 3
              </Text>
            }
          />
          <RoutedButton
            plain
            href="/chapter/4"
            onClick={onClose}
            label={
              <Text color="offWhite" size="24px" style={{ lineHeight: "36px" }}>
                Chapter 4
              </Text>
            }
          />
        </Box>
      }
    />
  );
};