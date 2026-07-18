import { useEffect, useState } from 'react'
import { BrandBadge, BrandCard, LogoMark } from './components/Brand'

type Item = { id: string; imageRef: string; answer: string; brick?: string; category?: string; explanation?: string }
type Mode = 'easy' | 'medium' | 'hard'

const BASE = import.meta.env.BASE_URL
const ROUND = 12 // questions per game

function shuffle<T>(a: T[]): T[] {
  const r = [...a]
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]] }
  return r
}
function norm(s: string) {
  return s.toLowerCase().replace(/\(.*?\)/g, ' ').replace(/[^a-z0-9]+/g, ' ')
    .replace(/\b(the|a|an|of|and)\b/g, ' ').replace(/s\b/g, '').replace(/\s+/g, ' ').trim()
}
function lev(a: string, b: string) {
  const m = a.length, n = b.length
  const d = Array.from({ length: m + 1 }, (_, i) => [i, ...Array(n).fill(0)])
  for (let j = 0; j <= n; j++) d[0][j] = j
  for (let i = 1; i <= m; i++) for (let j = 1; j <= n; j++)
    d[i][j] = Math.min(d[i - 1][j] + 1, d[i][j - 1] + 1, d[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1))
  return d[m][n]
}
function accept(input: string, answer: string) {
  const a = norm(input), b = norm(answer)
  if (!a) return false
  if (a === b) return true
  if (b.includes(a) && a.length >= Math.max(4, b.length - 3)) return true
  if (a.includes(b) && b.length >= 4) return true
  return lev(a, b) <= (b.length > 10 ? 2 : 1)
}

