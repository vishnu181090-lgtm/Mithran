
import { useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import type { Mesh } from 'three'
import {
  Atom,
  BrainCircuit,
  FlaskConical,
  RotateCcw,
  Sparkles,
  Zap,
  BookOpen,
} from 'lucide-react'
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

function Motor({ current, field }: { current: number; field: number }) {
  const coil = useRef<Mesh>(null)

  useFrame((_, delta) => {
    if (coil.current) {
      coil.current.rotation.y += delta * current * field * 0.25
    }
  })

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[4, 5, 5]} intensity={3} />

      <mesh position={[-1.2, 0, 0]}>
        <boxGeometry args={[0.4, 1.7, 0.5]} />
        <meshStandardMaterial color="#fb5364" metalness={0.4} />
      </mesh>

      <mesh position={[1.2, 0, 0]}>
        <boxGeometry args={[0.4, 1.7, 0.5]} />
        <meshStandardMaterial color="#3b82f6" metalness={0.4} />
      </mesh>

      <group ref={coil}>
        <mesh>
          <torusGeometry args={[0.7, 0.08, 16, 64]} />
          <meshStandardMaterial
            color="#fbbf24"
            metalness={0.7}
            emissive="#854d0e"
          />
        </mesh>

        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 2, 24]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.8} />
        </mesh>
      </group>

      <OrbitControls enablePan={false} />
    </>
  )
}

