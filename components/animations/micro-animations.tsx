'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

interface LoadingSpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    color?: 'primary' | 'secondary' | 'accent'
}

export function LoadingSpinner({ size = 'md', color = 'primary' }: LoadingSpinnerProps) {
    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-8 h-8',
        lg: 'w-12 h-12'
    }

    const colorClasses = {
        primary: 'border-primary',
        secondary: 'border-secondary',
        accent: 'border-accent'
    }

    return (
        <motion.div
            className={`${sizeClasses[size]} border-2 ${colorClasses[color]} border-t-transparent rounded-full`}
            animate={{ rotate: 360 }}
            transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear'
            }}
        />
    )
}

export function PulseAnimation({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    return (
        <motion.div
            animate={{
                scale: [1, 1.05, 1],
                opacity: [0.7, 1, 0.7]
            }}
            transition={{
                duration: 2,
                repeat: Infinity,
                ease: 'easeInOut'
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export function TypewriterEffect({ text, delay = 0, speed = 50 }: { text: string, delay?: number, speed?: number }) {
    const [displayText, setDisplayText] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => {
            if (currentIndex < text.length) {
                setDisplayText(prev => prev + text[currentIndex])
                setCurrentIndex(prev => prev + 1)
            }
        }, currentIndex === 0 ? delay : speed)

        return () => clearTimeout(timer)
    }, [currentIndex, text, delay, speed])

    return (
        <span className="relative">
            {displayText}
            {currentIndex < text.length && (
                <motion.span
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                    className="ml-1"
                >
                    |
                </motion.span>
            )}
        </span>
    )
}

export function FloatingAnimation({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    return (
        <motion.div
            animate={{
                y: [-10, 10, -10],
            }}
            transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut'
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export function ShineEffect({ children, className = '' }: { children: React.ReactNode, className?: string }) {
    return (
        <motion.div
            className={`relative overflow-hidden ${className}`}
            whileHover="hover"
        >
            {children}
            <motion.div
                className="absolute inset-0 -top-full bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12"
                variants={{
                    hover: {
                        top: '100%',
                        transition: {
                            duration: 0.6,
                            ease: 'easeOut'
                        }
                    }
                }}
            />
        </motion.div>
    )
}