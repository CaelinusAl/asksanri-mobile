import { Audio } from "expo-av";
import * as Haptics from "expo-haptics";

let unlocked = false;

export async function unlockAudioOnce() {
  if (unlocked) return;
  unlocked = true;
  try {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: false,
      playsInSilentModeIOS: true,
      staysActiveInBackground: false,
      shouldDuckAndroid: true,
    });
  } catch {}
}

export async function playTap() {
  try {
    await Haptics.selectionAsync();
  } catch {}
}

export async function playPulse() {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  } catch {}
}

export async function playSoundAsync(asset: any, volume = 0.7) {
  try {
    await unlockAudioOnce();
    const { sound } = await Audio.Sound.createAsync(asset, { volume }, (s) => {
      if (s.isLoaded && s.didJustFinish) sound.unloadAsync();
    });
    await sound.playAsync();
  } catch {}
}
