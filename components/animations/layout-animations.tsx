'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface AnimatedLayoutProps {
    children: ReactNode
    className?: string
}

export function AnimatedLayout({ children, className = '' }: AnimatedLayoutProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
                duration: 0.5,
                ease: [0.4, 0.0, 0.2, 1]
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export function FadeInAnimation({ children, delay = 0, className = '' }: AnimatedLayoutProps & { delay?: number }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.4, 0.0, 0.2, 1]
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export function SlideInAnimation({ children, direction = 'left', className = '' }: AnimatedLayoutProps & { direction?: 'left' | 'right' | 'up' | 'down' }) {
    const getInitialPosition = () => {
        switch (direction) {
            case 'left': return { x: -50, y: 0 }
            case 'right': return { x: 50, y: 0 }
            case 'up': return { x: 0, y: -50 }
            case 'down': return { x: 0, y: 50 }
            default: return { x: -50, y: 0 }
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, ...getInitialPosition() }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            transition={{
                duration: 0.5,
                ease: [0.4, 0.0, 0.2, 1]
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export function ScaleAnimation({ children, className = '' }: AnimatedLayoutProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{
                duration: 0.3,
                ease: [0.4, 0.0, 0.2, 1]
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export function StaggerAnimation({ children, className = '' }: AnimatedLayoutProps) {
    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={{
                hidden: { opacity: 0 },
                visible: {
                    opacity: 1,
                    transition: {
                        staggerChildren: 0.1
                    }
                }
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}

export function StaggerItem({ children, className = '' }: AnimatedLayoutProps) {
    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
            }}
            className={className}
        >
            {children}
        </motion.div>
    )
}