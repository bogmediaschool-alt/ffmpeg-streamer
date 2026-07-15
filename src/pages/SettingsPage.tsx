import { ExternalLink, KeyRound, Link2, RotateCcw, SlidersHorizontal } from "lucide-react";
import { GlassPanel } from "../components/GlassPanel";
import { useApp } from "../store/AppContext";
import type { Language, MapProvider, MusicService, TemperatureUnit, WeatherProvider } from "../types";

const musicServices: MusicService[] = ["YouTube Music", "Apple Music", "Spotify"];

const serviceLinks: Record<MusicService, string> = {
  "YouTube Music": "https://music.youtube.com/",
  "Apple Music": "https://music.apple.com/",
  Spotify: "https://open.spotify.com/",
};

export function SettingsPage() {
  const { settings, updateSettings, resetData, speed, setSpeed } = useApp();

  const toggleMusicConnection = (service: MusicService) => {
    updateSettings({
      musicConnections: {
        ...settings.musicConnections,
        [service]: !settings.musicConnections[service],
      },
    });
  };

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
        <SettingBlock title="Car photo">
          <div className="space-y-3">
            <p className="text-sm text-white/55">
              Custom car photo is stored only in this browser.
            </p>
            <button
              type="button"
              disabled={!settings.carPhoto}
              onClick={() => updateSettings({ carPhoto: "" })}
              className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-black/24 px-5 font-semibold outline-none transition hover:bg-white/10 disabled:opacity-45 focus-visible:ring-2 focus-visible:ring-electric-300"
            >
              <RotateCcw size={22} />
              Reset car photo
            </button>
          </div>
        </SettingBlock>
        <SettingBlock title="Maps">
          <div className="space-y-4">
            <Segmented
              value={settings.mapProvider}
              options={[
                ["openstreetmap", "OpenStreetMap"],
                ["google", "Google Maps"],
              ]}
              onChange={(value) => updateSettings({ mapProvider: value as MapProvider })}
            />
            <TextInput
              icon={<KeyRound size={22} />}
              value={settings.googleMapsApiKey}
              placeholder="Google Maps API key"
              onChange={(googleMapsApiKey) => updateSettings({ googleMapsApiKey })}
            />
          </div>
        </SettingBlock>
        <SettingBlock title="Weather">
          <div className="space-y-4">
            <Segmented
              value={settings.weatherProvider}
              options={[
                ["mock", "Mock"],
                ["apple", "Apple WeatherKit"],
              ]}
              onChange={(value) => updateSettings({ weatherProvider: value as WeatherProvider })}
            />
            <TextInput
              icon={<KeyRound size={22} />}
              value={settings.appleWeatherToken}
              placeholder="WeatherKit JWT token"
              onChange={(appleWeatherToken) => updateSettings({ appleWeatherToken })}
            />
            <p className="text-sm text-white/50">
              Apple Weather requires an official WeatherKit token from your Apple Developer account.
            </p>
          </div>
        </SettingBlock>
        <SettingBlock title="Music accounts">
          <div className="space-y-3">
            {musicServices.map((service) => (
              <div key={service} className="flex min-h-14 items-center gap-3 rounded-2xl bg-black/24 px-3">
                <button
                  type="button"
                  onClick={() => toggleMusicConnection(service)}
                  className="min-h-11 flex-1 rounded-xl px-3 text-left font-semibold outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-electric-300"
                >
                  {service}
                  <span className="ml-3 text-sm text-white/50">
                    {settings.musicConnections[service] ? "Connected" : "Not connected"}
                  </span>
                </button>
                <a
                  href={serviceLinks[service]}
                  target="_blank"
                  rel="noreferrer"
                  className="grid min-h-11 min-w-11 place-items-center rounded-full text-white/80 outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-electric-300"
                  aria-label={`Open ${service}`}
                >
                  <ExternalLink size={21} />
                </a>
              </div>
            ))}
          </div>
        </SettingBlock>
        <SettingBlock title="Reset data">
          <button
            type="button"
            onClick={resetData}
            className="flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl bg-red-500/18 px-5 font-semibold text-red-100 outline-none ring-1 ring-red-400/35 transition hover:bg-red-500/28 focus-visible:ring-2 focus-visible:ring-red-200"
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

function TextInput({
  value,
  placeholder,
  onChange,
  icon,
}: {
  value: string;
  placeholder: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <label className="flex min-h-14 items-center gap-3 rounded-2xl bg-black/24 px-4 focus-within:ring-2 focus-within:ring-electric-300">
      {icon ?? <Link2 size={22} />}
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="min-w-0 flex-1 bg-transparent text-lg outline-none placeholder:text-white/35"
      />
    </label>
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
