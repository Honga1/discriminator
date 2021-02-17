import { Box, Button, Layer, Text } from "grommet";
import React, { useCallback, useState } from "react";
import { useStore } from "../store/store";
import { CustomQueryButton } from "../pages/plain/CustomButton";

export const WebcamPermissions = () => {
  const storeMediaStream = useStore((state) => state.webcamStream);
  const setWebcamStream = useStore((state) => state.setWebcamStream);

  const [error, setError] = useState<undefined | WebcamFailureReason>();

  let uiState;
  if (storeMediaStream === "DISCONNECTED") {
    uiState = "DISCONNECTED";
  }

  if (storeMediaStream === "NOT_USED") {
    uiState = "NOT_USED";
  }

  if (storeMediaStream === undefined && error === undefined) {
    uiState = "PERMISSION";
  }

  if (storeMediaStream === undefined && error !== undefined) {
    uiState = "ERROR";
  }

  if (storeMediaStream instanceof MediaStream) {
    uiState = "CONNECTED";
  }

  const connectWebcam = useCallback(async () => {
    const maybeStream = await getVideoStream();
    if (typeof maybeStream === "string") {
      setError(maybeStream);
    } else {
      setWebcamStream(maybeStream);
      setError(undefined);
      maybeStream.getTracks().forEach((track) => {
        track.addEventListener("ended", () => {
          setWebcamStream("DISCONNECTED");
        });
      });
    }
  }, [setWebcamStream]);

  const PermissionsWindow = () => (
    <Box gap="small">
      <Text alignSelf="center">Grant permission to use webcam?</Text>
      <Box direction="row" gap="small">
        <Button
          primary
          label={"Accept"}
          onClick={async () => {
            connectWebcam();
          }}
        />
        <Button
          label={"Decline & Proceed"}
          onClick={() => setWebcamStream("NOT_USED")}
        />
        <CustomQueryButton
          color="red"
          query={{ key: "modal", operation: "open", value: "privacy" }}
          textContent={"Check privacy policy"}
        />
      </Box>
    </Box>
  );

  const DisconnectedWindow = () => (
    <Box gap="small">
      <Text alignSelf="center">Webcam disconnected unexpectedly.</Text>
      <Box direction="row" gap="small">
        <Button
          primary
          label={"Try Again?"}
          onClick={async () => {
            connectWebcam();
          }}
        />
        <Button
          label={"Decline & Proceed"}
          onClick={() => setWebcamStream("NOT_USED")}
        />
        <CustomQueryButton
          color="red"
          query={{ key: "modal", operation: "open", value: "privacy" }}
          textContent={"Check privacy policy"}
        />
      </Box>
    </Box>
  );

  const ErrorWindow = () => {
    return (
      <Box gap="small">
        <Text alignSelf="center">
          There was an error connecting the webcam.
        </Text>
        <Box alignSelf="center">
          <Text>
            Error:{" "}
            {error === "GENERAL_ERROR"
              ? "Could not connect to webcam"
              : "Sorry, something went wrong on our side"}
          </Text>
        </Box>
        <Box direction="row" gap="small">
          <Button
            primary
            label={"Try Again?"}
            onClick={async () => {
              connectWebcam();
            }}
          />
          <Button
            label={"Decline & Proceed"}
            onClick={() => setWebcamStream("NOT_USED")}
          />
          <CustomQueryButton
            color="red"
            query={{ key: "modal", operation: "open", value: "privacy" }}
            textContent={"Check privacy policy"}
          />
        </Box>
      </Box>
    );
  };

  const isShown =
    uiState === "DISCONNECTED" ||
    uiState === "PERMISSION" ||
    uiState === "ERROR";

  return (
    <>
      {isShown && (
        <Layer modal responsive={false} position={"center"}>
          <Box gap="small">
            {uiState === "PERMISSION" && <PermissionsWindow />}
            {uiState === "DISCONNECTED" && <DisconnectedWindow />}
            {uiState === "ERROR" && <ErrorWindow />}
          </Box>
        </Layer>
      )}
    </>
  );
};

type WebcamFailureReason = "GENERAL_ERROR" | "SECURITY";

async function getVideoStream(): Promise<MediaStream | WebcamFailureReason> {
  try {
    if (navigator.mediaDevices === undefined)
      throw new DOMException("Page is not HTTPS", "NotAllowedError");

    const stream = await navigator.mediaDevices.getUserMedia({
      video: { width: 1280, height: 720, facingMode: "user" },
      audio: false,
    });
    return stream;
  } catch (error: DOMException | unknown) {
    if (
      !(error instanceof DOMException) &&
      !(error instanceof MediaStreamError)
    )
      throw error;

    // These error names are from https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia
    switch (error.name) {
      case "AbortError":
        return "GENERAL_ERROR";

      case "NotAllowedError":
        return "SECURITY";

      case "NotFoundError":
        return "GENERAL_ERROR";

      case "NotReadableError":
        return "GENERAL_ERROR";

      case "OverconstrainedError":
        throw error;
      case "SecurityError":
        return "SECURITY";

      case "TypeError":
        throw error;

      default:
        throw error;
    }
  }
}
