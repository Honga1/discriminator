import { Box, Text } from "grommet";
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { useHasFirstPrediction } from "src/hooks/useHasFirstPrediction";
import { useHasPredictionConfidence } from "src/hooks/useHasPredictionConfidence";
import { store, useStore } from "src/store/store";
import { colorTheme } from "src/theme";
import { SquareDiv } from "../chapter3/components/SquareDiv";

export default function Cover1() {
  useEffect(() => {
    store.setState({ isCameraEnabled: true });
  }, []);

  const hasFirstPrediction = useHasFirstPrediction();
  const isConfident = useHasPredictionConfidence();
  const [hasPhoto, setHasPhoto] = useState(false);
  const webcamStream = useStore((state) => state.webcamStream);
  const hasWebcamStream = webcamStream !== undefined;

  const webcam = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (webcam.current === null || webcamStream === undefined) return;
    webcam.current.srcObject = webcamStream;
    webcam.current.play();
  }, [webcamStream]);

  return (
    <div
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          flexDirection: "column",
        }}
      >
        <Box
          style={{
            position: "absolute",
            width: "100%",
            paddingTop: "58px",
            boxSizing: "border-box",
            textAlign: "center",
          }}
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
              "Awaiting webcam permission"
            ) : !hasFirstPrediction ? (
              "Loading..."
            ) : !isConfident ? (
              <>
                Our AI cannot find your face. <br />
                Try adjust your lighting or positioning
              </>
            ) : !hasPhoto ? (
              "Take photo"
            ) : (
              "Re-take photo"
            )}
          </Text>
        </Box>

        {/* Reserves height for text */}
        <Box
          style={{
            width: "100%",
            paddingTop: "58px",
            boxSizing: "border-box",
            textAlign: "center",
            paddingBottom: "32px",
          }}
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
            Our AI cannot find your face. <br />
            Try adjust your lighting or positioning
          </Text>
        </Box>

        <Box
          flex={false}
          align="center"
          justify="center"
          pad={{ bottom: "150px" }}
        >
          <Box
            style={{
              maxWidth: "540px",
              maxHeight: "540px",
              width: "66vw",
              height: "66vw",
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
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </SquareDiv>
          </Box>
          <Box align="center">
            <Text
              color="yellow"
              size="16px"
              style={{
                textShadow: `0px 4px 4px rgba(0, 0, 0, 0.25)`,
                userSelect: "none",
                lineHeight: "32px",
                opacity: hasPhoto ? 1 : 0,
              }}
            >
              Photo taken
            </Text>
          </Box>
        </Box>
      </div>
    </div>
  );
}

const FaceSquare = ({
  background,
  children,
}: {
  background: string;
  isTalking: boolean;
  children: ReactNode;
}) => {
  return (
    <div style={{ width: "100%", height: "100%", position: "relative" }}>
      <div style={{ width: "100%", height: "100%", transform: "scale(0.81)" }}>
        <SquareDiv
          style={{
            background: background,
            borderRadius: "0%",
          }}
        />
      </div>
      <div
        style={{
          position: "absolute",
          width: "100%",
          height: "100%",
          top: 0,
          left: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <SquareDiv
          maxWidth="80%"
          maxHeight="80%"
          style={{
            overflow: "hidden",
            borderRadius: "0%",
            background: "#202122",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            WebkitMaskImage: "-webkit-radial-gradient(white, black)",
          }}
        >
          {children}
        </SquareDiv>
      </div>
    </div>
  );
};
