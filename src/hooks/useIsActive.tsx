import { store, useStore } from "../store/store";
import createActivityDetector from "activity-detector";

export function useIsActive() {
  return useStore((state) => state.isActive);
}
const activityDetector = createActivityDetector({
  timeToIdle: 8000,
  ignoredEventsWhenIdle: [],
  inactivityEvents: [],
});
activityDetector.on("idle", () => {
  store.setState({ isActive: false });
});

activityDetector.on("active", () => {
  store.setState({ isActive: true });
});
