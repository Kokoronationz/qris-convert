import { Jimp } from 'jimp'
import jsQR from 'jsqr'

export async function readQris(input) {
  const image = Buffer.isBuffer(input)
    ? await Jimp.read(input)
    : await Jimp.read(input)

  const { data, width, height } = image.bitmap

  const qr = jsQR(
    new Uint8ClampedArray(data),
    width,
    height
  )

  if (!qr)
    throw new Error('QR Code tidak ditemukan')

  return qr.data
}