export default function App() {
  const [current, setCurrent] = useState(3)
  const [field, setField] = useState(2)
  const [running, setRunning] = useState(true)

  const [userPrompt, setUserPrompt] = useState('')
  const [topic, setTopic] = useState('Electric Motor')
  const [message, setMessage] = useState(
    'Enter a topic above to begin exploring. The current demonstration is an electric motor.',
  )

  const response = current * field

  const graphData = Array.from({ length: 6 }, (_, i) => ({
    current: i * 2,
    response: i * 2 * field,
  }))

  function handlePrompt(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const text = userPrompt.trim()

    if (!text) {
      setMessage('Please enter a topic you want to learn about.')
      return
    }

    setTopic(text)
    setMessage(
      `Your selected topic is "${text}". This version can accept your topic, ` +
        'but its 3D model and experiment are still the electric motor demonstration. ' +
        'Connect a real AI API to generate a lesson specifically for your topic.',
    )
  }

  function explain() {
    setMessage(
      `Topic: ${topic}. Your current is ${current} A and your magnetic field setting is ${field}. ` +
        `The simplified response score is ${response.toFixed(1)}. ` +
        'In this educational model, response is proportional to current × field setting. ' +
        'A real motor also depends on its design, resistance, and mechanical load.',
    )
  }

  function reset() {
    setCurrent(3)
    setField(2)
    setRunning(true)
    setMessage('Experiment reset. Change the settings and try again.')
  }

  return (
    <main className="min-h-screen bg-[#070b14] text-slate-100">
      <header className="border-b border-white/10 bg-[#070b14] px-5 py-5">
        <div className="mx-auto flex max-w-7xl items-center gap-3">
          <div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-300">
            <Atom size={26} />
          </div>

          <div>
            <h1 className="text-xl font-bold">
              ConceptLab <span className="text-cyan-400">AI</span>
            </h1>
            <p className="text-xs text-slate-400">
              Explore. Experiment. Understand.
            </p>
          </div>

          <span className="ml-auto hidden rounded-full border border-emerald-400/20 px-3 py-2 text-xs text-emerald-300 sm:block">
            Virtual Lab
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-10">
        <section>
          <p className="mb-3 flex items-center gap-2 text-sm text-cyan-300">
            <Sparkles size={16} />
            INTERACTIVE SCIENCE STUDIO
          </p>

          <h2 className="max-w-3xl text-3xl font-bold leading-tight sm:text-5xl">
            Discover science by
            <span className="text-cyan-400"> experimenting.</span>
          </h2>

          <p className="mt-4 max-w-2xl leading-7 text-slate-400">
            Tell us what you want to learn. Explore concepts, experiment with
            scientific ideas, and understand the results.
          </p>
        </section>

        {/* Student prompt */}
        <section className="mt-8 rounded-2xl border border-cyan-400/20 bg-white/[0.04] p-5 sm:p-7">
          <div className="mb-4 flex items-center gap-3">
            <div className="rounded-xl bg-cyan-400/10 p-3 text-cyan-300">
              <BookOpen size={23} />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                What would you like to learn today?
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Enter a science topic, concept, or experiment.
              </p>
            </div>
          </div>

          <form
            onSubmit={handlePrompt}
            className="flex flex-col gap-3 sm:flex-row"
          >
            <input
              value={userPrompt}
              onChange={(event) => setUserPrompt(event.target.value)}
              placeholder="e.g. How does an electric motor work?"
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-[#0b1220] px-4 py-3 outline-none transition focus:border-cyan-400"
            />

            <button
              type="submit"
              className="rounded-xl bg-cyan-400 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Explore Topic
            </button>
          </form>

          <div className="mt-4 flex flex-wrap gap-2">
            {['Electric Motor', 'Photosynthesis', 'Human Heart'].map(
              (example) => (
                <button
                  key={example}
                  onClick={() => setUserPrompt(example)}
                  className="rounded-full border border-white/10 px-3 py-2 text-xs text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-300"
                >
                  {example}
                </button>
              ),
            )}
          </div>
        </section>

        {/* Selected topic */}
        <section className="mt-6 rounded-2xl border border-white/10 bg-white/[0.035] p-5">
          <p className="text-xs font-medium uppercase tracking-widest text-cyan-300">
            Your selected topic
          </p>

          <h3 className="mt-2 break-words text-2xl font-bold">{topic}</h3>

          <p className="mt-3 leading-7 text-slate-300">{message}</p>
        </section>

        {/* Summary cards */}
        <section className="my-8 grid gap-4 sm:grid-cols-3">
          {[
            { title: 'Current', value: `${current} A`, Icon: Zap },
            { title: 'Magnetic Field', value: `${field} units`, Icon: Atom },
            {
              title: 'Response Score',
              value: response.toFixed(1),
              Icon: FlaskConical,
            },
          ].map(({ title, value, Icon }) => (
            <div
              key={title}
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5"
            >
              <div className="flex items-center justify-between text-slate-400">
                <span>{title}</span>
                <Icon size={20} className="text-cyan-400" />
              </div>
              <p className="mt-3 text-3xl font-semibold">{value}</p>
            </div>
          ))}
        </section>

        {/* 3D model and experiment controls */}
        <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b1220]">
            <div className="border-b border-white/10 p-5">
              <h3 className="font-semibold">3D Learning Space</h3>
              <p className="mt-1 text-xs text-slate-400">
                Electric motor demonstration · Drag to rotate
              </p>
            </div>

            <div className="h-[360px] bg-[#090e19] sm:h-[420px]">
              <Canvas camera={{ position: [3.5, 2.5, 4.5], fov: 45 }}>
                <color attach="background" args={['#090e19']} />
                <gridHelper args={[8, 16, '#19354a', '#122638']} />
                <Motor current={running ? current : 0} field={field} />
              </Canvas>
            </div>

            <p className="border-t border-white/10 p-4 text-xs text-slate-500">
              This simplified 3D model currently represents an electric motor.
            </p>
          </div>

          <div className="space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="mb-6 flex items-center gap-2 font-semibold">
                <FlaskConical className="text-cyan-300" size={20} />
                Experiment Controls
              </h3>

              <label className="mb-3 flex justify-between text-sm">
                <span>Electric current</span>
                <span className="text-cyan-300">{current} A</span>
              </label>

              <input
                className="mb-7 w-full accent-cyan-400"
                type="range"
                min="0"
                max="10"
                step="0.5"
                value={current}
                onChange={(event) => setCurrent(Number(event.target.value))}
              />

              <label className="mb-3 flex justify-between text-sm">
                <span>Magnetic field strength</span>
                <span className="text-cyan-300">{field}</span>
              </label>

              <input
                className="mb-6 w-full accent-cyan-400"
                type="range"
                min="0"
                max="5"
                step="0.5"
                value={field}
                onChange={(event) => setField(Number(event.target.value))}
              />

              <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/5 p-4">
                <p className="text-xs text-slate-400">
                  Simplified response score
                </p>
                <p className="mt-2 text-3xl font-bold text-cyan-300">
                  {response.toFixed(1)}
                </p>
                <p className="mt-2 text-xs text-slate-400">
                  Calculated as current × magnetic field setting.
                </p>
              </div>

              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => setRunning(!running)}
                  className="flex-1 rounded-xl bg-cyan-400 px-4 py-3 font-semibold text-slate-950 hover:bg-cyan-300"
                >
                  {running ? 'Pause Motor' : 'Run Motor'}
                </button>

                <button
                  onClick={reset}
                  aria-label="Reset experiment"
                  className="rounded-xl border border-white/10 px-4 hover:bg-white/10"
                >
                  <RotateCcw size={18} />
                </button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
              <h3 className="mb-4 font-semibold">Experiment Graph</h3>

              <ResponsiveContainer width="100%" height={190}>
                <LineChart data={graphData}>
                  <CartesianGrid stroke="#263447" strokeDasharray="3 3" />
                  <XAxis dataKey="current" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />

                  <Tooltip
                    contentStyle={{
                      background: '#101827',
                      border: '1px solid #334155',
                    }}
                  />

                  <Line
                    type="monotone"
                    dataKey="response"
                    name="Response score"
                    stroke="#22d3ee"
                    strokeWidth={3}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>

              <p className="text-xs leading-5 text-slate-500">
                The graph updates when the experiment settings change.
              </p>
            </div>
          </div>
        </section>

        {/* Tutor */}
        <section className="mt-6 rounded-2xl border border-cyan-400/20 bg-cyan-400/[0.05] p-6">
          <div className="mb-4 flex items-center gap-3">
            <BrainCircuit className="text-cyan-300" size={26} />
            <div>
              <h3 className="font-semibold">ConceptLab Tutor</h3>
              <p className="text-xs text-slate-400">
                Understand your experiment
              </p>
            </div>
          </div>

          <p className="mb-5 text-sm leading-7 text-slate-300">{message}</p>

          <button
            onClick={explain}
            className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-4 py-3 text-sm text-cyan-200 hover:bg-cyan-300/20"
          >
            <Sparkles size={16} className="mr-2 inline" />
            Explain my results
          </button>

          <p className="mt-3 text-xs text-slate-500">
            Built-in explanations only. Live AI generation has not been
            connected yet.
          </p>
        </section>

        <footer className="py-8 text-center text-xs text-slate-600">
          ConceptLab AI · Explore. Experiment. Understand.
        </footer>
      </div>
    </main>
  )
}
