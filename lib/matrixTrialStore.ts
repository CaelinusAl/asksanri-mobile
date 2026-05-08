// lib/matrixTrialStore.ts
//
// Matrix Okuma "ücretsiz deneme" hakkı yönetimi.
// Apple uyumlu ürün akışı:
//   1) Kullanıcı bir kez ad/dob girip ücretsiz kısa Sanrı yansımasını alır.
//   2) Bu yansıma + numeroloji çıktısı = ne satın alacağının ön izlemesi.
//   3) İkinci girişte "Derin Analiz" paywall'ına yönlendirilir.
//
// Cihaz başına AsyncStorage'da tutulur — login zorunluluğu yok (Apple 5.1.1(v)).
// Apple reviewer da app reinstall ederek trial'ı tazeleyebilir.

import AsyncStorage from "@react-native-async-storage/async-storage";

const KEY = "sanri.matrix.trial.v1";

export type MatrixTrialState = {
  used: boolean;
  usedAt?: string;
  inputName?: string;
  inputDob?: string;
};

const EMPTY_STATE: MatrixTrialState = { used: false };

export async function getMatrixTrialState(): Promise<MatrixTrialState> {
  try {
    const raw = await AsyncStorage.getItem(KEY);
    if (!raw) return EMPTY_STATE;
    const parsed = JSON.parse(raw);
    if (typeof parsed?.used !== "boolean") return EMPTY_STATE;
    return parsed as MatrixTrialState;
  } catch {
    return EMPTY_STATE;
  }
}

export async function isMatrixTrialAvailable(): Promise<boolean> {
  const state = await getMatrixTrialState();
  return !state.used;
}

export async function markMatrixTrialUsed(input: {
  name?: string;
  dob?: string;
}): Promise<void> {
  const state: MatrixTrialState = {
    used: true,
    usedAt: new Date().toISOString(),
    inputName: input.name?.slice(0, 80) || undefined,
    inputDob: input.dob?.slice(0, 20) || undefined,
  };
  try {
    await AsyncStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // sessizce geç — trial state tracking critical değil
  }
}

// Geliştirici/admin amaçlı reset. UI'dan ulaşılmıyor.
export async function resetMatrixTrial(): Promise<void> {
  try {
    await AsyncStorage.removeItem(KEY);
  } catch {
    /* */
  }
}
