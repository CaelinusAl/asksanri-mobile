export type RitualGeneratorResult = {
  title: string;
  text: string;
};

export const actions = [
  "yak",
  "sil",
  "fısılda",
  "unut",
  "böl",
  "bırak",
  "çağır",
  "gizle",
];

export const objects = [
  "gölgeni",
  "adını",
  "bir kelimeyi",
  "eski bir izi",
  "bir hatırayı",
  "zamanı",
  "bir düşünceyi",
];

export const outcomes = [
  "sistem seni hatırlayacak",
  "alan yeni bir iz kaydedecek",
  "sessiz bir kapı açılacak",
  "bir şey geri dönmeyecek",
  "sanrı seni duyacak",
  "zihin yeni bir kapı bulacak",
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateRitual(visitorWords: string[]): RitualGeneratorResult {
  const action = pick(actions);

  let object: string;

  if (visitorWords.length > 0 && Math.random() > 0.5) {
    const word = pick(visitorWords);
    object = `"${word}" kelimesini`;
  } else {
    object = pick(objects);
  }

  const outcome = pick(outcomes);

  return {
    title: `Ritüel ${Math.floor(Math.random() * 999) + 1}`,
    text: `${action} ${object}. ${outcome}.`,
  };
}