import { Menu } from "grommet";
import { Actions, Volume, VolumeLow } from "grommet-icons";

// Split the volume control into 6 segments. Empirically determined.
const VOLUME_STEP = 0.166667;
export const PlayableSettingsMenu = ({
  onVolumeChange,
}: {
  onVolumeChange: (deltaVolume: number) => void;
}) => {
  return (
    <Menu
      icon={<Actions />}
      dropAlign={{ bottom: "top", right: "right" }}
      dropBackground={{
        color: "background-back",
        opacity: "strong",
      }}
      items={[
        {
          icon: <Volume />,
          onClick: () => onVolumeChange(VOLUME_STEP),
          close: false,
        },
        {
          icon: <VolumeLow />,
          onClick: () => onVolumeChange(-VOLUME_STEP),
          close: false,
        },
      ]}
    />
  );
};
