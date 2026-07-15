import { Bell, RotateCcw, SlidersHorizontal } from "lucide-react";
import { GlassPanel } from "../components/GlassPanel";
import { useApp } from "../store/AppContext";
import type { Language, TemperatureUnit } from "../types";

export function SettingsPage() {
  const { settings, updateSettings, resetData, speed, setSpeed } = useApp();

  return (
    <GlassPanel className="h-full overflow-auto rounded-[2rem] p-8 text-white">
      <div className="flex items-center gap-4">
        <SlidersHorizontal className="text-electric-400" size={38} />
        <h1 className="text-4xl font-bold">Settings</h1>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-5">
        <SettingBlock title="Language">
          <Segmented
            value={settings.language}
            options={[
              ["en", "English"],
              ["uk", "Українська"],
              ["de", "Deutsch"],
            ]}
            onChange={(value) => updateSettings({ language: value as Language })}
          />
        </SettingBlock>
        <SettingBlock title="Temperature">
          <Segmented
            value={settings.temperatureUnit}
            options={[
              ["c", "°C"],
              ["f", "°F"],
            ]}
            onChange={(value) => updateSettings({ temperatureUnit: value as TemperatureUnit })}
          />
        </SettingBlock>
        <SettingBlock title="Theme">
          <Toggle label="Dark theme" checked={settings.darkTheme} onChange={(darkTheme) => updateSettings({ darkTheme })} />
        </SettingBlock>
        <SettingBlock title="Button sounds">
          <Toggle label="Sound feedback" checked={settings.buttonSounds} onChange={(buttonSounds) => updateSettings({ buttonSounds })} />
        </SettingBlock>
        <SettingBlock title="Brightness">
          <Slider value={settings.brightness} min={40} max={120} onChange={(brightness) => updateSettings({ brightness })} />
        </SettingBlock>
        <SettingBlock title="Demo speed">
          <Slider value={speed} min={0} max={240} onChange={setSpeed} suffix="km/h" />
        </SettingBlock>
        <SettingBlock title="AirPods notification">
          <Toggle
            label="Connection popup"
            checked={settings.airPodsNotification}
            onChange={(airPodsNotification) => updateSettings({ airPodsNotification })}
            icon={<Bell size={24} />}
          />
        </SettingBlock>
        <SettingBlock title="Reset data">
          <button
            type="button"
            onClick={resetData}
            className="flex min-h-14 items-center justify-center gap-3 rounded-2xl bg-red-500/18 px-5 font-semibold text-red-100 outline-none ring-1 ring-red-400/35 transition hover:bg-red-500/28 focus-visible:ring-2 focus-visible:ring-red-200"
          >
            <RotateCcw size={22} />
            Reset data
          </button>
        </SettingBlock>
      </div>
    </GlassPanel>
  );
}

function SettingBlock({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[1.5rem] border border-white/10 bg-white/6 p-5">
      <h2 className="mb-4 text-xl font-semibold text-white/65">{title}</h2>
      {children}
    </section>
  );
}

function Segmented({
  value,
  options,
  onChange,
}: {
  value: string;
  options: Array<[string, string]>;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex rounded-2xl bg-black/24 p-1">
      {options.map(([id, label]) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={[
            "min-h-12 flex-1 rounded-xl px-3 font-semibold outline-none transition focus-visible:ring-2 focus-visible:ring-electric-300",
            value === id ? "bg-electric-500 text-white" : "text-white/70 hover:bg-white/10",
          ].join(" ")}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function Toggle({
  label,
  checked,
  onChange,
  icon,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className="flex min-h-14 w-full items-center justify-between rounded-2xl bg-black/24 px-4 outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-electric-300"
    >
      <span className="flex items-center gap-3 text-lg font-semibold">
        {icon}
        {label}
      </span>
      <span className={["relative h-8 w-14 rounded-full transition", checked ? "bg-electric-500" : "bg-white/20"].join(" ")}>
        <span className={["absolute top-1 h-6 w-6 rounded-full bg-white transition", checked ? "left-7" : "left-1"].join(" ")} />
      </span>
    </button>
  );
}

function Slider({
  value,
  min,
  max,
  onChange,
  suffix = "%",
}: {
  value: number;
  min: number;
  max: number;
  onChange: (value: number) => void;
  suffix?: string;
}) {
  return (
    <div>
      <div className="mb-3 text-2xl font-semibold">
        {value} {suffix}
      </div>
      <input
        value={value}
        min={min}
        max={max}
        onChange={(event) => onChange(Number(event.target.value))}
        type="range"
        className="h-2 w-full accent-electric-500"
      />
    </div>
  );
}
