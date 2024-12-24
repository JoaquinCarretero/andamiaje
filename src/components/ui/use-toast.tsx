// src/components/ui/use-toast.ts
import { useState } from "react";

export const useToast = () => {
  const [message, setMessage] = useState<string | null>(null);

  const toast = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(null), 3000);
  };

  return { toast, message };
};
