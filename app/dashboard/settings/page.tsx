"use client"
import React, { useState } from 'react'

export default function SettingsPage() {
    const [dark, setDark] = useState(false)
    const [fontSize, setFontSize] = useState(18)

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Settings</h1>
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <label className="font-medium">Dark Mode</label>
                    <input aria-label="Toggle dark mode" type="checkbox" checked={dark} onChange={() => setDark(!dark)} />
                </div>

                <div>
                    <label className="block font-medium">Reader Font Size: {fontSize}px</label>
                    <input aria-label="Reader font size" type="range" min={12} max={28} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} />
                </div>

                <div>
                    <button className="px-4 py-2 bg-primary text-white rounded">Save settings (demo)</button>
                </div>
            </div>
        </div>
    )
}
