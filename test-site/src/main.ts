import { VAD } from "web-vad";
import AudioWorkletURL from "web-vad/dist/worklet.js?worker&url";

async function createVAD() {
  const vad = new VAD({
    workletURL: AudioWorkletURL,
    onSpeechStart: () => {
      console.log("Speech start");
      document.querySelector<HTMLSpanElement>("#status")!.innerText =
        "Speaking";
    },
    onVADMisfire: () => {
      console.log("VAD misfire");
    },
    onSpeechEnd: () => {
      console.log("Speech end");
      document.querySelector<HTMLSpanElement>("#status")!.innerText = "Silence";
    },
  });
  await vad.init();

  document.querySelector<HTMLSpanElement>("#status")!.innerText = "Ready";
  vad.start();
}

createVAD();

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div>
    <span id="status">Initializing...</span>
  </div>
`;
