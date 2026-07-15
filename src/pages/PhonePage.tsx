import { Delete, Download, Mic, Phone, PhoneOff, Plus, Search, Speaker, UserRound } from "lucide-react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { GlassPanel } from "../components/GlassPanel";
import { Modal } from "../components/Modal";
import { useApp } from "../store/AppContext";
import type { Contact } from "../types";

type PhoneTab = "contacts" | "keypad";

const keypad = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "*", "0", "#"];

declare global {
  interface Navigator {
    contacts?: {
      select: (
        properties: Array<"name" | "tel" | "email" | "address" | "icon">,
        options?: { multiple?: boolean },
      ) => Promise<Array<{ name?: string[]; tel?: string[] }>>;
    };
  }
}

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function PhonePage() {
  const { contacts, setContacts } = useApp();
  const [tab, setTab] = useState<PhoneTab>("contacts");
  const [query, setQuery] = useState("");
  const [dialed, setDialed] = useState("");
  const [callTarget, setCallTarget] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [adding, setAdding] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [importStatus, setImportStatus] = useState("");

  const filteredContacts = useMemo(
    () => contacts.filter((contact) => `${contact.name} ${contact.phone}`.toLowerCase().includes(query.toLowerCase())),
    [contacts, query],
  );

  useEffect(() => {
    if (!callTarget) return;
    setSeconds(0);
    const interval = window.setInterval(() => setSeconds((value) => value + 1), 1000);
    return () => window.clearInterval(interval);
  }, [callTarget]);

  const startCall = (target: string) => {
    if (!target.trim()) return;
    setCallTarget(target);
  };

  const addContact = (event: FormEvent) => {
    event.preventDefault();
    if (!name.trim() || !phone.trim()) return;
    const contact: Contact = {
      id: `${Date.now()}`,
      name: name.trim(),
      phone: phone.trim(),
    };
    setContacts((items) => [contact, ...items]);
    setName("");
    setPhone("");
    setAdding(false);
  };

  const importPhoneContacts = async () => {
    if (!navigator.contacts?.select) {
      setImportStatus("Phone contact access is not available in this browser.");
      return;
    }

    try {
      const picked = await navigator.contacts.select(["name", "tel"], { multiple: true });
      const imported = picked
        .map((item): Contact | null => {
          const importedName = item.name?.[0]?.trim();
          const importedPhone = item.tel?.[0]?.trim();
          if (!importedName || !importedPhone) return null;
          return {
            id: `phone-${Date.now()}-${importedPhone}`,
            name: importedName,
            phone: importedPhone,
          };
        })
        .filter((item): item is Contact => Boolean(item));

      if (!imported.length) {
        setImportStatus("No contacts were selected.");
        return;
      }

      setContacts((items) => {
        const existingPhones = new Set(items.map((item) => item.phone));
        return [...imported.filter((item) => !existingPhones.has(item.phone)), ...items];
      });
      setImportStatus(`Imported ${imported.length} contact${imported.length === 1 ? "" : "s"}.`);
    } catch {
      setImportStatus("Contact import was cancelled or blocked.");
    }
  };

  return (
    <div className="grid h-full grid-cols-[230px_1fr] gap-6">
      <div className="flex flex-col gap-6">
        <PhoneTabButton active={tab === "contacts"} icon={<UserRound size={36} />} label="Contact" onClick={() => setTab("contacts")} />
        <PhoneTabButton active={tab === "keypad"} icon={<span className="grid grid-cols-2 gap-1">{Array.from({ length: 4 }).map((_, index) => <span key={index} className="h-4 w-4 rounded-full bg-current" />)}</span>} label="Keypad" onClick={() => setTab("keypad")} />
      </div>

      <GlassPanel className="min-h-0 rounded-[2rem] p-7">
        {tab === "contacts" ? (
          <div className="flex h-full flex-col text-white">
            <div className="flex gap-4">
              <label className="flex min-h-16 flex-1 items-center gap-4 rounded-[1.5rem] border border-electric-400/35 bg-white/6 px-5 focus-within:ring-2 focus-within:ring-electric-300">
                <Search size={34} />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search"
                  className="min-w-0 flex-1 bg-transparent text-3xl outline-none placeholder:text-white/38"
                />
              </label>
              <button
                type="button"
                onClick={() => setAdding(true)}
                className="grid min-h-16 min-w-16 place-items-center rounded-full bg-electric-500 outline-none transition hover:bg-electric-400 focus-visible:ring-2 focus-visible:ring-electric-300"
                aria-label="Add contact"
              >
                <Plus size={32} />
              </button>
              <button
                type="button"
                onClick={importPhoneContacts}
                className="grid min-h-16 min-w-16 place-items-center rounded-full bg-white/10 outline-none transition hover:bg-white/16 focus-visible:ring-2 focus-visible:ring-electric-300"
                aria-label="Import phone contacts"
              >
                <Download size={30} />
              </button>
            </div>
            {importStatus ? <p className="mt-3 text-sm text-white/50">{importStatus}</p> : null}

            <div className="mt-6 min-h-0 flex-1 overflow-auto pr-2">
              {filteredContacts.map((contact) => (
                <div key={contact.id} className="flex min-h-24 items-center gap-5 border-b border-white/10 px-2">
                  <div className="grid h-16 w-16 shrink-0 place-items-center overflow-hidden rounded-full bg-white/12 text-xl font-bold text-white/70">
                    {contact.avatarUrl ? <img src={contact.avatarUrl} alt="" className="h-full w-full object-cover" /> : initials(contact.name)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-3xl font-semibold">{contact.name}</p>
                    <p className="truncate text-lg text-white/48">{contact.phone}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => startCall(contact.name)}
                    className="grid min-h-14 min-w-14 place-items-center rounded-full bg-green-500 text-white outline-none transition hover:bg-green-400 focus-visible:ring-2 focus-visible:ring-green-200"
                    aria-label={`Call ${contact.name}`}
                  >
                    <Phone size={28} fill="currentColor" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="grid h-full grid-cols-[1fr_260px] gap-8 text-white">
            <div>
              <div className="mb-5 h-16 rounded-[1.5rem] bg-white/5 px-6 py-3 text-center text-4xl font-semibold tracking-wider">
                {dialed || " "}
              </div>
              <div className="grid grid-cols-3 gap-5">
                {keypad.map((key) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setDialed((value) => `${value}${key}`)}
                    className="grid aspect-square min-h-20 place-items-center rounded-full border border-white/10 bg-black/16 text-4xl outline-none transition hover:bg-white/10 focus-visible:ring-2 focus-visible:ring-electric-300"
                  >
                    {key}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex flex-col items-center justify-center gap-8">
              <button
                type="button"
                aria-label="Delete last digit"
                onClick={() => setDialed((value) => value.slice(0, -1))}
                className="grid min-h-20 min-w-20 place-items-center rounded-full border border-electric-400/25 bg-white/7 outline-none transition hover:bg-white/12 focus-visible:ring-2 focus-visible:ring-electric-300"
              >
                <Delete size={34} />
              </button>
              <button
                type="button"
                aria-label="Call"
                onClick={() => startCall(dialed)}
                className="grid min-h-28 min-w-28 place-items-center rounded-full bg-green-500 outline-none transition hover:bg-green-400 focus-visible:ring-2 focus-visible:ring-green-200"
              >
                <Phone size={52} fill="currentColor" />
              </button>
              <button
                type="button"
                aria-label="End call"
                onClick={() => setCallTarget(null)}
                className="grid min-h-16 min-w-16 place-items-center rounded-full bg-red-500/80 outline-none transition hover:bg-red-500 focus-visible:ring-2 focus-visible:ring-red-200"
              >
                <PhoneOff size={32} fill="currentColor" />
              </button>
            </div>
          </div>
        )}
      </GlassPanel>

      <Modal open={adding} title="Add contact" onClose={() => setAdding(false)}>
        <form onSubmit={addContact} className="space-y-4">
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name"
            className="min-h-14 w-full rounded-2xl border border-white/10 bg-white/8 px-4 text-xl outline-none focus:ring-2 focus:ring-electric-300"
          />
          <input
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
            placeholder="Phone number"
            className="min-h-14 w-full rounded-2xl border border-white/10 bg-white/8 px-4 text-xl outline-none focus:ring-2 focus:ring-electric-300"
          />
          <button
            type="submit"
            className="min-h-12 w-full rounded-full bg-electric-500 font-semibold outline-none transition hover:bg-electric-400 focus-visible:ring-2 focus-visible:ring-electric-300"
          >
            Save contact
          </button>
        </form>
      </Modal>

      <Modal open={Boolean(callTarget)} title={callTarget ?? ""} onClose={() => setCallTarget(null)}>
        <div className="text-center">
          <p className="text-2xl text-white/70">Calling...</p>
          <p className="mt-3 text-5xl font-bold">
            {Math.floor(seconds / 60)}:{(seconds % 60).toString().padStart(2, "0")}
          </p>
          <p className="mt-3 text-sm text-white/45">Simulation only. No real phone call is made.</p>
          <div className="mt-8 grid grid-cols-3 gap-4">
            <CallAction icon={<Mic />} label="Mute" />
            <CallAction icon={<Speaker />} label="Speaker" />
            <button
              type="button"
              onClick={() => setCallTarget(null)}
              className="grid min-h-24 place-items-center rounded-2xl bg-red-500 text-white outline-none transition hover:bg-red-400 focus-visible:ring-2 focus-visible:ring-red-200"
            >
              <PhoneOff size={34} fill="currentColor" />
              <span className="font-semibold">End call</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

function PhoneTabButton({ active, icon, label, onClick }: { active: boolean; icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "grid min-h-44 place-items-center rounded-[2rem] border p-5 outline-none transition focus-visible:ring-2 focus-visible:ring-electric-300",
        active
          ? "border-electric-400/45 bg-electric-500/30 text-white shadow-glow"
          : "border-white/10 bg-white/6 text-white/55 hover:bg-white/10",
      ].join(" ")}
    >
      <span className={active ? "text-electric-500" : "text-white"}>{icon}</span>
      <span className="text-3xl font-semibold">{label}</span>
    </button>
  );
}

function CallAction({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button
      type="button"
      className="grid min-h-24 place-items-center rounded-2xl bg-white/8 outline-none transition hover:bg-white/14 focus-visible:ring-2 focus-visible:ring-electric-300"
    >
      {icon}
      <span className="font-semibold">{label}</span>
    </button>
  );
}
