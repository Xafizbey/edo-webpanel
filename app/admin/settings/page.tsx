import { SettingsPanel } from '@/components/layout/settings-panel';

export default function SettingsPage() {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold">Настройки</h2>
      <p className="text-sm text-muted-foreground">Тема и поведение интерфейса админ-панели.</p>
      <SettingsPanel />
    </div>
  );
}
