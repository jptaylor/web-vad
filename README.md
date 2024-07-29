# Web Voice Activity Detection (VAD)

Adaption of [@ricky0123's vad library](https://github.com/ricky0123/vad) that slightly shifts the API to only support passing a media stream, addresses some Typescript issues and reduces the codebase where possible. The primary purpose of this adaption is to support realtime voice agents, such as those provided by [Pipecat](https://www.pipecat.ai).

## Getting started

`npm install onnxruntime-web web-vad`

#### Copy Silero model somewhere accessible

Ensure `silero_vad.onnx` (included in this repo) is hosted somewhere accessible (e.g. a public / static path.)

#### Ensure audio worker is available globally

Browsers ensure worklets cannot be imported as modules for safety reasons. Either import it with your framework specific syntax (e.g. `import AudioWorkletURL from "web-vad/worklet.js?worker&url";`) or include it manually in a `<script>` declaration (at a higher order.)

#### Example project

An barebones example is included in this repo:

```shell
cd test-site
yarn
yarn run dev
```

Navigate to the URL shown in your terminal


## Usage

```typescript
import { VAD } from "web-vad";
import AudioWorkletURL from "web-vad/worklet.js?worker&url";


const localAudioTrack = ... // Get mic or other audio track
const stream = new MediaStream([localAudioTrack!]);

const vad = new VAD({
    workletURL: AudioWorkletURL,
    modelUrl: "path-to-silero.onnx",
    stream,
    onSpeechStart: () => {
        console.log("speaking start");
    },
    onVADMisfire: () => {
        console.log("misfire");
    },
    onSpeechEnd: () => {
        console.log("speaking end");
    },
});

// Initalize and load models
await vad.init();

// Start when ready
vad.start();

console.log(vad.state); 
// > VADState.listening
```

## Next / Vite support

Web VAD uses WASM files provided by ONNX. Whilst these can be loaded at runtime, it is recommended to copy these files to your build / deployment. Here is an example `vite.config.js` that copies these files across at build time:

```js
// vite.config.js

export default defineConfig({
  assetsInclude: ["**/*.onnx"],
  server: {
    headers: {
      "Cross-Origin-Embedder-Policy": "require-corp",
      "Cross-Origin-Opener-Policy": "same-origin",
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [
    viteStaticCopy({
      targets: [
        {
          src: "node_modules/onnxruntime-web/dist/*.wasm",
          dest: "./",
        },
      ],
    }),
  ],
});

```

## References
[1] Silero Team. (2021). Silero VAD: pre-trained enterprise-grade Voice Activity Detector (VAD), Number Detector and Language Classifier. GitHub, GitHub repository, https://github.com/snakers4/silero-vad, hello@silero.ai.

[2] Ricky Samore. Original code, https://github.com/ricky0123/vad, rickycontact9@gmail.com