import { Box, Button, Grid, Text } from "grommet";
import React, { useEffect, useRef } from "react";
import { ResizeCanvas } from "src/components/ResizeCanvas";
import { useHasFirstPrediction } from "src/hooks/useHasFirstPrediction";
import { useHasPredictionConfidence } from "src/hooks/useHasPredictionConfidence";
import { PredictionsStore } from "src/store/PredictionsStore";
import { store, useStore } from "src/store/store";
import { colorTheme } from "src/theme";
import styled from "styled-components";
import { StaticBackground } from "../../components/StaticBackground";
import { SquareDiv } from "../chapter3/components/SquareDiv";

export default function Cover1() {
  useEffect(() => {
    store.setState({ isCameraEnabled: true });
  }, []);

  const hasFirstPrediction = useHasFirstPrediction();
  const isConfident = useHasPredictionConfidence();
  const photo = useStore((state) => state.photo);
  const webcamStream = useStore((state) => state.webcamStream);
  const hasWebcamStream = webcamStream !== undefined;

  const webcam = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (webcam.current === null || webcamStream === undefined) return;
    webcam.current.srcObject = webcamStream;
    webcam.current.play();
  }, [webcamStream]);

  useEffect(() => {
    return () => {
      store.getState().submitToAi();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const takePhoto = async () => {
    const webcam = store.getState().webcamHTMLElement;
    const boundingBox = PredictionsStore.get()[0]?.boundingBox;
    if (!webcam || !boundingBox)
      throw new Error("Could not get either webcam or bounding box");

    const width = Math.floor(
      (boundingBox.bottomRight[0] - boundingBox.topLeft[0]) * webcam.videoWidth
    );

    const height = Math.floor(
      (boundingBox.topLeft[1] - boundingBox.bottomRight[1]) * webcam.videoHeight
    );

    const x = Math.floor(boundingBox.topLeft[0] * webcam.videoWidth);
    const y = -Math.floor(boundingBox.topLeft[1] * webcam.videoHeight);

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = width;
    canvas.height = height;
    context?.drawImage(webcam, x, y, width, height, 0, 0, width, height);

    const imageBlob = await getCanvasBlob(canvas);

    const formData = new FormData();
    formData.append("image", imageBlob, `${store.getState().session}.png`);

    store.setState({ photo: formData });
  };

  return hasWebcamStream ? (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      <Grid
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
        }}
        columns={["auto"]}
        rows={["auto", "auto", "auto"]}
        pad={{ vertical: "58px", horizontal: "24px" }}
      >
        <Box
          style={{
            textAlign: "center",
            pointerEvents: "all",
            position: "relative",
          }}
          align="center"
        >
          <Text
            color="yellow"
            size="32px"
            style={{
              textShadow: `0px 4px 4px rgba(0, 0, 0, 0.25)`,
              userSelect: "none",
              opacity: 0,
            }}
          >
            <>
              Our AI cannot find your face. <br />
              Try adjust your lighting or positioning
            </>
          </Text>
          <Box
            style={{
              position: "absolute",
              textAlign: "center",
              pointerEvents: "all",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
            align="center"
          >
            <Text
              color="yellow"
              size="32px"
              style={{
                textShadow: `0px 4px 4px rgba(0, 0, 0, 0.25)`,
                userSelect: "none",
              }}
            >
              {!hasWebcamStream ? (
                ""
              ) : !hasFirstPrediction ? (
                "Loading..."
              ) : !isConfident ? (
                <>
                  Our AI cannot find your face. <br />
                  Try adjust your lighting or positioning
                </>
              ) : (
                <Button
                  plain
                  onClick={() => {
                    if (photo === undefined) {
                      webcam.current?.pause();
                      takePhoto();
                    } else {
                      webcam.current?.play();
                      store.setState({ photo: undefined });
                    }
                  }}
                  size="small"
                  label={
                    <OnHoverBox
                      border={{ color: "yellow", style: "solid", size: "3px" }}
                      fillColor={colorTheme.blue}
                      pad={{ horizontal: "30px", vertical: "13px" }}
                    >
                      <Text
                        size="24px"
                        style={{ lineHeight: "24px" }}
                        color={"yellow"}
                      >
                        {photo === undefined ? "Take Photo" : "Re-take photo"}
                      </Text>
                    </OnHoverBox>
                  }
                />
              )}
            </Text>
          </Box>
        </Box>

        <Box align="center" justify="center">
          <Box
            flex={false}
            style={{
              maxWidth: "540px",
              maxHeight: "540px",
              width: "100%",
              height: "100%",
            }}
          >
            <SquareDiv
              style={{
                border: `3px solid ${colorTheme.greenLight}`,
                boxSizing: "border-box",
              }}
            >
              <video
                muted
                playsInline
                disablePictureInPicture
                autoPlay
                ref={webcam}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  OTransform: "scale(-1, 1)",
                  transform: "scale(-1, 1)",
                }}
              />
            </SquareDiv>
          </Box>
        </Box>
        <Box align="center">
          <Text
            color="yellow"
            size="16px"
            style={{
              textShadow: `0px 4px 4px rgba(0, 0, 0, 0.25)`,
              userSelect: "none",
              lineHeight: "32px",
              opacity: photo ? 1 : 0,
            }}
          >
            Photo taken
          </Text>
        </Box>
      </Grid>
    </div>
  ) : (
    <ResizeCanvas
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      orthographic={false}
      linear
    >
      <StaticBackground />
    </ResizeCanvas>
  );
}

function getCanvasBlob(canvas: HTMLCanvasElement) {
  return new Promise<Blob>(function (resolve, reject) {
    canvas.toBlob(function (blob) {
      if (blob === null) {
        reject("Blob was not created successfully from image");
        return;
      }

      resolve(blob);
    });
  });
}

const OnHoverBox = styled(Box)<{ fillColor: string }>`
  &:hover {
    background-color: ${(props) => props.fillColor};
  }

  transition: color 0.2s, background-color 0.2s;
`;
