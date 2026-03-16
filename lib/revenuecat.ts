import Purchases, { LOG_LEVEL } from "react-native-purchases";
import { Platform } from "react-native";

const RC_ANDROID_KEY = "goog_ZkGAqrXfeCvhFDdYDvLPZbBZPwE";
const RC_IOS_KEY = "app4c53b32af7Y";

let configured = false;

export async function initRevenueCat() {
  if (configured) return;

  Purchases.setLogLevel(LOG_LEVEL.DEBUG);

  const apiKey = Platform.OS === "android" ? RC_ANDROID_KEY : RC_IOS_KEY;

  if (!apiKey || apiKey.includes(" ")) {
    throw new Error("RevenueCat public SDK key missing");
  }

  await Purchases.configure({ apiKey });
  configured = true;
}

export async function getSanriOffering() {
  const offerings = await Purchases.getOfferings();
  return offerings.current;
}

export async function buySanriPremium() {
  const offering = await getSanriOffering();

  if (!offering) {
    throw new Error("No current offering found");
  }

  if (!offering.availablePackages.length) {
    throw new Error("No active package found");
  }

  const selectedPackage = offering.availablePackages[0];
  const result = await Purchases.purchasePackage(selectedPackage);
  return result;
}

export async function getCustomerInfo() {
  return await Purchases.getCustomerInfo();
}