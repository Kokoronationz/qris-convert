/**
 * Parse string QRIS (format TLV: Tag-Length-Value) jadi object flat { tag: value }.
 * Cukup untuk baca tag top-level seperti nama merchant (59), kota (60), jumlah (54), dll.
 * @param {string} qris
 * @returns {Record<string, string>}
 */
export function parseQris(qris) {
  const tags = {};
  let i = 0;
  while (i + 4 <= qris.length) {
    const tag = qris.slice(i, i + 2);
    const len = parseInt(qris.slice(i + 2, i + 4), 10);
    if (Number.isNaN(len)) break;
    const value = qris.slice(i + 4, i + 4 + len);
    tags[tag] = value;
    i += 4 + len;
  }
  return tags;
}

/** Ambil nama merchant (tag 59) dari QRIS statis maupun dinamis. */
export function getMerchantName(qris) {
  return parseQris(qris)['59'] || null;
}

/** Ambil kota merchant (tag 60) dari QRIS statis maupun dinamis. */
export function getMerchantCity(qris) {
  return parseQris(qris)['60'] || null;
}

/** Ambil nominal transaksi (tag 54) kalau QRIS-nya sudah dinamis. */
export function getAmount(qris) {
  return parseQris(qris)['54'] || null;
}
