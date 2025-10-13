/**
 * Tooltip Component
 * 
 * Muestra información adicional al hacer hover sobre un elemento
 */

"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import colors from "@/lib/colors";

interface TooltipProps {
  children: React.ReactNode;
  content: string;
  side?: "top" | "bottom" | "left" | "right";
  delay?: number;
}

export function Tooltip({ children, content, side = "top", delay = 300 }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, delay);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    setIsVisible(false);
  };

  const getPositionStyles = () => {
    switch (side) {
      case "top":
        return { bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" };
      case "bottom":
        return { top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" };
      case "left":
        return { right: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" };
      case "right":
        return { left: "calc(100% + 8px)", top: "50%", transform: "translateY(-50%)" };
    }
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}

      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: side === "top" ? 4 : -4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 px-3 py-2 text-sm font-medium rounded-lg shadow-lg whitespace-nowrap pointer-events-none"
            style={{
              backgroundColor: colors.text,
              color: colors.surface,
              ...getPositionStyles(),
            }}
          >
            {content}
            
            {/* Arrow */}
            <div
              className="absolute w-2 h-2 rotate-45"
              style={{
                backgroundColor: colors.text,
                ...(side === "top" && { bottom: "-4px", left: "50%", transform: "translateX(-50%)" }),
                ...(side === "bottom" && { top: "-4px", left: "50%", transform: "translateX(-50%)" }),
                ...(side === "left" && { right: "-4px", top: "50%", transform: "translateY(-50%)" }),
                ...(side === "right" && { left: "-4px", top: "50%", transform: "translateY(-50%)" }),
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

