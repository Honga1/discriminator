import { Box, Tip } from "grommet";
import { useHistory, useLocation } from "react-router-dom";
import { chapterRouteNames, chapterRoutes } from "../Routes";

export const ProgressIndicator = () => {
  const history = useHistory();
  const location = useLocation();

  const barElements = chapterRoutes.map((url) => {
    const isCurrentSection = location.pathname + location.search === url;
    const name = chapterRouteNames[url];
    return (
      <Tip content={name} key={url + isCurrentSection}>
        <Box
          fill
          background={isCurrentSection ? "lightgrey" : "grey"}
          onClick={() => {
            history.push(url);
          }}
        />
      </Tip>
    );
  });
  return (
    <Box
      fill="horizontal"
      background="lightgrey"
      height="10px"
      gap="xxsmall"
      direction="row"
      justify="evenly"
    >
      {barElements}
    </Box>
  );
};
