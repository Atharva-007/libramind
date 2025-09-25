"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Settings, Type, Moon, Sun } from "lucide-react"

export interface ReadingSettings {
  fontSize: number
  fontFamily: "serif" | "sans" | "mono"
  lineHeight: number
  theme: "light" | "dark"
}

interface ReadingControlsProps {
  settings: ReadingSettings
  onSettingsChange: (settings: ReadingSettings) => void
}

export function ReadingControls({ settings, onSettingsChange }: ReadingControlsProps) {
  const updateSetting = <Key extends keyof ReadingSettings>(key: Key, value: ReadingSettings[Key]) => {
    onSettingsChange({ ...settings, [key]: value })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="sm">
          <Settings className="w-4 h-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <Card className="border-0 shadow-none">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Type className="w-4 h-4" />
              Reading Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Font Size */}
            <div>
              <label className="text-sm font-medium mb-2 block">Font Size</label>
              <Slider
                value={[settings.fontSize]}
                onValueChange={([value]) => updateSetting("fontSize", value)}
                min={12}
                max={24}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>12px</span>
                <span>{settings.fontSize}px</span>
                <span>24px</span>
              </div>
            </div>

            {/* Font Family */}
            <div>
              <label className="text-sm font-medium mb-2 block">Font Family</label>
              <Select
                value={settings.fontFamily}
                onValueChange={(value: ReadingSettings["fontFamily"]) => updateSetting("fontFamily", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="serif">Serif</SelectItem>
                  <SelectItem value="sans">Sans Serif</SelectItem>
                  <SelectItem value="mono">Monospace</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Line Height */}
            <div>
              <label className="text-sm font-medium mb-2 block">Line Height</label>
              <Slider
                value={[settings.lineHeight]}
                onValueChange={([value]) => updateSetting("lineHeight", value)}
                min={1.2}
                max={2.0}
                step={0.1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>1.2</span>
                <span>{settings.lineHeight}</span>
                <span>2.0</span>
              </div>
            </div>

            {/* Theme */}
            <div>
              <label className="text-sm font-medium mb-2 block">Theme</label>
              <div className="flex gap-2">
                <Button
                  variant={settings.theme === "light" ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting("theme", "light")}
                  className="flex-1"
                >
                  <Sun className="w-4 h-4 mr-2" />
                  Light
                </Button>
                <Button
                  variant={settings.theme === "dark" ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting("theme", "dark")}
                  className="flex-1"
                >
                  <Moon className="w-4 h-4 mr-2" />
                  Dark
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </PopoverContent>
    </Popover>
  )
}
