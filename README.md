# Discriminator

Discriminator is an interactive documentary about facial recognition databases directed by Brett Gaylor.

You can view the documentary at <https://www.discriminator.film/>.

This repository contains the client side application.

## Introduction

The documentary is a single page application. The content is a mix between a linear timeline and and interactive moments, separated into `chapters`, each with it's on chapter `cover`.

Interactivity is achieved through a mix between pointer interactions face tracking through the viewers webcam, and deep faking, which are optionally enabled. The analysis is done in two parts, one client side and one server side.j

To view the entire documentary you would typically follow the following flow through the pages:

Home -> Permissions -> Cover 1 -> Chapter 1 -> Cover 2 -> Chapter 2 -> Cover 3 -> Chapter 3 -> Cover 4 -> Chapter 4

On each of these pages three modals are able to be viewed: About, Privacy and Support.

## Pages

- Home `/` - Landing page
- Permissions `/permissions` - Explanation on the need to use the webcam for the interactive experience
- Cover 1 `/chapter/1?type=cover` - Interface for taking photos to send to the backend for deep faking
- Chapter 1 `/chapter/1?type=chapter` - Non interactive video chapter
- Cover 2 `/chapter/2?type=cover` - Face tracking based blink detection
- Chapter 2 `/chapter/2?type=chapter` - Face tracking masks, presentation of deep faked content, video
- Cover 3 `/chapter/3?type=cover` - Sandbox mode for face tracking masks
- Chapter 3 `/chapter/3?type=chapter` - DOM based interactive data visualisation
- Cover 4 `/chapter/4?type=cover` - Face deformation through face tracking
- Chapter 4 `/chapter/4?type=chapter` - Analysis of facial features to determine parameters, video

## Modals

- About `/?modal=about` - Description and credits for project and funding bodies
- Privacy `/?modal=privacy` - Privacy policy
- Support `/?modal=support` - How to support the project and it's initiative

## Streaming media

