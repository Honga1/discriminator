import { Box, DropButton, Text } from "grommet";
import React, { useState } from "react";
import { useChapterNumber } from "../../hooks/useChapterNumber";
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

  const chapterNumber = useChapterNumber();
  const buttonText = chapterNumber + "/4";

  return (
    <DropButton
      plain
      onOpen={onOpen}
      onClose={onClose}
      open={isOpen}
      dropAlign={{ bottom: "top" }}
      label={
        <Box direction="row">
          <Text color="offWhite" size="24px" style={{ lineHeight: "36px" }}>
            {buttonText}
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
            href="/chapter/1?type=chapter"
            onClick={onClose}
            label={
              <Text color="offWhite" size="24px" style={{ lineHeight: "36px" }}>
                Chapter 1
              </Text>
            }
          />
          <RoutedButton
            plain
            href="/chapter/2?type=cover"
            onClick={onClose}
            label={
              <Text color="offWhite" size="24px" style={{ lineHeight: "36px" }}>
                Chapter 2
              </Text>
            }
          />
          <RoutedButton
            plain
            href="/chapter/3?type=cover"
            onClick={onClose}
            label={
              <Text color="offWhite" size="24px" style={{ lineHeight: "36px" }}>
                Chapter 3
              </Text>
            }
          />
          <RoutedButton
            plain
            href="/chapter/4?type=cover"
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
