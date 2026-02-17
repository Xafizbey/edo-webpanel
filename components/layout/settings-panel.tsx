'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

type ThemeMode = 'light' | 'dark' | 'system';

interface SettingsState {
  theme: ThemeMode;
  compactRows: boolean;
  animations: boolean;
}

const KEY = 'edo_admin_settings';

export function SettingsPanel() {
  const [settings, setSettings] = useState<SettingsState>({
    theme: 'system',
    compactRows: false,
    animations: true
  });

  useEffect(() => {
    const stored = localStorage.getItem(KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as SettingsState;
      setSettings(parsed);
      applyTheme(parsed.theme);
    } else {
      applyTheme('system');
    }
  }, []);

  const update = (next: SettingsState) => {
    setSettings(next);
    localStorage.setItem(KEY, JSON.stringify(next));
    applyTheme(next.theme);
    document.documentElement.classList.toggle('compact-rows', next.compactRows);
  };

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Тема</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <select
            value={settings.theme}
            onChange={(e) => update({ ...settings, theme: e.target.value as ThemeMode })}
            className="h-10 w-full rounded-md border border-input bg-background px-3"
          >
            <option value="light">Светлая</option>
            <option value="dark">Тёмная</option>
            <option value="system">Системная</option>
          </select>
          <div className="text-sm text-muted-foreground">Применяется сразу для всей админ-панели.</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Интерфейс</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <label className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
            Компактные таблицы
            <input
              type="checkbox"
              checked={settings.compactRows}
              onChange={(e) => update({ ...settings, compactRows: e.target.checked })}
            />
          </label>
          <label className="flex items-center justify-between rounded-md border border-border px-3 py-2 text-sm">
            Анимации
            <input
              type="checkbox"
              checked={settings.animations}
              onChange={(e) => update({ ...settings, animations: e.target.checked })}
            />
          </label>
          <Button
            variant="outline"
            onClick={() => {
              const defaults: SettingsState = { theme: 'system', compactRows: false, animations: true };
              update(defaults);
              toast.success('Настройки сброшены');
            }}
          >
            Сбросить по умолчанию
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

function applyTheme(theme: ThemeMode) {
  const isDark =
    theme === 'dark' ||
    (theme === 'system' && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);

  document.documentElement.classList.toggle('dark', isDark);
}
