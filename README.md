# Web Voice-Activity-Detection (VAD)

Adaption of [@ricky0123's vad library](https://github.com/ricky0123/vad) that slightly shifts the API to support [Pipecat](https://www.pipecat.ai) use-cases.

## Getting started

`npm install onnxruntime-web @types/audioworklet @types/node web-vad`

### Copy Silero model somewhere accessible
Ensure `silero_vad.onnx` is hosted somewhere accessible (e.g. a public / static path.)

```typescript
import { VAD } from "web-vad";
import AudioWorkletURL from "@/vad/worklet.ts?worker&url";

enum State {
  SPEAKING = "Speaking",
  SILENT = "Silent",
}

const stream = new MediaStream([localAudioTrack!]);

const vad = new VAD({
    workletURL: AudioWorkletURL,
    modelUrl: "path-to-silero.onnx",
    stream,
    onSpeechStart: () => {
        setCurrentState(State.SPEAKING);
    },
    onVADMisfire: () => {
        setCurrentState(State.SILENT);
    },
    onSpeechEnd: () => {
        setCurrentState(State.SILENT);
    },
});

// Initalize and load models
await vad.init();

// Start when ready
vad.start();

console.log(vad.state); 
// > VADState.listening
```

## Vite support

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