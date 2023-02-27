const childProcess = require("child_process");

/**
 *
 * @param {string} message
 * @param {string} voice
 * @param {number} speed -10 to 10
 * @returns
 */
export const TTS = async (
  message: string,
  voice = "Microsoft Paul",
  speed = 0
): Promise<void> => {
  if (!message.length) return;
  if (speed < -10 || speed > 10) return;

  let arg = `Add-Type -AssemblyName System.speech;`;
  arg += `$tts = New-Object System.Speech.Synthesis.SpeechSynthesizer;`;
  arg += `$tts.SelectVoice('${voice}');`;
  arg += `$tts.Rate = ${speed};`;
  arg += `$tts.Speak([Console]::In.ReadToEnd());$tts.Dispose()`;
  const spawn = childProcess.spawn("chcp 65001 >NUL & powershell.exe", [arg], {
    shell: true,
  });
  spawn.stdin.end(message);
  return new Promise((resolve, reject) => {
    spawn.addListener("exit", (code: string, signal: string) => {
      if (code === null || signal !== null) {
        reject(`code: ${code} ,signal: ${signal}`);
      }
      resolve();
    });
  });
};
