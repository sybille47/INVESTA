// src/utils/maskUtils.js
export function maskIBAN(iban) {
  if (!iban) return '';
  const clean = iban.replace(/\s+/g, '');
  if (clean.length <= 8) return clean; // too short to mask

  const masked = clean
    .split('')
    .map((ch, i) => (i < 4 || i >= clean.length - 4 ? ch : '*'))
    .join('');

  return masked.match(/.{1,4}/g).join(' ');
}
