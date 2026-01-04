// components/CertificateQRCode.tsx
import { QRCodeCanvas } from "qrcode.react"


export default function CertificateQRCode() {
  const domainUrl = process.env.APP_URL
  const verificationUrl = `https://c3initiative.vercel.app/verify`

  return (
    <div className="mt-4 flex flex-col justify-center items-center">
      <QRCodeCanvas value={verificationUrl} size={64} />
      <p className="text-xs mt-2 text-white bg-blue-800 p-1">Scan to verify</p>
    </div>
  )
}
