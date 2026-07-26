import QRCode from 'qrcode'

export async function generateQRCode(text, options = {}) {
  return QRCode.toBuffer(text, {
    errorCorrectionLevel: 'M',
    margin: 2,
    scale: 10,
    ...options
  })
}