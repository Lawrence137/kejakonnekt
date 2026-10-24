// Accepts 07xx, 01xx, 7xx, 254..., +254... and returns +254XXXXXXXXX or null.
export function normalizeKenyanPhone(input: string): string | null {
  const s = input.replace(/[\s\-()]/g, "");
  let national: string;

  if (/^\+254\d{9}$/.test(s)) national = s.slice(4);
  else if (/^254\d{9}$/.test(s)) national = s.slice(3);
  else if (/^0\d{9}$/.test(s)) national = s.slice(1);
  else if (/^\d{9}$/.test(s)) national = s;
  else return null;

  return /^[17]\d{8}$/.test(national) ? `+254${national}` : null;
}

export const isKenyanPhone = (v: string) => /^\+254[17]\d{8}$/.test(v);