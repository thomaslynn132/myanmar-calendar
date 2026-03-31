"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { motion, AnimatePresence } from "framer-motion"

import { cn } from "@/lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = React.forwardRef<React.ElementRef<typeof TooltipPrimitive.Content>, React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>>(
  ({ className, sideOffset = 4, ...props }, ref) => (
    <TooltipPrimitive.Content
      ref={ref}
      sideOffset={sideOffset}
      className={cn(
        "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md",
        className
      )}
      {...props}
    />
  )
)
TooltipContent.displayName = TooltipPrimitive.Content.displayName

interface TooltipWrapperProps {
  children: React.ReactNode;
  content: React.ReactNode;
  delayDuration?: number;
  sideOffset?: number;
}

function TooltipWrapper({ children, content, delayDuration = 300, sideOffset = 4 }: TooltipWrapperProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [isMobile, setIsMobile] = React.useState(false)

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(pointer: coarse)").matches)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isMobile) {
      e.preventDefault()
      setIsOpen(true)
    }
  }

  return (
    <TooltipPrimitive.Root open={isOpen} onOpenChange={setIsOpen} delayDuration={delayDuration}>
      <TooltipTrigger
        asChild
        onPointerDown={handlePointerDown}
      >
        {children}
      </TooltipTrigger>
      <AnimatePresence>
        {isOpen && (
          <TooltipPrimitive.Portal forceMount>
            <TooltipPrimitive.Content
              asChild
              sideOffset={sideOffset}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 4 }}
                transition={{ duration: 0.15 }}
                className="z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md"
              >
                {content}
              </motion.div>
            </TooltipPrimitive.Content>
          </TooltipPrimitive.Portal>
        )}
      </AnimatePresence>
    </TooltipPrimitive.Root>
  )
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider, TooltipWrapper }
