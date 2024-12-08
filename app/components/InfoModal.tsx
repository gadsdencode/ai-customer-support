// /app/components/InfoModal.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface InfoModalProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  footer?: React.ReactNode
  isLoading?: boolean
  className?: string
}

const InfoModal: React.FC<InfoModalProps> = ({
  isOpen,
  onClose,
  children,
  title,
  footer,
  isLoading = false,
  className,
}) => {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          <motion.div
            className="fixed inset-0 bg-black/30 backdrop-blur-[5px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onClick={onClose}
          />
          <motion.div
            className={cn(
              "relative z-50 w-full max-w-lg bg-sidebar dark:bg-sidebar-dark rounded-lg shadow-xl",
              className
            )}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {title && (
              <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                <h2 className="text-xl font-semibold text-white">{title}</h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Close</span>
                </Button>
              </div>
            )}
            <div className="p-6">
              {isLoading ? (
                <div className="flex justify-center items-center h-32">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
                </div>
              ) : (
                children
              )}
            </div>
            {footer && (
              <div className="flex justify-end p-4 border-t border-gray-200 dark:border-gray-700">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default InfoModal

