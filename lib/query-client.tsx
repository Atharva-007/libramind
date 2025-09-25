import { ReactNode } from 'react'

interface QueryClientProviderProps {
    children: ReactNode
}

// Simple provider for now - can be enhanced later
export function QueryClientProvider({ children }: QueryClientProviderProps) {
    return <>{children}</>
}

export function ReactQueryDevtools() {
    return null
}