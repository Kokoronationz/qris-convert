/**
 * Hitung CRC16-CCITT (False) — algoritma checksum yang dipakai standar QRIS.
 * @param {string} str - payload yang mau dihitung checksum-nya
 * @returns {string} 4 karakter hex uppercase (contoh: "63A1")
 */
export function crc16ccitt(str) {
  let crc = 0xffff;
  for (let c = 0; c < str.length; c++) {
    crc ^= str.charCodeAt(c) << 8;
    for (let i = 0; i < 8; i++) {
      crc = (crc & 0x8000) ? ((crc << 1) ^ 0x1021) : (crc << 1);
      crc &= 0xffff;
    }
  }
  return crc.toString(16).toUpperCase().padStart(4, '0');
}
