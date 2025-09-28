'use client'

import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Globe, Check } from "lucide-react"
import { motion } from "framer-motion"

interface Language {
    code: string
    name: string
    nativeName: string
    flag: string
}

const languages: Language[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
    { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷' },
    { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano', flag: '🇮🇹' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇵🇹' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' },
    { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵' },
    { code: 'ko', name: 'Korean', nativeName: '한국어', flag: '🇰🇷' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
    { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
]

export default function LanguageSwitcher() {
    const { i18n } = useTranslation()
    const [isOpen, setIsOpen] = useState(false)

    const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0]

    const changeLanguage = (languageCode: string) => {
        i18n.changeLanguage(languageCode)
        setIsOpen(false)
    }

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2">
                    <Globe className="w-4 h-4" />
                    <span className="text-lg">{currentLanguage.flag}</span>
                    <span className="hidden sm:inline">{currentLanguage.nativeName}</span>
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                {languages.map((language) => (
                    <DropdownMenuItem
                        key={language.code}
                        onClick={() => changeLanguage(language.code)}
                        className="flex items-center justify-between cursor-pointer"
                    >
                        <motion.div
                            whileHover={{ scale: 1.02 }}
                            className="flex items-center gap-3"
                        >
                            <span className="text-lg">{language.flag}</span>
                            <div>
                                <div className="font-medium">{language.nativeName}</div>
                                <div className="text-xs text-gray-500">{language.name}</div>
                            </div>
                        </motion.div>

                        {i18n.language === language.code && (
                            <Check className="w-4 h-4 text-green-600" />
                        )}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export { LanguageSwitcher }