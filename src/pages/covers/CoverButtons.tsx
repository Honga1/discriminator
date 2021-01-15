import { Box, Layer } from "grommet";
import { Launch, Rewind } from "grommet-icons";
import { useHistory } from "react-router-dom";
import { ProgressIndicator } from "../../components/ProgressIndicator";
import { RoutedButton } from "../../components/RoutedAnchor";
import { chapterFlow, ChapterNumbers } from "../../Routes";
import { store } from "../../store/store";

export const CoverButtons = ({
  chapterNumber,
}: {
  chapterNumber: ChapterNumbers;
}) => {
  const url = `/chapter/${chapterNumber}?isCover` as const;
  const history = useHistory();

  return (
    <Layer
      full="horizontal"
      modal={false}
      position="bottom"
      responsive={false}
      plain
    >
      <Box
        alignSelf="center"
        direction="row"
        background="grey"
        margin={{ bottom: "small" }}
      >
        <RoutedButton
          icon={<Launch />}
          href={chapterFlow[url].next}
          onClick={() => {
            store.getState().nextVideoToPlay?.play();
            history.push(chapterFlow[url].next);
          }}
        />
        <RoutedButton icon={<Rewind />} href={chapterFlow[url].previous} />
      </Box>
      <ProgressIndicator />
    </Layer>
  );
};
