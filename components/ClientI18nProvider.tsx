'use client'

import { useEffect } from 'react'
import '@/lib/i18n'

export default function ClientI18nProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Initialize i18n on client side
        import('@/lib/i18n')
    }, [])

    return <>{children}</>
}