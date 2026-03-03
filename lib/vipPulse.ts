// lib/vipPulse.ts
let vipJustActivated = false;

export function setVipJustActivated(v: boolean) {
  vipJustActivated = v;
}

export function consumeVipJustActivated() {
  const v = vipJustActivated;
  vipJustActivated = false;
  return v;
}