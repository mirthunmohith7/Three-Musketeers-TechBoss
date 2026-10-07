import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Crown, Shield, ShieldOff, AlertTriangle, Trophy, Users, Megaphone, Timer, Play, Pause,
  RotateCcw, Plus, Pencil, Skull, CheckCircle2, XCircle, Activity, Radio, X, Target, Archive,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Tech House Big Boss — Command Center" },
      { name: "description", content: "Futuristic control room to manage contestants, points, tasks, nominations and evictions." },
      { property: "og:title", content: "Tech House Big Boss — Command Center" },
      { property: "og:description", content: "Cyberpunk command center for running the Tech House reality show." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CommandCenter,
});

type Status = "Active" | "Nominated" | "Immune" | "Evicted" | "Captain";
type Contestant = { id: number; name: string; team: string; points: number; immune: boolean; nominated: boolean; evicted: boolean; hue: number };
type TaskStatus = "In Progress" | "Completed" | "Failed";
type Task = { id: number; title: string; desc: string; assignee: string; reward: number; status: TaskStatus };
type Log = { id: number; text: string; delta: number; time: string };

const TEAMS = ["Team Alpha", "Team Cyber", "Team Binary"];
const PRESETS = ["Big Boss orders all contestants to assemble in the living area!", "Task failed! Penalties incoming.", "Eviction process starting. All nominees report to the stage.", "Lights out. All contestants to the bedroom."];
const seed: [string, string, number][] = [
  ["Aarav Byte", "Team Alpha", 420], ["Nova Sharma", "Team Cyber", 380], ["Rhea Pixel", "Team Binary", 510],
  ["Kabir Volt", "Team Alpha", 290], ["Zara Quantum", "Team Cyber", 460], ["Dev Kernel", "Team Binary", 340],
  ["Isha Neon", "Team Alpha", 300], ["Leo Circuit", "Team Cyber", 250],
];
const now = () => new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
const initials = (n: string) => n.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();

