// components/QuestionnaireDialog.tsx
"use client"

import * as AlertDialog from "@radix-ui/react-alert-dialog"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function QuestionnaireDialog({ shouldShow }: { shouldShow: boolean }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (shouldShow) {
      setOpen(true)
    }
  }, [shouldShow])

  return (
    <AlertDialog.Root open={open} onOpenChange={setOpen}>
      <AlertDialog.Portal>
        <AlertDialog.Overlay className="bg-black/50 fixed inset-0 z-40" />
        <AlertDialog.Content className="fixed top-1/2 left-1/2 z-50 -translate-x-1/2 -translate-y-1/2 bg-white p-6 rounded-xl shadow-xl max-w-md w-full space-y-4">
          <AlertDialog.Title className="text-lg font-semibold">
            Questionnaire Not Completed
          </AlertDialog.Title>
          <AlertDialog.Description className=" flex flex-col text-sm text-muted-foreground">
            You need to complete the onboarding questionnaire before continuing.
            <span className="text-xs">You may need to refresh if you believe this to be an error.</span>
          </AlertDialog.Description>
          <div className="flex justify-end gap-3 pt-4">
            <AlertDialog.Action
              onClick={() => window.location.reload()} className="px-4 py-2 text-sm border rounded-md">
              Refresh
            </AlertDialog.Action>
            <AlertDialog.Action
              className="px-4 py-2 text-sm gradient-orange-blue text-white rounded-md hover:opacity-95"
              onClick={() => {
                window.location.href = "/questionnaire"
              }}
            >
              Go to Questionnaire
            </AlertDialog.Action>
          </div>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  )
}
