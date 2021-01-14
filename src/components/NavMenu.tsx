import {
  Accordion,
  AccordionPanel,
  Anchor,
  Box,
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
import { RoutedAnchor } from "./RoutedAnchor";

export const NavMenu = () => {
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
