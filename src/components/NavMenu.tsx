import {
  Accordion,
  AccordionPanel,
  Anchor,
  Box,
  CheckBox,
  DropButton,
  Layer,
  Nav,
} from "grommet";
import { Menu } from "grommet-icons";
import {
  chapterRouteNames,
  chapterRoutes,
  plainPageRouteNames,
  plainPageRoutes,
} from "../Routes";
import { store, useStore } from "../store/store";
import { RoutedAnchor } from "./RoutedAnchor";

export const NavMenu = () => {
  const isUsingWebcam = useStore((state) => state.webcamStream !== "NOT_USED");
  return (
    <Layer modal={false} position="top-left" responsive={false}>
      <Box pad="small">
        <DropButton
          alignSelf="start"
          dropContent={
            <Nav direction="column" background="brand">
              {plainPageRoutes.map((url) => (
                <RoutedAnchor
                  href={url}
                  label={plainPageRouteNames[url]}
                  key={url}
                />
              ))}

              <CheckBox
                toggle
                label="Webcam"
                checked={isUsingWebcam}
                onChange={(event) => {
                  if (event.target.checked) {
                    const maybeStream = store.getState().webcamStream;
                    if (maybeStream instanceof MediaStream) {
                    } else {
                      store.getState().setWebcamStream(undefined);
                    }
                  } else {
                    store.getState().setWebcamStream("NOT_USED");
                  }
                }}
              />

              <Accordion animate direction="row">
                <AccordionPanel label={<Anchor label="Chapters" />}>
                  {chapterRoutes
                    .filter((url) => url.includes("isChapter"))
                    .map((url) => (
                      <RoutedAnchor
                        href={url}
                        label={chapterRouteNames[url]}
                        key={url}
                      />
                    ))}
                </AccordionPanel>
                <AccordionPanel label={<Anchor label="Covers" />}>
                  {chapterRoutes
                    .filter((url) => url.includes("isCover"))
                    .map((url) => (
                      <RoutedAnchor
                        href={url}
                        label={chapterRouteNames[url]}
                        key={url}
                      />
                    ))}
                </AccordionPanel>
              </Accordion>
            </Nav>
          }
        >
          <Menu />
        </DropButton>
      </Box>
    </Layer>
  );
};
