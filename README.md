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
