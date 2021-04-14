export {};

// function Chapter2BlazeFace() {
//   const ref = useRef<HTMLVideoElement>(null);
//   const rectRef = useRef<Mesh>();
//   const webcamRef = useRef<HTMLVideoElement>(null);
//   const geometry = useRef<BufferGeometry>(null);
//   const [canvasAspectRatio, setCanvasAspectRatio] = useState(
//     window.innerWidth / window.innerHeight
//   );
//   useChapter(ref, true);

//   const webcamStream = useStore((state) => state.webcamStream);

//   const model = useRef<blazeface.BlazeFaceModel>();

//   useEffect(() => {
//     if (!webcamStream || !webcamRef.current) return;
//     const video = webcamRef.current;
//     video.srcObject = webcamStream;

//     const track = webcamStream.getVideoTracks()[0]!;
//     video.width = track.getSettings().width!;
//     video.height = track.getSettings().height!;

//     setCanvasAspectRatio(video.width / video.height);

//     video.play();

//     const effect = async () => {
//       await new Promise((resolve) => {
//         video.onloadedmetadata = () => {
//           resolve(video);
//         };
//       });

//       model.current = await blazeface.load({
//         maxFaces: 1,
//       });
//     };

//     effect();
//   }, [model, webcamStream]);

//   useAnimationFrame(15, async () => {
//     if (
//       !webcamStream ||
//       !webcamRef.current ||
//       !model.current ||
//       !rectRef.current
//     )
//       return;
//     const video = webcamRef.current;

//     const predictions = await model.current.estimateFaces(
//       webcamRef.current,
//       false
//     );

//     if (predictions?.length <= 0) return;

//     const landmarks = predictions[0]!.landmarks! as [number, number][];
//     const topLeft = predictions[0]!.topLeft! as [number, number];
//     const bottomRight = predictions[0]!.bottomRight! as [number, number];

//     const positions3d = landmarks.flatMap(([x, y], index) => [
//       x / video.videoWidth,
//       -y / video.videoHeight,
//       0.0,
//     ]);

//     geometry.current?.setAttribute(
//       "position",
//       new BufferAttribute(new Float32Array(positions3d), 3)
//     );

//     const centerX = (topLeft[0] + bottomRight[0]) / 2;
//     const centerY = (topLeft[1] + bottomRight[1]) / 2;

//     const width = bottomRight[0] - topLeft[0];
//     const height = bottomRight[1] - topLeft[1];

//     rectRef.current.scale.setX(width / video.videoWidth);
//     rectRef.current.scale.setY(height / video.videoHeight);
//     rectRef.current.position.setX(centerX / video.videoWidth);
//     rectRef.current.position.setY(-centerY / video.videoHeight);
//   });

//   return (
//     <Box
//       style={{ position: "relative", width: "100%", height: "100%" }}
//       align="center"
//     >
//       <video
//         style={{
//           position: "absolute",
//           top: 0,
//           boxSizing: "border-box",
//           outline: "none",
//           width: "100%",
//           height: "100%",
//         }}
//         ref={webcamRef}
//         // hidden
//       ></video>
//       <Canvas
//         style={{
//           position: "absolute",
//           width: Math.min(1 / canvasAspectRatio, 1) * 100 + "%",
//           height: "100%",
//         }}
//         orthographic={true}
//       >
//         <Dots geometry={geometry}></Dots>
//         <Rect rectRef={rectRef}></Rect>
//       </Canvas>
//       <video
//         ref={ref}
//         style={{
//           boxSizing: "border-box",
//           outline: "none",
//           width: "100%",
//           height: "100%",
//         }}
//         width="100%"
//         height="100%"
//         src={videoSrc}
//       ></video>
//     </Box>
//   );
// }

// function Chapter2CLMTracker() {
//   const ref = useRef<HTMLVideoElement>(null);
//   const webcamRef = useRef<HTMLVideoElement>(null);
//   const geometry = useRef<BufferGeometry>(null);
//   const [canvasAspectRatio, setCanvasAspectRatio] = useState(
//     window.innerWidth / window.innerHeight
//   );
//   useChapter(ref, true);

//   const webcamStream = useStore((state) => state.webcamStream);

//   const tracker = useRef<clm.tracker>();

//   useEffect(() => {
//     if (!webcamStream || !webcamRef.current) return;
//     const video = webcamRef.current;
//     video.srcObject = webcamStream;

//     const track = webcamStream.getVideoTracks()[0]!;
//     video.width = track.getSettings().width!;
//     video.height = track.getSettings().height!;

//     setCanvasAspectRatio(video.width / video.height);

//     video.play();
//     tracker.current = new clm.tracker();
//     tracker.current.init();
//     tracker.current.start(video);
//   }, [tracker, webcamStream]);

//   useAnimationFrame(15, () => {
//     const positions = tracker.current?.getCurrentPosition() || undefined;

//     console.log(tracker.current?.getConvergence());
//     if (!webcamStream || !webcamRef.current) return;
//     const video = webcamRef.current;

//     if (!positions) return;
//     if (!geometry.current) return;

//     const positions3d = positions.flatMap(([x, y], index) => [
//       x / video.videoWidth,
//       -y / video.videoHeight,
//       0.0,
//     ]);

//     geometry.current?.setAttribute(
//       "position",
//       new BufferAttribute(new Float32Array(positions3d), 3)
//     );
//   });

//   return (
//     <Box
//       style={{ position: "relative", width: "100%", height: "100%" }}
//       align="center"
//     >
//       <video
//         style={{
//           position: "absolute",
//           top: 0,
//           boxSizing: "border-box",
//           outline: "none",
//           width: "100%",
//           height: "100%",
//         }}
//         ref={webcamRef}
//         hidden
//       ></video>
//       <Canvas
//         style={{
//           position: "absolute",
//           width: Math.min(1 / canvasAspectRatio, 1) * 100 + "%",
//           height: "100%",
//         }}
//         orthographic={true}
//       >
//         <Dots geometry={geometry}></Dots>
//       </Canvas>
//       <video
//         ref={ref}
//         style={{
//           boxSizing: "border-box",
//           outline: "none",
//           width: "100%",
//           height: "100%",
//         }}
//         width="100%"
//         height="100%"
//         src={videoSrc}
//       ></video>
//     </Box>
//   );
// }