export default function App() {
  const [items, setItems] = useState<Item[] | null>(null)
  const [err, setErr] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode | null>(null)
  const [queue, setQueue] = useState<Item[]>([])
  const [i, setI] = useState(0)
  const [choices, setChoices] = useState<string[]>([])
  const [picked, setPicked] = useState<string | null>(null)
  const [typed, setTyped] = useState('')
  const [revealed, setRevealed] = useState(false)
  const [correct, setCorrect] = useState(0)

  useEffect(() => {
    fetch(`${BASE}data/anatomy.json`).then((r) => r.json()).then((d: Item[]) => setItems(d)).catch(() => setErr('Could not load game data.'))
  }, [])

  const cur = queue[i]
  const done = mode && i >= queue.length && queue.length > 0

  function distractors(item: Item, n: number): string[] {
    if (!items) return []
    const pool = items.filter((x) => x.answer !== item.answer)
    const same = shuffle(pool.filter((x) => x.category === item.category)).map((x) => x.answer)
    const rest = shuffle(pool).map((x) => x.answer)
    const out: string[] = []
    for (const a of [...same, ...rest]) { if (!out.includes(a) && a !== item.answer) out.push(a); if (out.length >= n) break }
    return out
  }
  function setupQuestion(item: Item, m: Mode) {
    if (m === 'easy') setChoices(shuffle([item.answer, ...distractors(item, 1)]))
    else if (m === 'medium') setChoices(shuffle([item.answer, ...distractors(item, 3)]))
    else setChoices([])
    setPicked(null); setTyped(''); setRevealed(false)
  }
  function start(m: Mode) {
    if (!items) return
    const q = shuffle(items).slice(0, ROUND)
    setMode(m); setQueue(q); setI(0); setCorrect(0); setupQuestion(q[0], m)
  }
  function submitChoice(c: string) {
    if (revealed) return
    setPicked(c); setRevealed(true); if (c === cur.answer) setCorrect((x) => x + 1)
  }
  function submitTyped() {
    if (revealed || !typed.trim()) return
    const ok = accept(typed, cur.answer); setRevealed(true); if (ok) setCorrect((x) => x + 1)
  }
  function next() {
    const ni = i + 1; setI(ni); if (ni < queue.length) setupQuestion(queue[ni], mode!)
  }

  if (err) return <Shell><p className="text-red-400">{err}</p></Shell>
  if (!items) return <Shell><p className="text-slate-400">Loading…</p></Shell>

  if (!mode) {
    const modes: { m: Mode; name: string; desc: string }[] = [
      { m: 'easy', name: 'Easy', desc: 'Choose between two options' },
      { m: 'medium', name: 'Medium', desc: 'Multiple choice (4 options)' },
      { m: 'hard', name: 'Hard', desc: 'Type the structure name' },
    ]
    return (
      <Shell>
        <BrandCard />
        <div className="mt-6 rounded-2xl border border-slate-700 bg-slate-800/40 p-6">
          <h1 className="flex items-center gap-3 text-2xl font-bold text-slate-100"><LogoMark size={30} /> Anatomy ID</h1>
          <p className="mt-2 text-slate-300">A structure is shown — identify it. {items.length} structures. Pick a difficulty:</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {modes.map((x) => (
              <button key={x.m} onClick={() => start(x.m)}
                className="rounded-xl border border-slate-600 bg-slate-800 p-4 text-left transition hover:border-sky-400">
                <div className="text-lg font-bold text-sky-300">{x.name}</div>
                <div className="mt-1 text-sm text-slate-400">{x.desc}</div>
              </button>
            ))}
          </div>
        </div>
      </Shell>
    )
  }

  if (done) {
    const pct = queue.length ? Math.round((correct / queue.length) * 100) : 0
    return (
      <Shell>
        <div className="rounded-2xl border border-slate-700 bg-slate-800/40 p-8 text-center">
          <h1 className="text-2xl font-bold text-slate-100">Done! 🎉</h1>
          <p className="mt-3 text-lg text-slate-300">{correct}/{queue.length} correct · <span className="font-semibold text-teal-300">{pct}%</span> <span className="text-slate-400">({mode})</span></p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <button onClick={() => start(mode)} className="rounded-xl bg-gradient-to-br from-sky-400 to-teal-400 px-6 py-3 font-semibold text-slate-900 hover:opacity-90">Play again</button>
            <button onClick={() => setMode(null)} className="rounded-xl border border-slate-600 bg-slate-800 px-6 py-3 font-semibold text-slate-200 hover:border-slate-400">Change mode</button>
          </div>
        </div>
      </Shell>
    )
  }

  return (
    <Shell>
      <div className="mb-3 flex items-center justify-between gap-3">
        <button onClick={() => setMode(null)} className="flex items-center gap-2 text-sm font-bold text-slate-100 hover:text-sky-300"><LogoMark size={22} /> Anatomy ID</button>
        <span className="text-sm text-slate-400 capitalize">{mode} · {i + 1}/{queue.length} · {correct}✓</span>
      </div>

      <div className="overflow-hidden rounded-2xl border-2 border-slate-700 bg-white">
        <img src={`${BASE}data/images/${cur.imageRef}`} alt="" className="mx-auto max-h-[52vh] w-full object-contain" />
      </div>
      <p className="mt-4 text-center text-lg font-semibold text-slate-200">What structure is shown?</p>

      {mode !== 'hard' ? (
        <div className={`mt-4 grid gap-2 ${mode === 'easy' ? 'sm:grid-cols-2' : 'sm:grid-cols-2'}`}>
          {choices.map((c) => {
            let cls = 'border-slate-600 bg-slate-800 text-slate-200 hover:border-sky-400'
            if (revealed) {
              if (c === cur.answer) cls = 'border-teal-400 bg-teal-500/15 text-teal-200'
              else if (c === picked) cls = 'border-red-500 bg-red-500/10 text-red-300'
              else cls = 'border-slate-700 bg-slate-800/50 text-slate-500'
            }
            return (
              <button key={c} disabled={revealed} onClick={() => submitChoice(c)}
                className={`rounded-xl border px-4 py-3 text-left font-medium transition ${cls}`}>{c}</button>
            )
          })}
        </div>
      ) : (
        <div className="mt-4">
          {!revealed ? (
            <form onSubmit={(e) => { e.preventDefault(); submitTyped() }} className="flex gap-2">
              <input autoFocus value={typed} onChange={(e) => setTyped(e.target.value)} placeholder="Type the structure name…"
                className="flex-1 rounded-xl border border-slate-600 bg-slate-800 px-4 py-3 text-slate-100 outline-none focus:border-sky-400" />
              <button type="submit" className="rounded-xl bg-gradient-to-br from-sky-400 to-teal-400 px-5 py-3 font-semibold text-slate-900 hover:opacity-90">Check</button>
            </form>
          ) : (
            <div className={`rounded-xl border px-4 py-3 ${accept(typed, cur.answer) ? 'border-teal-400 bg-teal-500/15' : 'border-red-500 bg-red-500/10'}`}>
              <span className={accept(typed, cur.answer) ? 'text-teal-200' : 'text-red-300'}>
                {accept(typed, cur.answer) ? 'Correct!' : `You typed: “${typed || '—'}”`}
              </span>
            </div>
          )}
        </div>
      )}

      {revealed && (
        <div className="mt-4 rounded-xl border border-teal-400/40 bg-teal-500/10 p-4">
          <div className="text-base font-bold text-teal-300">{cur.answer}</div>
          {cur.brick && <div className="mt-0.5 text-xs text-slate-400">{cur.brick}</div>}
          {cur.explanation && <p className="mt-2 text-sm leading-snug text-slate-300">{cur.explanation}</p>}
          <button onClick={next} className="mt-3 rounded-xl bg-gradient-to-br from-sky-400 to-teal-400 px-6 py-2.5 font-semibold text-slate-900 hover:opacity-90">
            {i + 1 < queue.length ? 'Next →' : 'See results →'}
          </button>
        </div>
      )}
    </Shell>
  )
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen px-4 py-8">
      <BrandBadge />
      <div className="mx-auto max-w-2xl">{children}</div>
    </div>
  )
}