function CommandCenter() {
  const [cs, setCs] = useState<Contestant[]>(() =>
    seed.map(([name, team, points], i) => ({ id: i + 1, name, team, points, immune: i === 4, nominated: i === 3 || i === 7, evicted: false, hue: (i * 47) % 360 })));
  const [captainId, setCaptainId] = useState<number | null>(3);
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, title: "Firewall Breach", desc: "Defend the server room for 30 minutes.", assignee: "Team Cyber", reward: 100, status: "In Progress" },
    { id: 2, title: "Code Relay", desc: "Debug the house AI in pairs.", assignee: "c:1", reward: 50, status: "Completed" },
  ]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [ann, setAnn] = useState("Welcome to the Tech House. Big Boss is watching.");
  const [evictTarget, setEvictTarget] = useState<Contestant | null>(null);
  const [editing, setEditing] = useState<Partial<Contestant> | null>(null);
  const idRef = useRef(100);
  const nid = () => ++idRef.current;

  const status = (c: Contestant): Status =>
    c.evicted ? "Evicted" : c.id === captainId ? "Captain" : c.immune ? "Immune" : c.nominated ? "Nominated" : "Active";
  const active = cs.filter((c) => !c.evicted);
  const ranked = useMemo(() => [...active].sort((a, b) => b.points - a.points), [cs]);
  const captain = cs.find((c) => c.id === captainId && !c.evicted);

  const log = (text: string, delta = 0) => setLogs((l) => [{ id: nid(), text, delta, time: now() }, ...l].slice(0, 40));
  const addPoints = (id: number, d: number, reason = "") => {
    const c = cs.find((x) => x.id === id);
    if (!c || c.evicted || !d) return;
    setCs((p) => p.map((x) => (x.id === id ? { ...x, points: x.points + d } : x)));
    log(`${c.name} ${d > 0 ? "+" : ""}${d}${reason ? ` · ${reason}` : ""}`, d);
  };
  const update = (id: number, patch: Partial<Contestant>) => setCs((p) => p.map((x) => (x.id === id ? { ...x, ...patch } : x)));

  const completeTask = (t: Task, st: TaskStatus) => {
    setTasks((p) => p.map((x) => (x.id === t.id ? { ...x, status: st } : x)));
    if (st === "Completed") {
      if (t.assignee.startsWith("c:")) addPoints(Number(t.assignee.slice(2)), t.reward, t.title);
      else {
        const ids = active.filter((c) => c.team === t.assignee).map((c) => c.id);
        setCs((p) => p.map((x) => (ids.includes(x.id) ? { ...x, points: x.points + t.reward } : x)));
        log(`${t.assignee} +${t.reward} each · ${t.title}`, t.reward);
      }
    } else if (st === "Failed") { setAnn(`Task "${t.title}" failed!`); log(`Task failed: ${t.title}`); }
  };

  const evict = (c: Contestant) => {
    update(c.id, { evicted: true, nominated: false, immune: false });
    if (captainId === c.id) setCaptainId(null);
    setAnn(`${c.name} has been EVICTED from the Tech House.`);
    log(`${c.name} evicted`);
    setEvictTarget(null);
  };

  const saveContestant = () => {
    if (!editing?.name?.trim()) return;
    if (editing.id) update(editing.id, { name: editing.name, team: editing.team, points: Number(editing.points) || 0 });
    else setCs((p) => [...p, { id: nid(), name: editing.name!, team: editing.team || TEAMS[0], points: Number(editing.points) || 0, immune: false, nominated: false, evicted: false, hue: Math.floor(Math.random() * 360) }]);
    setEditing(null);
  };

  const nominated = active.filter((c) => c.nominated);

  return (
    <div className="min-h-screen pb-16">
      {/* Ticker */}
      <div className="sticky top-0 z-40 flex items-center overflow-hidden border-b border-neon-red/60 bg-background/90 backdrop-blur glow-red">
        <div className="z-10 flex shrink-0 items-center gap-2 bg-neon-red px-4 py-2 font-display text-xs font-bold tracking-widest text-destructive-foreground">
          <Radio className="h-4 w-4 animate-pulse" /> BIG BOSS
        </div>
        <div className="relative flex-1 overflow-hidden py-2">
          <p key={ann} className="ticker whitespace-nowrap font-display text-sm tracking-wider text-neon-yellow text-glow">{ann}</p>
        </div>
      </div>

      <header className="mx-auto max-w-[1500px] px-4 pt-8 pb-6">
        <p className="font-mono text-xs tracking-[0.4em] text-neon-blue">// SURVEILLANCE ONLINE · SEASON 01</p>
        <h1 className="font-display text-3xl font-black tracking-wider md:text-5xl">
          TECH HOUSE <span className="text-neon-red text-glow">BIG BOSS</span>
        </h1>
        <p className="font-display text-sm tracking-[0.3em] text-muted-foreground">COMMAND CENTER</p>
      </header>

      <main className="mx-auto grid max-w-[1500px] gap-5 px-4">
        {/* Stats */}
        <section className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
          <Stat icon={Users} label="Active" value={active.length} tone="blue" />
          <Stat icon={Trophy} label="Top Scorer" value={ranked[0]?.name.split(" ")[0] ?? "—"} sub={`${ranked[0]?.points ?? 0} pts`} tone="yellow" />
          <Stat icon={Crown} label="Captain" value={captain?.name.split(" ")[0] ?? "Vacant"} tone="yellow" />
          <Stat icon={AlertTriangle} label="Nominated" value={nominated.length} tone="red" />
          <Stat icon={CheckCircle2} label="Tasks Done" value={tasks.filter((t) => t.status === "Completed").length} tone="green" />
          <Stat icon={Skull} label="Evicted" value={cs.filter((c) => c.evicted).length} tone="red" />
        </section>

        {/* Danger zone */}
        <section className="glass overflow-hidden border-neon-red/60">
          <div className="hazard h-2" />
          <div className="p-4">
            <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold tracking-widest text-neon-red text-glow">
              <AlertTriangle className="h-5 w-5" /> DANGER ZONE
            </h2>
            {nominated.length === 0 ? <p className="font-mono text-sm text-muted-foreground">No contestants nominated.</p> : (
              <div className="flex flex-wrap gap-3">
                {nominated.map((c) => (
                  <div key={c.id} className="flex items-center gap-3 rounded-lg border border-neon-red/60 bg-neon-red/10 px-3 py-2 glow-red">
                    <Avatar c={c} />
                    <div><p className="font-semibold">{c.name}</p><p className="font-mono text-xs text-muted-foreground">{c.points} pts</p></div>
                    <button onClick={() => setEvictTarget(c)} className="rounded bg-neon-red px-3 py-1 font-display text-xs font-bold text-destructive-foreground hover:brightness-125">EVICT</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="hazard h-2" />
        </section>

        <div className="grid gap-5 xl:grid-cols-[1fr_380px]">
          <div className="grid gap-5">
            {/* Captain */}
            <section className={`glass flex flex-wrap items-center gap-4 p-4 ${captain ? "border-neon-yellow/70 glow-yellow" : ""}`}>
              <Crown className="h-10 w-10 text-neon-yellow text-glow" />
              <div className="flex-1">
                <p className="font-mono text-xs tracking-widest text-neon-yellow">HOUSE CAPTAIN</p>
                <p className="font-display text-2xl font-bold">{captain?.name ?? "VACANT"}</p>
              </div>
              <select value={captainId ?? ""} onChange={(e) => { const id = Number(e.target.value); setCaptainId(id); update(id, { nominated: false }); const c = cs.find((x) => x.id === id); if (c) { setAnn(`${c.name} is the new House Captain!`); log(`Captaincy → ${c.name}`); } }}
                className="rounded-md border border-neon-yellow/50 bg-secondary px-3 py-2 font-mono text-sm">
                <option value="" disabled>Assign captain…</option>
                {active.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </section>

            {/* Contestants */}
            <section className="glass p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold tracking-widest text-neon-blue"><Users className="h-5 w-5" /> CONTESTANTS</h2>
                <button onClick={() => setEditing({ team: TEAMS[0], points: 0 })} className="flex items-center gap-1 rounded-md border border-neon-blue px-3 py-1.5 font-display text-xs text-neon-blue hover:bg-neon-blue/15"><Plus className="h-4 w-4" /> ADD</button>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                {active.map((c) => <Card key={c.id} c={c} st={status(c)} onPts={addPoints} update={update} onEdit={() => setEditing(c)} onEvict={() => setEvictTarget(c)} onCaptain={() => { setCaptainId(c.id); update(c.id, { nominated: false }); log(`Captaincy → ${c.name}`); setAnn(`${c.name} is the new House Captain!`); }} />)}
              </div>
            </section>

            <Tasks tasks={tasks} setTasks={setTasks} active={active} onStatus={completeTask} nid={nid} />
          </div>

          <aside className="grid content-start gap-5">
            <Leaderboard ranked={ranked} captainId={captainId} />
            <TaskTimer onEnd={() => setAnn("TIME'S UP! Task window closed.")} />
            <Announce onSend={(t) => { setAnn(t); log(`📢 ${t}`); }} />
            <section className="glass p-4">
              <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-bold tracking-widest text-neon-blue"><Activity className="h-4 w-4" /> ACTIVITY LOG</h2>
              <ul className="max-h-64 space-y-1 overflow-auto font-mono text-xs">
                {logs.length === 0 && <li className="text-muted-foreground">Awaiting events…</li>}
                {logs.map((l) => (
                  <li key={l.id} className="flex gap-2 border-b border-border/40 py-1">
                    <span className="text-muted-foreground">{l.time}</span>
                    <span className={l.delta > 0 ? "text-neon-green" : l.delta < 0 ? "text-neon-red" : "text-foreground"}>{l.text}</span>
                  </li>
                ))}
              </ul>
            </section>
          </aside>
        </div>

        {/* Archive */}
        <section className="glass p-4">
          <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold tracking-widest text-muted-foreground"><Archive className="h-5 w-5" /> EVICTED · WALL OF SHAME</h2>
          <div className="flex flex-wrap gap-3">
            {cs.filter((c) => c.evicted).length === 0 && <p className="font-mono text-sm text-muted-foreground">Archive empty.</p>}
            {cs.filter((c) => c.evicted).map((c) => (
              <div key={c.id} className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 px-3 py-2 opacity-60 grayscale">
                <Avatar c={c} /><div><p className="font-semibold line-through">{c.name}</p><p className="font-mono text-xs">{c.team} · {c.points} pts</p></div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {evictTarget && (
        <Modal onClose={() => setEvictTarget(null)}>
          <Skull className="mx-auto h-12 w-12 text-neon-red text-glow" />
          <h3 className="mt-3 text-center font-display text-xl font-bold">Confirm Eviction of {evictTarget.name}?</h3>
          <p className="mt-2 text-center text-sm text-muted-foreground">They will be removed from the leaderboard and can no longer earn points or captaincy.</p>
          <div className="mt-6 flex justify-center gap-3">
            <button onClick={() => setEvictTarget(null)} className="rounded-md border px-4 py-2 font-display text-sm">CANCEL</button>
            <button onClick={() => evict(evictTarget)} className="rounded-md bg-neon-red px-4 py-2 font-display text-sm font-bold text-destructive-foreground glow-red">EVICT</button>
          </div>
        </Modal>
      )}
      {editing && (
        <Modal onClose={() => setEditing(null)}>
          <h3 className="font-display text-lg font-bold text-neon-blue">{editing.id ? "EDIT" : "NEW"} CONTESTANT</h3>
          <div className="mt-4 grid gap-3">
            <input className={inp} placeholder="Name" value={editing.name ?? ""} onChange={(e) => setEditing({ ...editing, name: e.target.value })} />
            <select className={inp} value={editing.team} onChange={(e) => setEditing({ ...editing, team: e.target.value })}>{TEAMS.map((t) => <option key={t}>{t}</option>)}</select>
            <input className={inp} type="number" placeholder="Points" value={editing.points ?? 0} onChange={(e) => setEditing({ ...editing, points: Number(e.target.value) })} />
            <button onClick={saveContestant} className="rounded-md bg-neon-blue py-2 font-display text-sm font-bold text-primary-foreground glow-blue">SAVE</button>
          </div>
        </Modal>
      )}
    </div>
  );
}

const inp = "w-full rounded-md border border-input bg-secondary px-3 py-2 font-mono text-sm outline-none focus:border-neon-blue";
const tones = { blue: "text-neon-blue", yellow: "text-neon-yellow", red: "text-neon-red", green: "text-neon-green" };

function Stat({ icon: I, label, value, sub, tone }: { icon: typeof Users; label: string; value: string | number; sub?: string; tone: keyof typeof tones }) {
  return (
    <div className="glass p-4">
      <div className={`flex items-center gap-2 font-mono text-[10px] tracking-widest ${tones[tone]}`}><I className="h-4 w-4" />{label.toUpperCase()}</div>
      <p className={`mt-2 truncate font-display text-2xl font-bold ${tones[tone]} text-glow`}>{value}</p>
      {sub && <p className="font-mono text-xs text-muted-foreground">{sub}</p>}
    </div>
  );
}

function Avatar({ c, size = 40 }: { c: Contestant; size?: number }) {
  return (
    <div style={{ width: size, height: size, background: `linear-gradient(135deg, oklch(0.65 0.2 ${c.hue}), oklch(0.35 0.15 ${c.hue + 60}))` }}
      className="flex shrink-0 items-center justify-center rounded-full border border-border font-display text-xs font-bold">{initials(c.name)}</div>
  );
}

const badge: Record<Status, string> = {
  Active: "border-neon-blue text-neon-blue", Captain: "border-neon-yellow text-neon-yellow glow-yellow",
  Immune: "border-neon-green text-neon-green", Nominated: "border-neon-red text-neon-red glow-red", Evicted: "border-muted-foreground text-muted-foreground",
};

function Card({ c, st, onPts, update, onEdit, onEvict, onCaptain }: { c: Contestant; st: Status; onPts: (id: number, d: number) => void; update: (id: number, p: Partial<Contestant>) => void; onEdit: () => void; onEvict: () => void; onCaptain: () => void }) {
  const [custom, setCustom] = useState("");
  const isCap = st === "Captain";
  const canNominate = !c.immune && !isCap;
  return (
    <div className={`rounded-lg border bg-secondary/40 p-3 transition ${isCap ? "border-neon-yellow glow-yellow" : c.nominated ? "border-neon-red/70" : ""}`}>
      <div className="flex items-center gap-3">
        <div className="relative"><Avatar c={c} size={48} />{isCap && <Crown className="absolute -top-3 left-1/2 h-5 w-5 -translate-x-1/2 text-neon-yellow text-glow" />}</div>
        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">{c.name}</p>
          <p className="font-mono text-xs text-muted-foreground">{c.team}</p>
        </div>
        <div className="text-right">
          <p className="font-display text-xl font-bold text-neon-yellow">{c.points}</p>
          <span className={`rounded-full border px-2 py-0.5 font-mono text-[10px] ${badge[st]}`}>{st.toUpperCase()}</span>
          {c.immune && isCap && <span className="ml-1 rounded-full border border-neon-green px-2 py-0.5 font-mono text-[10px] text-neon-green">IMMUNE</span>}
        </div>
      </div>
      <div className="mt-3 grid grid-cols-6 gap-1">
        {[10, 50, 100].map((n) => <button key={n} onClick={() => onPts(c.id, n)} className="rounded border border-neon-green/40 py-1 font-mono text-xs text-neon-green hover:bg-neon-green/15">+{n}</button>)}
        {[-10, -50, -100].map((n) => <button key={n} onClick={() => onPts(c.id, n)} className="rounded border border-neon-red/40 py-1 font-mono text-xs text-neon-red hover:bg-neon-red/15">{n}</button>)}
      </div>
      <div className="mt-2 flex gap-1">
        <input value={custom} onChange={(e) => setCustom(e.target.value)} type="number" placeholder="Custom ±" className={`${inp} py-1`} />
        <button onClick={() => { onPts(c.id, Number(custom)); setCustom(""); }} className="rounded border border-neon-blue px-3 font-mono text-xs text-neon-blue hover:bg-neon-blue/15">APPLY</button>
      </div>
      <div className="mt-2 flex flex-wrap gap-1">
        <Act onClick={() => update(c.id, { immune: !c.immune, nominated: c.immune ? c.nominated : false })} tone="green">{c.immune ? <ShieldOff className="h-3 w-3" /> : <Shield className="h-3 w-3" />}{c.immune ? "Revoke" : "Immunity"}</Act>
        <Act onClick={() => update(c.id, { nominated: !c.nominated })} tone="red" disabled={!canNominate && !c.nominated} title={!canNominate ? (c.immune ? "Immune contestants cannot be nominated" : "Captain cannot be nominated") : ""}>
          <Target className="h-3 w-3" />{c.nominated ? "Un-nominate" : canNominate ? "Nominate" : c.immune ? "Protected" : "Captain"}
        </Act>
        {!isCap && <Act onClick={onCaptain} tone="yellow"><Crown className="h-3 w-3" />Captain</Act>}
        <Act onClick={onEdit} tone="blue"><Pencil className="h-3 w-3" />Edit</Act>
        {c.nominated && <Act onClick={onEvict} tone="red"><Skull className="h-3 w-3" />Evict</Act>}
      </div>
    </div>
  );
}

function Act({ children, tone, ...p }: { children: React.ReactNode; tone: keyof typeof tones } & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...p} className={`flex items-center gap-1 rounded border border-current/40 px-2 py-1 font-mono text-[11px] ${tones[tone]} hover:bg-current/10 disabled:cursor-not-allowed disabled:opacity-35`}>{children}</button>;
}

function Leaderboard({ ranked, captainId }: { ranked: Contestant[]; captainId: number | null }) {
  const medal = ["bg-neon-yellow text-accent-foreground glow-yellow", "bg-neon-blue text-primary-foreground", "bg-neon-red text-destructive-foreground"];
  return (
    <section className="glass p-4">
      <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-bold tracking-widest text-neon-yellow"><Trophy className="h-4 w-4" /> LIVE LEADERBOARD</h2>
      <ol className="relative" style={{ height: ranked.length * 44 }}>
        {ranked.map((c, i) => (
          <li key={c.id} style={{ transform: `translateY(${i * 44}px)` }} className={`absolute inset-x-0 flex h-10 items-center gap-3 rounded-md px-2 transition-transform duration-500 ${c.id === captainId ? "bg-neon-yellow/10" : "bg-secondary/40"}`}>
            <span className={`flex h-7 w-7 items-center justify-center rounded font-display text-xs font-bold ${medal[i] ?? "bg-muted text-muted-foreground"}`}>#{i + 1}</span>
            <span className="flex-1 truncate font-semibold">{c.name}{c.id === captainId && <Crown className="ml-1 inline h-3 w-3 text-neon-yellow" />}</span>
            <span className="font-mono text-neon-yellow">{c.points}</span>
          </li>
        ))}
      </ol>
    </section>
  );
}

function TaskTimer({ onEnd }: { onEnd: () => void }) {
  const [secs, setSecs] = useState(300);
  const [base, setBase] = useState(300);
  const [run, setRun] = useState(false);
  useEffect(() => {
    if (!run) return;
    const t = setInterval(() => setSecs((s) => {
      if (s <= 1) { setRun(false); onEnd(); return 0; }
      return s - 1;
    }), 1000);
    return () => clearInterval(t);
  }, [run]);
  const warn = secs > 0 && secs <= 10;
  const mm = String(Math.floor(secs / 60)).padStart(2, "0"), ss = String(secs % 60).padStart(2, "0");
  return (
    <section className={`glass border-2 p-4 ${warn ? "pulse-danger" : ""}`}>
      <h2 className="mb-2 flex items-center gap-2 font-display text-sm font-bold tracking-widest text-neon-blue"><Timer className="h-4 w-4" /> TASK TIMER</h2>
      <p className={`text-center font-display text-6xl font-black tabular-nums text-glow ${warn || secs === 0 ? "text-neon-red" : "text-neon-blue"}`}>{mm}:{ss}</p>
      <div className="mt-3 grid grid-cols-4 gap-1">
        {[1, 5, 15, 30].map((m) => <button key={m} onClick={() => { setRun(false); setBase(m * 60); setSecs(m * 60); }} className="rounded border border-border py-1 font-mono text-xs hover:border-neon-blue">{m}m</button>)}
      </div>
      <div className="mt-2 grid grid-cols-3 gap-1">
        <button onClick={() => secs > 0 && setRun(true)} className="flex items-center justify-center gap-1 rounded bg-neon-green/20 py-2 font-display text-xs text-neon-green"><Play className="h-3 w-3" />START</button>
        <button onClick={() => setRun(false)} className="flex items-center justify-center gap-1 rounded bg-neon-yellow/20 py-2 font-display text-xs text-neon-yellow"><Pause className="h-3 w-3" />PAUSE</button>
        <button onClick={() => { setRun(false); setSecs(base); }} className="flex items-center justify-center gap-1 rounded bg-neon-red/20 py-2 font-display text-xs text-neon-red"><RotateCcw className="h-3 w-3" />RESET</button>
      </div>
    </section>
  );
}

function Announce({ onSend }: { onSend: (t: string) => void }) {
  const [txt, setTxt] = useState("");
  return (
    <section className="glass p-4">
      <h2 className="mb-3 flex items-center gap-2 font-display text-sm font-bold tracking-widest text-neon-red"><Megaphone className="h-4 w-4" /> BROADCAST</h2>
      <div className="grid gap-1">
        {PRESETS.map((p) => <button key={p} onClick={() => onSend(p)} className="rounded border border-neon-red/30 px-2 py-1.5 text-left text-sm hover:bg-neon-red/10">{p}</button>)}
      </div>
      <div className="mt-2 flex gap-1">
        <input value={txt} onChange={(e) => setTxt(e.target.value)} onKeyDown={(e) => e.key === "Enter" && txt.trim() && (onSend(txt), setTxt(""))} placeholder="Custom announcement…" className={inp} />
        <button onClick={() => { if (txt.trim()) { onSend(txt); setTxt(""); } }} className="rounded bg-neon-red px-3 font-display text-xs font-bold text-destructive-foreground">SEND</button>
      </div>
    </section>
  );
}

function Tasks({ tasks, setTasks, active, onStatus, nid }: { tasks: Task[]; setTasks: React.Dispatch<React.SetStateAction<Task[]>>; active: Contestant[]; onStatus: (t: Task, s: TaskStatus) => void; nid: () => number }) {
  const [f, setF] = useState({ title: "", desc: "", assignee: TEAMS[0], reward: 50 });
  const label = (a: string) => (a.startsWith("c:") ? active.find((c) => c.id === Number(a.slice(2)))?.name ?? "Evicted" : a);
  const st: Record<TaskStatus, string> = { "In Progress": "border-neon-blue text-neon-blue", Completed: "border-neon-green text-neon-green", Failed: "border-neon-red text-neon-red" };
  return (
    <section className="glass p-4">
      <h2 className="mb-3 flex items-center gap-2 font-display text-lg font-bold tracking-widest text-neon-blue"><Target className="h-5 w-5" /> TASKS</h2>
      <div className="grid gap-2 md:grid-cols-[1fr_1fr_180px_100px_auto]">
        <input className={inp} placeholder="Title" value={f.title} onChange={(e) => setF({ ...f, title: e.target.value })} />
        <input className={inp} placeholder="Description" value={f.desc} onChange={(e) => setF({ ...f, desc: e.target.value })} />
        <select className={inp} value={f.assignee} onChange={(e) => setF({ ...f, assignee: e.target.value })}>
          <optgroup label="Teams">{TEAMS.map((t) => <option key={t}>{t}</option>)}</optgroup>
          <optgroup label="Contestants">{active.map((c) => <option key={c.id} value={`c:${c.id}`}>{c.name}</option>)}</optgroup>
        </select>
        <input className={inp} type="number" value={f.reward} onChange={(e) => setF({ ...f, reward: Number(e.target.value) })} />
        <button onClick={() => { if (!f.title.trim()) return; setTasks((p) => [{ id: nid(), ...f, status: "In Progress" }, ...p]); setF({ ...f, title: "", desc: "" }); }} className="flex items-center justify-center gap-1 rounded-md bg-neon-blue px-3 py-2 font-display text-xs font-bold text-primary-foreground"><Plus className="h-4 w-4" />CREATE</button>
      </div>
      <div className="mt-4 grid gap-3 md:grid-cols-2">
        {tasks.map((t) => (
          <div key={t.id} className={`rounded-lg border bg-secondary/40 p-3 ${t.status === "Completed" ? "border-neon-green/50" : t.status === "Failed" ? "border-neon-red/50 opacity-70" : ""}`}>
            <div className="flex items-start justify-between gap-2">
              <p className="font-display font-bold">{t.title}</p>
              <span className={`shrink-0 rounded-full border px-2 py-0.5 font-mono text-[10px] ${st[t.status]}`}>{t.status.toUpperCase()}</span>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">{t.desc}</p>
            <p className="mt-2 font-mono text-xs">→ {label(t.assignee)} · <span className="text-neon-yellow">+{t.reward} pts</span></p>
            {t.status === "In Progress" && (
              <div className="mt-2 flex gap-1">
                <Act tone="green" onClick={() => onStatus(t, "Completed")}><CheckCircle2 className="h-3 w-3" />Complete</Act>
                <Act tone="red" onClick={() => onStatus(t, "Failed")}><XCircle className="h-3 w-3" />Fail</Act>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" onClick={onClose}>
      <div className="glass relative w-full max-w-md bg-popover p-6" onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        {children}
      </div>
    </div>
  );
}
