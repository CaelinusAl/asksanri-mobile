"react-native-purchases"ten satın almaları ithal eder;
"react-native"den { Platform } içe aktarmak;

let configured = yanlış;

function getApiKey(): string {
Expo public env vars
  const iosKey = process.env.EXPO_PUBLIC_RC_IOS_API_KEY ?? "";
  const androidKey = process.env.EXPO_PUBLIC_RC_ANDROID_API_KEY ?? "";

  return Platform.OS === "ios" ? iosKey : androidKey;
}

export function initRevenueCatOnce() {
RevenueCat web'de çalışmaz (browser crash önlemek için)
if (Platform.OS === "web") döner;
eğer (yapılandırılmış) dönüş;

  const apiKey = getApiKey();
eğer (!apiKey) geri dönerse; key yoksa sessiz geç

configure = doğru;
  Purchases.configure({ apiKey });
}

export async function getCustomerInfoSafe() {
if (Platform.OS === "web") null döndürür;
Try {
geri dönüşü bekleyin Purchases.getCustomerInfo();
} yakalamak {
    return null;
  }
}