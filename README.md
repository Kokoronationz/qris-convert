# qris-convert

Ubah QRIS statis jadi QRIS dinamis (nominal custom) tanpa perlu jalanin server API terpisah.
Dependency-free, murni ESM — tinggal `import` langsung di bot.

## Pasang di project bot

Taruh folder `qris-convert` ini di sebelah project bot kamu, misalnya:

```
mirai-bot/
qris-convert/
```

Lalu di `package.json` bot, tambahkan:

```json
"dependencies": {
  "qris-convert": "file:../qris-convert"
}
```

Jalankan `npm install` di folder bot. Kalau nanti isi `qris-convert` diubah, cukup `npm install` ulang
(atau `npm install --force`) supaya symlink/copy-nya ke-refresh.

## Pemakaian

```js
import { convertQris, getMerchantName } from 'qris-convert';

const qrisStatis = '...'; // string QRIS statis dari MustikaPay / provider lain

const { qris, nominal } = convertQris(qrisStatis, 15000);
// qris   -> string QRIS dinamis siap digenerate jadi QR image
// nominal -> '15000'

console.log(getMerchantName(qrisStatis)); // nama merchant dari tag 59
```

Dengan biaya tambahan (opsional, dipakai kalau markup dihitung di sisi QRIS bukan di harga produk):

```js
convertQris(qrisStatis, 15000, { feeFixed: 1000 });  // tambahan nominal tetap
convertQris(qrisStatis, 15000, { feePercent: 2 });   // tambahan persen
```

Hasil `qris` tinggal dilempar ke library QR image yang sudah dipakai di bot (canvas/qrcode),
sama seperti string QRIS dinamis dari API biasa — bedanya nggak perlu network call.

## API

| Fungsi | Return | Keterangan |
|---|---|---|
| `convertQris(qrisStatis, nominal, options?)` | `{ qris, nominal }` | konversi inti |
| `parseQris(qris)` | `Record<string,string>` | semua tag TLV mentah |
| `getMerchantName(qris)` | `string \| null` | tag 59 |
| `getMerchantCity(qris)` | `string \| null` | tag 60 |
| `getAmount(qris)` | `string \| null` | tag 54 (kalau QRIS-nya sudah dinamis) |
| `crc16ccitt(str)` | `string` | hitung CRC16-CCITT manual kalau perlu |
| `readQR(buffer)` | `string \| null` | decode QR |
| `createQR(string)` | `buffer` | create QR Code|

`options` pada `convertQris`:
- `feeFixed` — nominal tambahan tetap (tag 55/56)
- `feePercent` — tambahan dalam persen (tag 55/57)

# Credits

Library ini dibuat dan dikembangkan oleh **Kokoronationz**.

Implementasi konversi QRIS pada library ini **terinspirasi dari proyek qris-api** milik **idlanyor**. Terima kasih atas ide dan referensi implementasinya.

- Inspirasi: https://github.com/idlanyor/qris-api
- Pengembang library ini: Kokoronationz
