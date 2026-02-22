import { Check, X } from "lucide-react";
import { cn } from "@/utils/utils";

export function BooleanLabel({ check }: { check: boolean }) {
  return (
    <span
      className={cn("inline-flex items-center justify-center w-6 h-6 rounded-full text-sm font-bold",
        check ?
          "bg-emerald-600/20 text-emerald-600" :
          "bg-destructive/20 text-destructive"
      )}
      title={check ? "Sim" : "Não"}
    >
      {check ?
        <Check className="h-4 w-4" /> :
        <X className="h-4 w-4" />
      }
    </span>
  )
}