The videos in each of the chapters are streamed from a custom media server. Using either [MPEG-DASH](https://en.wikipedia.org/wiki/Dynamic_Adaptive_Streaming_over_HTTP) or [Apple HLS](https://developer.apple.com/streaming/).

The component that handles the selection and playback of these is [VideoPlayer](src\components\VideoPlayer.tsx).

## Frontend Face Tracking

[Tensorflow JS](https://www.tensorflow.org/js) is used for the frontend face tracking.

Covers 1, 2, 3 and chapter 2 use Tensorflow's [Face Landmarks Detection](https://github.com/tensorflow/tfjs-models/commits/master/face-landmarks-detection) model.

Cover 4, and chapter 4 use [@Vladimanic's](https://github.com/vladmandic) [Face API](https://github.com/vladmandic/face-api).

## Backend Deep Faking

The photo taken in Cover 1 and presented in Chapter 2 is deepfaked to lip synchronised along to the narration. This is done by a custom backend server using a modified version of [Wav2Lip](https://github.com/Rudrabha/Wav2Lip).

## Web monetisation

The project supports the proposed [web monetisation](https://webmonetization.org/) API through [Coil](https://coil.com/).

## Technologies

The project is made with [Create React App](https://github.com/facebook/create-react-app).

It uses typescript as the interface to the DOM. Canvas/WebGL animations are done with the help of [Three JS](https://threejs.org/) and [React Three Fiber](https://github.com/pmndrs/react-three-fiber).

DOM animations use [React Spring](https://react-spring.io/).
Global state is provided by [Zustand](https://github.com/pmndrs/zustand).

## Hosting

The live version of this webpage is currently hosted by [Netlify](https://www.netlify.com/). The two backend support servers (media streaming, and deep faking) are hosted on [Digital Ocean](https://www.digitalocean.com/) droplets.

## Analytics & Error Logging

The project uses [Sentry](https://sentry.io/) for error logging, and [Goat Counter](https://www.goatcounter.com/) for simple anonymous analytics.

## How to run

```bash
git clone https://github.com/honga1/discriminator
cd discriminator
npm i
npm start
```

# Technical Write Up

## Implementing Coil Webmonetisation

We used [Coil](https://coil.com/creator/how-to-monetize) to add monetization to the documentary. Currently we perform a rudimentary check to see if monetization is enabled, then trigger our logic off that.

There were three steps to enable this functionality:

1. Install the browser extension for our browser to inject the monetization compatibility into the document context. You can find the one for Google Chrome [here](https://chrome.google.com/webstore/detail/coil/locbifcbeldmnphbgkdigjmkbfkhbnca).

2. Then we added our payment meta tag into the html page

```html
<meta name="monetization" content="$payoutprovider.com/myAccount" />
```

3. Finally we created the logic to detect if a user is using web monetization:

```javascript
const isCoilUser = !!document.monetization;
```

## Client Performance

The film ended up using a number of different machine learning models. We use them for doing face, gender, emotion, and facial landmark detection. These were all run with TensorflowJS. An issue we faced, which was not surprising, was that client performance suffered heavily any time these were running.

On first load Tensorflow blocks rendering in the browser. This meant that users would see a very hard freeze, which couldn’t be overcome by a nice loading animation. So we had to be careful to only start the AI in certain moments, and to also keep them ‘hot’ once started. This was done with a pub/sub model that kept track of the number of subscribers to turn on and off the AI.

## Developing our own streaming media server

Our goal was to support a decent range of mobile and desktop web clients. To achieve that we would need to provide different levels of video quality per device. We looked into using services like Vimeo and Youtube to provide this, but the former was too expensive (requiring a pro account), and the latter does not provide direct access to the `<video>` tag, hiding it behind an iframe.

We chose then to develop a web server of our own to provide the media to our visitors. Using MPEG-DASH for modern clients, and HLS for older apple devices. The video format would be mp4. Surprisingly this does not seem to be a common operation. I got snagged on providing 206 partial responses to clients, and the technology required to make fragmented streams.

As it turns out using https://expressjs.com/ static file server was enough to overcome the partial request issues.

The script I developed to convert videos to be compatible with our clients is shown below:

```bash
PROJECT=$1
DESTINATION=./media/"$PROJECT"
INPUT_FILE="./raw/$PROJECT.mov"
WORKING_DIRECTORY="./tmp/"$PROJECT

encode() {
  echo "w: $1, h: $2, bitrate: $3, bufsize: $4"
  FFMPEG_OPTIONS="
  -ignore_chapters 1 \
  -i \"$INPUT*FILE\" \
  -vf \"scale=w=$1:h=$2\" -c:v libx264 \
  -x264-params keyint=48:min-keyint=48:scenecut=-1:nal-hrd=cbr  \
  -b:v "$3M" -bufsize 16M -maxrate "$3M" \
  -profile:v high -pix_fmt yuv420p -level 4.2  \
  -passlogfile ./tmp/log -an"
  ffmpeg "$FFMPEG_OPTIONS" -pass 1 -f mp4 \ /dev/null
  ffmpeg "$FFMPEG_OPTIONS" -pass 2 "$WORKING_DIRECTORY""*$1x$2.mp4"
  mp4fragment "$WORKING*DIRECTORY""*$1x$2.mp4" "$WORKING*DIRECTORY""*$1x$2_fragments.mp4"
}

encode 1920 1080 8 16
encode 1280 720 5 10
encode 768 432 2.5 5

#Audio - English
ffmpeg -y -i "$INPUT_FILE" -vn -c:a aac -metadata:s:a:0 language=eng "$WORKING_DIRECTORY""\_english.mp4"

mp4fragment --fragment-duration 2000 "$WORKING_DIRECTORY""_english.mp4" "$WORKING_DIRECTORY""\_english_fragments.mp4"

mp4dash \
  --verbose \
  --profiles=on-demand \
  --hls \
  --force \
  -o  "$DESTINATION" \
      "$WORKING_DIRECTORY""\_1920x1080_fragments.mp4" \
      "$WORKING_DIRECTORY""_1280x720_fragments.mp4" \
      "$WORKING_DIRECTORY""\_768x432_fragments.mp4" \
      "$WORKING_DIRECTORY""\_english_fragments.mp4"
```

This uses https://github.com/axiomatic-systems/Bento4 to do and https://www.ffmpeg.org/ to do the video transcoding.

We’re also in the process of converting part of the videos to vp9, as mp4 does not support alpha channels, and for chapter 2 we can save some load on the clients PC by using rendered masks instead of baked ones for the deep-fake moment.

## Finding a performant deep faking server

One direction we chose to explore was to see if there was something out there that could do real-time deep faking so that we could employ the users visual/vocal identity throughout the piece. We found [Wav2Lip](https://github.com/Rudrabha/Wav2Lip) as it had recently been published.

The repository included a link to a Google Collab notebook which was able to take two media inputs, and output a video combining the audio from one, and the video from another, to produce a lip-synchronised deep fake. Important to note here is that Google provides free GPUs to run this code on, which significantly reduces the time taken to do this sort of processing, however these GPUs are shared, and availability is not guaranteed, which stops using them for more continuous services.

We quickly rigged this up to provide a basic web interface to the service, so that we could play around with it. This resulted in a good deal of confusion from my friends as I sent them videos of them singing happy birthday to themselves. And for a platform for Brett to experiment with where this may fit into the film.

The next step was then to find a cloud GPU in which to run the deep faking as a service on. We took a look at the big three providers AWS, Azure, and Google Cloud, and found that pricing was in the range of $600 per month. This was fairly far out of our budget, especially if the project is to live for a decent period of time. Searching further, and we found that serverless GPU options weren't quite mature enough to handle the low start up time we would need. So we were stuck with having to go with a CPU based approach.

This posed an issue, as on my Intel i5 Sandy Bridge inference for one sample would take roughly 2 minutes, and regularly crash through out-of-memory on 16GB of ram. For each user we had a budget of 1.5 minutes to achieve, and since the server can only process one user's submission at a time we had a big issue on our hands.

If we were able to get that 2 minutes down to 10 seconds, we could handle 9 concurrent viewers for that section, equating to 360 viewers per hour, or 260 thousand per month. Which seemed like a reasonable amount, aiming to be within a budget of $30 per month.

I spent a considerable amount of time on this, working on converting the non compute optimised Wav2Lip code base to reduce inference speed. Those that have attempted this task will sympathise with how slow going this iterative approach is. Machine learning is not fast!

Approaches taken were:

- Quantisation - Which reduced the model size, but did not speed things up.
- Simplification of the code - Remove redundant logic and code. As we're always using the same audio file, we load in the mel spectrograms instead of recalculating them each time.
- Making the server 'hot' - Keep the model in memory and use a generator to respond to new files from the user. This reduced start up time.
- Run Pytorch with the MKL-DNN engine - A library for deep neural networks from Intel. This is supposed to make use of Intel specific instruction sets such as AVX2 and AVX-512, which are forms of SIMD acceleration.
- Compiling Pytorch for each architecture that we tested to run the code. This should enable specific accelerations from hardware vendors, which inturn should significantly decrease our inference time.
- Conversion to ONNX - A model format and inference engine from Microsoft that is purported to reduce inference time.
- Running the face detection algorithm client side, to guarantee the minimum information passed to the preprocessor on the server side.
- Making the batch size suit the run length so that we reduce cache misses.

All of this work reduced the beginning 2 minutes, down to roughly 80 seconds, well off our target. So I began working my way up the processing tiers from Digital Ocean’s Droplets. Each tier increased the processing capability, and also the cost. Using the ‘Basic - Premium Intel’ droplet, at $96 per month was the minimum that would support our requirements. While over budget, given the amount of work already conducted on trying to get this running it was considered an acceptable compromise.
