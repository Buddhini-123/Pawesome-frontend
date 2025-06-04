// components/FAQAccordion.jsx
import React, { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'

/**
 * A fully-accessible, animated FAQ accordion.
 * 
 * Props:
 *  - items: Array<{ question: string, answer: string }>
 *  - initialIndex: number | null         // which panel (if any) starts open
 *  - allowMultiple: boolean              // open more than one at once?
 */
export default function FAQAccordion({
  items,
  initialIndex = null,
  allowMultiple = false,
}) {
  // track one or more open indexes
  const [openIndexes, setOpenIndexes] = useState(() => {
    if (allowMultiple) return []
    return initialIndex != null ? [initialIndex] : []
  })

  const toggle = useCallback(
    (idx) => {
      setOpenIndexes((prev) => {
        if (allowMultiple) {
          return prev.includes(idx)
            ? prev.filter((i) => i !== idx)
            : [...prev, idx]
        }
        // single-open mode
        return prev[0] === idx ? [] : [idx]
      })
    },
    [allowMultiple]
  )

  return (
    <div className="bg-calm-blue rounded-2xl p-6 md:p-8">
      <h2 className="text-white text-2xl font-semibold mb-6">
        Things You want to know about
      </h2>
      <div className="divide-y divide-white divide-opacity-50">
        {items.map((faq, idx) => {
          const isOpen = openIndexes.includes(idx)
          return (
            <div key={idx}>
              <button
                onClick={() => toggle(idx)}
                aria-expanded={isOpen}
                aria-controls={`faq-panel-${idx}`}
                className="w-full flex justify-between items-center py-4 focus:outline-none"
              >
                <span className="text-white text-base md:text-lg text-left">
                  {faq.question}
                </span>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-white" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-white" />
                )}
              </button>

              {/* AnimatePresence + framer-motion for smooth collapse/expand */}
              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    key="content"
                    id={`faq-panel-${idx}`}
                    initial="collapsed"
                    animate="open"
                    exit="collapsed"
                    variants={{
                      open:      { height: 'auto', opacity: 1 },
                      collapsed: { height: 0,     opacity: 0 },
                    }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="text-white text-sm md:text-base mb-4 text-left">
                      {faq.answer}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )
        })}
      </div>
    </div>
  )
}
