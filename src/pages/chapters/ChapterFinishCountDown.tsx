import { Layer, Text } from "grommet";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router-dom";
import { chapterFlow, ChapterNumbers } from "../../Routes";

export const ChapterFinishCountDown = ({
  chapterNumber,
}: {
  chapterNumber: ChapterNumbers;
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(5);
  const history = useHistory();

  const isCover = new URLSearchParams(useLocation().search).has("isCover");
  const isChapter = new URLSearchParams(useLocation().search).has("isChapter");

  useEffect(() => {
    const onSecond = () => {
      setSecondsRemaining((seconds) => seconds - 1);
    };
    let timer: NodeJS.Timeout | undefined;
    if (secondsRemaining > 0) {
      timer = setTimeout(onSecond, 1000);
    } else {
      if (!isCover && !isChapter) {
        history.push(`/chapter/${chapterNumber}?isCover`);
      }

      if (isCover) {
        const url = `/chapter/${chapterNumber}?isCover` as const;
        history.push(chapterFlow[url].next);
      } else {
        const url = `/chapter/${chapterNumber}?isChapter` as const;
        history.push(chapterFlow[url].next);
      }
    }

    return () => timer && clearInterval(timer);
  }, [chapterNumber, history, isChapter, isCover, secondsRemaining]);

  useEffect(() => {});

  return (
    <Layer position="center" modal={false} responsive={false}>
      <Text size="large">Going to the next page in: {secondsRemaining}</Text>
    </Layer>
  );
};
