import { crc16ccitt } from './crc16.js';

function toTLV(tag, value) {
  const length = String(value.length).padStart(2, '0');
  return `${tag}${length}${value}`;
}

/**
 * Ubah QRIS statis jadi QRIS dinamis dengan nominal custom, lalu hitung ulang CRC16.
 * @param {string} qrisStatis - string QRIS asli (statis)
 * @param {number|string} nominal - jumlah transaksi
 * @param {object} [options]
 * @param {number} [options.feeFixed] - biaya tambahan nominal tetap (opsional)
 * @param {number} [options.feePercent] - biaya tambahan persen (opsional)
 * @returns {{ qris: string, nominal: string, fee: integer, total: integer }}
 */
export function convertQris(qrisStatis, nominal, options = {}) {
  if (!qrisStatis || typeof qrisStatis !== 'string') {
    throw new Error('QRIS statis tidak valid');
  }

  const amount = String(nominal).trim();
  if (!/^\d+$/.test(amount)) {
    throw new Error('Nominal harus berupa angka bulat');
  }

  // Hitung fee
  let fee = 0;

  if (options.feeFixed) {
    fee = Number(options.feeFixed);
  } else if (options.feePercent) {
    fee = Math.round(Number(amount) * Number(options.feePercent) / 100);
  }

  const total = Number(amount) + fee;

  let payload = qrisStatis.trim();

  // buang tag CRC lama di akhir string: tag "63", length "04", value 4 karakter
  if (payload.slice(-8, -4) === '6304') {
    payload = payload.slice(0, -8);
  } else {
    payload = payload.slice(0, -4);
  }

  // tag 01 = Point of Initiation Method: "11" (statis) -> "12" (dinamis)
  payload = payload.replace('010211', '010212');

  // tag 54 (jumlah transaksi) harus disisipkan tepat sebelum tag 58 (kode negara "5802ID")
  const anchor = '5802ID';
  const idx = payload.indexOf(anchor);
  if (idx === -1) {
    throw new Error('Format QRIS tidak dikenali (tag negara 5802ID tidak ditemukan)');
  }

  let insert = toTLV('54', amount);
  if (options.feeFixed) {
    insert += toTLV('55', '02') + toTLV('56', String(options.feeFixed));
  } else if (options.feePercent) {
    insert += toTLV('55', '03') + toTLV('57', String(options.feePercent));
  }

  const newPayload = payload.slice(0, idx) + insert + payload.slice(idx);
  const withCrcTag = `${newPayload}6304`;
  const crc = crc16ccitt(withCrcTag);

  return {
    qris: withCrcTag + crc,
    nominal: amount,
    fee,
    total
  };
}
