# Technical Writeup

issues

client performance AI

low cost streaming media

finding a non gpu performant server

In early September 2020 Brett and I started working together. We produced a number of "sketches" to validate some of the ideas he had on new technologies that could be used to illustrate the concepts in the film.

One direction we chose to explore was to see if there was something out there that could do real-time deep faking so that we could employ the users visual/vocal identity throughout the piece. We found [Wav2Lip](https://github.com/Rudrabha/Wav2Lip) as it had recently been published.

The repository included a link to a Google Collab notebook which was able to take two media inputs, and output a video combining the audio from one, and the video from another, to produce a lip-synchronised deep fake. Important to note here is that Google provides free GPUs to run this code on, which significantly reduces the time taken to do this sort of processing, however these GPUs are shared, and are availability is not guaranteed, which stops using them for more continuous services.

We quickly rigged this up to provide a basic web interface to the service, so that we could play around with it. This resulted in a good deal of confusion from my friends as I sent them videos of them singing happy birthday to themselves. And for a platform for Brett to experiment with where this may fit in to his film.

I then put together a quick three video sequence webpage, in which at the beginning of the sequence, a photo from the users would be taken, then sent to the Google Collab notebook to be turned into a deep fake of the photo, speaking the early narration provided by Brett. This was a success and we agreed to use this in the final product.

In April the following year I began working to implement this on our own server. I started by getting it running on my PC. With my NVidia 970 GTX I was 

During January 2020 - April 2020 we moved into full production. Putting together the website, and assembling the animation and narration into a web frontend.
