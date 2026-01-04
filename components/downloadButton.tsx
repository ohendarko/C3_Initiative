"use client"

import React from "react"
import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"

type DownloadButtonProps = {
  fileUrl: string
  fileName?: string
  label?: string
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  fileUrl,
  fileName,
  label = "Download",
}) => {
  const handleDownload = () => {
    const link = document.createElement("a")
    link.href = fileUrl
    link.download = fileName || ""
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Button onClick={handleDownload} className="flex items-center gap-2">
      <Download className="w-4 h-4" />
      {label}
    </Button>
  )
}

export default DownloadButton
