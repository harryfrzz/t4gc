"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Bell, Lock, Moon, Globe, Shield, Eye, Languages } from "lucide-react";
import { useTheme } from "@/lib/theme-context";
import { useLanguage } from "@/lib/language-context";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SettingsPage() {
  const { t } = useTranslation();
  const { theme, actualTheme, toggleTheme } = useTheme();
  const { language, changeLanguage, languages } = useLanguage();
  
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    tournamentUpdates: true,
    language: "English",
    darkMode: false,
    twoFactor: false,
    publicProfile: true,
  });

  const handleThemeToggle = () => {
    toggleTheme();
    const newTheme = actualTheme === "light" ? "dark" : "light";
    toast.success(
      newTheme === "dark" ? "Dark mode enabled 🌙" : "Light mode enabled ☀️",
      { description: "Theme changed successfully" }
    );
  };

  const handleSave = () => {
    // Simulate saving with a small delay
    toast.promise(
      new Promise((resolve) => setTimeout(resolve, 1000)),
      {
        loading: t('settings.saving'),
        success: t('settings.saved'),
        error: t('settings.error'),
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{t('settings.title')}</h1>
        <p className="text-neutral-600 dark:text-neutral-400 mt-1">{t('settings.description')}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            <div>
              <CardTitle>{t('settings.notifications.title')}</CardTitle>
              <CardDescription>{t('settings.notifications.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.notifications.email')}</Label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('settings.notifications.emailDesc')}</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.emailNotifications ? 'bg-blue-600' : 'bg-neutral-200 dark:bg-neutral-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.emailNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.notifications.push')}</Label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('settings.notifications.pushDesc')}</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, pushNotifications: !settings.pushNotifications })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.pushNotifications ? 'bg-blue-600' : 'bg-neutral-200 dark:bg-neutral-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.notifications.tournament')}</Label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('settings.notifications.tournamentDesc')}</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, tournamentUpdates: !settings.tournamentUpdates })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.tournamentUpdates ? 'bg-blue-600' : 'bg-neutral-200 dark:bg-neutral-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.tournamentUpdates ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Moon className="h-5 w-5" />
            <div>
              <CardTitle>{t('settings.appearance.title')}</CardTitle>
              <CardDescription>{t('settings.appearance.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.appearance.darkMode')}</Label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('settings.appearance.darkModeDesc')}</p>
            </div>
            <button
              onClick={handleThemeToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                actualTheme === 'dark' ? 'bg-blue-600' : 'bg-neutral-200 dark:bg-neutral-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  actualTheme === 'dark' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Languages className="h-4 w-4" />
                {t('settings.appearance.language')}
              </Label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('settings.appearance.languageDesc')}</p>
            </div>
            <Select value={language} onValueChange={changeLanguage}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={t('settings.appearance.selectLanguage')} />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.nativeName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <div>
              <CardTitle>{t('settings.security.title')}</CardTitle>
              <CardDescription>{t('settings.security.description')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Lock className="h-4 w-4" />
                {t('settings.security.twoFactor')}
              </Label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('settings.security.twoFactorDesc')}</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, twoFactor: !settings.twoFactor })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.twoFactor ? 'bg-blue-600' : 'bg-neutral-200 dark:bg-neutral-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.twoFactor ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                {t('settings.security.publicProfile')}
              </Label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('settings.security.publicProfileDesc')}</p>
            </div>
            <button
              onClick={() => setSettings({ ...settings, publicProfile: !settings.publicProfile })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                settings.publicProfile ? 'bg-blue-600' : 'bg-neutral-200 dark:bg-neutral-700'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  settings.publicProfile ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="pt-4 border-t">
            <Button variant="outline" className="w-full">
              {t('settings.security.changePassword')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-red-200">
        <CardHeader>
          <CardTitle className="text-red-600">{t('settings.danger.title')}</CardTitle>
          <CardDescription>{t('settings.danger.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>{t('settings.danger.deleteAccount')}</Label>
              <p className="text-sm text-neutral-500 dark:text-neutral-400">{t('settings.danger.deleteAccountDesc')}</p>
            </div>
            <Button variant="destructive" size="sm">
              {t('settings.danger.deleteButton')}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-3">
        <Button variant="outline">{t('settings.cancel')}</Button>
        <Button onClick={handleSave}>{t('settings.save')}</Button>
      </div>
    </div>
  );
}