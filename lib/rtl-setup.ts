import { I18nManager } from "react-native";
import * as Updates from 'expo-updates';

export async function setupRTL() {
  // If RTL is not enabled yet
  if (!I18nManager.isRTL) {
    I18nManager.allowRTL(true);
    I18nManager.forceRTL(true);

    // RELOAD THE APP IMMEDIATELY
    // This forces the Native Header to repaint in RTL mode
    try {
      await Updates.reloadAsync();
    } catch (e) {
      // If in Expo Go or Dev Client, you might need to manually reload 
      // via the developer menu if this fails.
      console.warn("RTL Set. Please Restart App.");
    }
  }
}
