import { FormEvent, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Html } from "@react-three/drei";
import { Activity, Atom, BookOpen, FlaskConical, Lightbulb, Play, RotateCcw, Search, Sparkles } from "lucide-react";
import * as THREE from "three";
import "./index.css";

type Topic = {
  id: string;
  title: string;
  category: string;
  subtitle: string;
  summary: string;
  how: string[];
  practicalTitle: string;
  materials: string[];
  steps: string[];
  observation: string;
  safety: string;
  controls: { label: string; min: number; max: number; step: number; initial: number; unit: string }[];
};

const topics: Topic[] = [
  {
    id: "motor", title: "Electric Motor", category: "Physics", subtitle: "How electricity creates motion",
    summary: "An electric motor changes electrical energy into mechanical energy. Current flowing through a coil creates a magnetic effect. The magnetic field interacts with magnets, producing a turning force called torque.",
    how: ["A battery supplies electric current to the coil.", "Current in the coil creates a magnetic field around it.", "The coil's field interacts with the permanent magnet's field.", "The resulting turning force rotates the coil. A real DC motor uses a commutator to keep the rotation going."],
    practicalTitle: "Explore a simple motor", materials: ["Low-voltage battery pack", "Insulated copper wire", "Small permanent magnet", "Motor holder or safe classroom motor kit"],
    steps: ["Use a purpose-made low-voltage classroom motor kit and follow its instructions.", "Observe the rotor before switching the power on.", "Switch on the low-voltage supply and watch the rotor turn.", "Change the supply only within the kit's rated range and compare the speed."],
    observation: "The rotor turns when current flows. Changing current can change motor torque and speed, depending on the motor and load.",
    safety: "Use only a low-voltage classroom kit. Do not connect the coil directly to mains electricity; coils and batteries can heat up.",
    controls: [{label:"Current",min:0.2,max:2,step:0.1,initial:1,unit:" A"},{label:"Magnetic field",min:0.2,max:1.5,step:0.1,initial:0.8,unit:" T"}]
  },
  {
    id: "solar", title: "Solar System", category: "Space Science", subtitle: "Explore planets orbiting the Sun",
    summary: "The Solar System contains the Sun and objects held by its gravity, including eight planets. The planets orbit the Sun on paths that are close to elliptical. The model here is simplified and not to scale.",
    how: ["The Sun contains most of the Solar System's mass.", "Its gravity keeps planets in orbit.", "Planets move forward while gravity continually changes their direction.", "Each planet has its own orbital period and distance from the Sun."],
    practicalTitle: "Model planetary orbits", materials: ["A lamp to represent the Sun", "Small balls of different sizes", "String or chalk to mark orbit paths", "Notebook for observations"],
    steps: ["Place the lamp in the centre of a clear space.", "Mark several circular paths around it to represent simplified orbits.", "Move small balls along different paths at different speeds.", "Discuss why this classroom model does not reproduce real gravity or planetary scale."],
    observation: "In the model, planets closer to the Sun are shown moving around a smaller path. Real orbital speeds and distances vary by planet.",
    safety: "Keep walkways clear and do not look directly into a bright lamp.",
    controls: [{label:"Orbit speed",min:0.2,max:2,step:0.1,initial:1,unit:"×"},{label:"Planet scale",min:0.5,max:1.5,step:0.1,initial:1,unit:"×"}]
  },
  {
    id: "water", title: "Water Cycle", category: "Earth Science", subtitle: "How water moves through the environment",
    summary: "The water cycle is the continuous movement of water between Earth's surface and the atmosphere. Sunlight helps water evaporate, water vapour cools and condenses into droplets, and precipitation returns water to the ground.",
    how: ["Sunlight warms water and causes evaporation.", "Water vapour rises and cools.", "Condensation forms tiny droplets in clouds.", "Precipitation falls as rain or snow; water collects in rivers, lakes, and oceans."],
    practicalTitle: "Make a mini water-cycle model", materials: ["Clear resealable bag", "A little water", "Blue food colouring (optional)", "Tape and a sunny window"],
    steps: ["Add a small amount of water to the bag and seal it carefully.", "Tape it upright to a sunny window.", "Observe droplets forming on the inside over time.", "Record how warming, evaporation, and condensation are represented."],
    observation: "Water droplets can appear on the inside of the bag as water evaporates and then condenses on a cooler surface.",
    safety: "Keep water away from electrical sockets and do not drink the experiment water.",
    controls: [{label:"Sunlight / heating",min:0,max:100,step:5,initial:60,unit:"%"},{label:"Cooling",min:0,max:100,step:5,initial:40,unit:"%"}]
  },
  {
    id: "photosynthesis", title: "Photosynthesis", category: "Biology", subtitle: "How plants make food using light",
    summary: "Photosynthesis is the process plants use to make glucose from carbon dioxide and water using light energy. Chlorophyll in chloroplasts absorbs light. Oxygen is released as a by-product.",
    how: ["Roots absorb water and transport it through the plant.", "Leaves take in carbon dioxide through tiny openings called stomata.", "Chlorophyll captures light energy.", "The plant uses that energy to make glucose and releases oxygen."],
    practicalTitle: "Observe photosynthesis", materials: ["A healthy leafy plant", "A sunny window or plant lamp", "Notebook", "Optional: aquatic plant and teacher-supervised setup"],
    steps: ["Place a healthy plant in a bright location and another similar plant in indirect light, if available.", "Keep watering and other conditions as similar as possible.", "Observe and record changes over several days.", "Discuss why a short observation cannot isolate light as the only factor."],
    observation: "Light is one important factor affecting photosynthesis. Plant growth also depends on water, carbon dioxide, temperature, and plant health.",
    safety: "Do not eat experimental plants. Wash hands after handling soil or plant material.",
    controls: [{label:"Light intensity",min:0,max:100,step:5,initial:70,unit:"%"},{label:"CO₂ availability",min:0,max:100,step:5,initial:50,unit:"%"}]
  },
  {
    id: "atom", title: "Atomic Structure", category: "Chemistry", subtitle: "Explore a simplified atom",
    summary: "An atom has a tiny nucleus containing protons and usually neutrons, with electrons described by quantum states around it. The orbit-like paths in this visualization are only a teaching illustration; electrons do not travel in neat planetary tracks.",
    how: ["Protons have a positive electric charge.", "Neutrons have no electric charge and help make up the nucleus.", "Electrons have a negative charge and occupy quantum states.", "The number of protons identifies the element."],
    practicalTitle: "Build an atom model", materials: ["Small beads in two colours", "Paper or a board", "String or markers", "Element information from a trusted textbook"],
    steps: ["Choose a simple element, such as carbon.", "Use one colour for protons and another for neutrons in the nucleus.", "Use small tokens to represent electrons outside the nucleus.", "Label the model and explain its limitations."],
    observation: "The number of protons defines the element. Different isotopes of the same element can have different numbers of neutrons.",
    safety: "Use small craft parts carefully and keep them away from young children and pets.",
    controls: [{label:"Electron animation",min:0,max:2,step:0.1,initial:1,unit:"×"},{label:"Nucleus scale",min:0.7,max:1.6,step:0.1,initial:1,unit:"×"}]
  }
];

function MotorModel({ speed, field }: { speed: number; field: number }) {
  const rotor = useRef<THREE.Group>(null);
  useFrame((_, delta) => {
    if (rotor.current) rotor.current.rotation.z += delta * speed * field * 1.4;
  });
  return <group>
    <mesh position={[-1.7, 0, 0]}><boxGeometry args={[0.22, 2.1, 0.5]} /><meshStandardMaterial color="#ff6b6b" /></mesh>
    <mesh position={[1.7, 0, 0]}><boxGeometry args={[0.22, 2.1, 0.5]} /><meshStandardMaterial color="#60a5fa" /></mesh>
    <group ref={rotor}>
      <mesh><boxGeometry args={[2.1, 0.12, 0.18]} /><meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.25} /></mesh>
      <mesh><boxGeometry args={[0.12, 1.6, 0.18]} /><meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.25} /></mesh>
      <mesh position={[0, 0.82, 0]}><sphereGeometry args={[0.13, 20, 20]} /><meshStandardMaterial color="#fde68a" /></mesh>
      <mesh position={[0, -0.82, 0]}><sphereGeometry args={[0.13, 20, 20]} /><meshStandardMaterial color="#fde68a" /></mesh>
    </group>
    <mesh rotation={[Math.PI / 2, 0, 0]}><cylinderGeometry args={[0.08,0.08,2.8,24]} /><meshStandardMaterial color="#cbd5e1" metalness={0.8} /></mesh>
    <Html position={[-1.7, 1.25, 0]} center><span className="model-label red">N</span></Html>
    <Html position={[1.7, 1.25, 0]} center><span className="model-label blue">S</span></Html>
  </group>;
}
function SolarModel({ speed, scale }: { speed: number; scale: number }) {
  return <group>
    <mesh><sphereGeometry args={[0.65, 32, 32]} /><meshStandardMaterial color="#fbbf24" emissive="#f59e0b" emissiveIntensity={1.1} /></mesh>
    {[1.35,2.05,2.8].map((r)=><mesh key={r} rotation={[Math.PI/2,0,0]}><torusGeometry args={[r,0.008,8,100]} /><meshBasicMaterial color="#64748b" /></mesh>)}
    <PlanetOrbit radius={1.35} size={0.15*scale} color="#7dd3fc" speed={speed*0.8} />
    <PlanetOrbit radius={2.05} size={0.22*scale} color="#fb923c" speed={speed*0.48} />
    <PlanetOrbit radius={2.8} size={0.18*scale} color="#a78bfa" speed={speed*0.3} />
    <Stars radius={30} depth={5} count={500} factor={2} fade />
  </group>;
}
function PlanetOrbit({radius,size,color,speed}:{radius:number;size:number;color:string;speed:number}) {
  const orbit = useRef<THREE.Group>(null);
  useFrame((_,delta)=>{ if(orbit.current) orbit.current.rotation.y += delta*speed*0.45; });
  return <group ref={orbit}>
    <mesh position={[radius,0,0]}><sphereGeometry args={[size,24,24]} /><meshStandardMaterial color={color} roughness={0.8} /></mesh>
  </group>;
}
function WaterModel({ heat, cooling }: { heat:number; cooling:number }) {
  const bubbles = Array.from({length:12},(_,i)=>i);
  return <group>
    <mesh position={[0,-0.85,0]}><boxGeometry args={[3.6,0.25,1.5]} /><meshStandardMaterial color="#0ea5e9" transparent opacity={0.8} /></mesh>
    <mesh position={[0,0.15,0]}><boxGeometry args={[3.6,1.5,0.12]} /><meshStandardMaterial color="#38bdf8" transparent opacity={0.12} /></mesh>
    {bubbles.map((n)=><mesh key={n} position={[-1.5+(n%6)*0.6,-0.6+((n*7)%10)/10*(heat/100)*1.7,0.2]}><sphereGeometry args={[0.045+(n%3)*0.012,12,12]} /><meshStandardMaterial color="#bae6fd" emissive="#38bdf8" emissiveIntensity={cooling/100} /></mesh>)}
    <mesh position={[0,1.35,0]}><sphereGeometry args={[0.72,24,24]} /><meshStandardMaterial color="#e0f2fe" transparent opacity={0.45} /></mesh>
    <Html position={[0,2.2,0]} center><span className="model-label">Condensation</span></Html>
    <Html position={[0,-1.2,0]} center><span className="model-label">Collection</span></Html>
  </group>;
}
function PlantModel({ light, co2 }: { light:number; co2:number }) {
  const leaves = Array.from({length:6},(_,i)=>i);
  return <group>
    <mesh position={[0,-0.85,0]}><cylinderGeometry args={[0.55,0.7,0.4,24]} /><meshStandardMaterial color="#92400e" /></mesh>
    <mesh position={[0,-0.05,0]}><cylinderGeometry args={[0.07,0.1,1.7,12]} /><meshStandardMaterial color="#65a30d" /></mesh>
    {leaves.map((i)=><mesh key={i} position={[Math.cos(i*Math.PI/3)*0.55,0.35+Math.sin(i*2)*0.35,0]} rotation={[0,0,Math.cos(i*Math.PI/3)*0.65]} scale={[1+light/180,0.45,0.12]}><sphereGeometry args={[0.48,20,16]} /><meshStandardMaterial color={co2>40?"#4ade80":"#84cc16"} roughness={0.8} /></mesh>)}
    <pointLight position={[-1.5,1.8,1]} color="#fde68a" intensity={light/30} distance={5} />
    <Html position={[0,1.8,0]} center><span className="model-label">Light + CO₂</span></Html>
  </group>;
}
function AtomModel({ speed, nucleusScale }: { speed:number; nucleusScale:number }) {
  const electron1 = useRef<THREE.Group>(null);
  const electron2 = useRef<THREE.Group>(null);
  useFrame((_,delta)=>{
    if(electron1.current) electron1.current.rotation.y += delta*speed;
    if(electron2.current) electron2.current.rotation.x += delta*speed*0.7;
  });
  return <group>
    <mesh><sphereGeometry args={[0.36*nucleusScale,24,24]} /><meshStandardMaterial color="#f97316" emissive="#7c2d12" emissiveIntensity={0.35} /></mesh>
    {Array.from({length:6},(_,i)=><mesh key={i} position={[Math.cos(i*Math.PI/3)*0.24*nucleusScale,Math.sin(i*Math.PI/3)*0.24*nucleusScale,0.18]}><sphereGeometry args={[0.11,16,16]} /><meshStandardMaterial color={i%2?"#fca5a5":"#fdba74"} /></mesh>)}
    <group ref={electron1}>
      <mesh rotation={[Math.PI/2,0.3,0]}><torusGeometry args={[1.25,0.012,8,100]} /><meshBasicMaterial color="#64748b" /></mesh>
      <mesh position={[1.25,0,0]}><sphereGeometry args={[0.12,18,18]} /><meshStandardMaterial color="#60a5fa" /></mesh>
    </group>
    <group ref={electron2} rotation={[0.8,0.3,0]}>
      <mesh rotation={[Math.PI/2,0,0]}><torusGeometry args={[1.55,0.012,8,100]} /><meshBasicMaterial color="#64748b" /></mesh>
      <mesh position={[0,1.55,0]}><sphereGeometry args={[0.12,18,18]} /><meshStandardMaterial color="#60a5fa" /></mesh>
    </group>
    <Html position={[0,-1.9,0]} center><span className="model-label">Simplified atom model</span></Html>
  </group>;
}
function Scene({ topic, values, playing }: { topic:Topic; values:number[]; playing:boolean }) {
  const [a,b] = values;
  return <Canvas camera={{position:[0,1.1,5.5], fov:45}} dpr={[1,2]}>
    <color attach="background" args={["#08111f"]} />
    <ambientLight intensity={0.8} />
    <directionalLight position={[4,5,5]} intensity={2.1} />
    <pointLight position={[-4,1,2]} intensity={0.7} color="#22d3ee" />
    {topic.id==="motor" && <MotorModel speed={playing?a:0} field={b} />}
    {topic.id==="solar" && <SolarModel speed={playing?a:0} scale={b} />}
    {topic.id==="water" && <WaterModel heat={a} cooling={b} />}
    {topic.id==="photosynthesis" && <PlantModel light={a} co2={b} />}
    {topic.id==="atom" && <AtomModel speed={playing?a:0} nucleusScale={b} />}
    <OrbitControls enablePan={false} minDistance={3} maxDistance={10} />
  </Canvas>;
}

export default function App() {
  const [topicId,setTopicId] = useState("motor");
  const [prompt,setPrompt] = useState("");
  const [activeTopic,setActiveTopic] = useState<Topic>(topics[0]);
  const [values,setValues] = useState<number[]>(topics[0].controls.map(c=>c.initial));
  const [playing,setPlaying] = useState(true);
  const [tab,setTab] = useState<"learn"|"lab">("learn");
  const [quizAnswer,setQuizAnswer] = useState("");
  const [showQuiz,setShowQuiz] = useState(false);
  const topic = activeTopic;

  function selectTopic(next: Topic) {
    setTopicId(next.id); setActiveTopic(next); setPrompt(next.title);
    setValues(next.controls.map(c=>c.initial)); setQuizAnswer(""); setShowQuiz(false);
  }
  function submitPrompt(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const q = prompt.trim().toLowerCase();
    if (!q) return;
    const found = topics.find(t => t.title.toLowerCase().includes(q) || q.includes(t.title.toLowerCase()) ||
      (t.id==="motor" && /motor|magnet|electricity|electromagnet|current/.test(q)) ||
      (t.id==="solar" && /solar|planet|space|orbit|sun/.test(q)) ||
      (t.id==="water" && /water|rain|cloud|evapor|condens/.test(q)) ||
      (t.id==="photosynthesis" && /plant|photo|leaf|chlorophyll|biology/.test(q)) ||
      (t.id==="atom" && /atom|electron|proton|neutron|chemistry/.test(q)));
    if (found) selectTopic(found);
    else {
      setActiveTopic({...topics[0], title:prompt.trim(), subtitle:"Demo mode: closest available interactive lesson", summary:`This demo does not use a live AI service, so it cannot create a fully accurate lesson for “${prompt.trim()}” yet. Below is a sample physics lesson. Choose one of the supported topics to see a matching explanation, 3D model, and practical activity.`, how:["Start by defining the topic and identifying its main parts.","Find the process or rule that connects those parts.","Observe how changing one factor affects the result.","Compare your observation with a trusted textbook or teacher explanation."], practicalTitle:"A general observation activity", materials:["Notebook and pencil","Relevant classroom model or teacher-approved demonstration","Textbook or class notes"], steps:["Write one question you want to answer about the topic.","Record what you expect to happen and why.","Use a teacher-approved model or demonstration to observe the process.","Write down the result and compare it with your prediction."], observation:"The result depends on the actual topic and setup. This general activity is a planning template, not a topic-specific experiment.", safety:"Ask a teacher or trusted adult before trying unfamiliar experiments, especially those involving electricity, heat, chemicals, tools, or living things.", controls:topics[0].controls});
      setTopicId("motor"); setValues(topics[0].controls.map(c=>c.initial)); setShowQuiz(false);
    }
    setTab("learn");
  }
  const metric = useMemo(() => {
    if (topic.id==="motor") return `${(values[0]*values[1]).toFixed(2)} relative torque`;
    if (topic.id==="solar") return `${(values[0]*100).toFixed(0)}% orbit animation`;
    if (topic.id==="water") return `${Math.round((values[0]+values[1])/2)}% cycle settings`;
    if (topic.id==="photosynthesis") return `${Math.round(values[0]*values[1]/100)} relative factor`;
    return `${values[0].toFixed(1)}× animation`;
  },[topic,values]);

  return <div className="app-shell">
    <header className="topbar">
      <a className="brand" href="#"><span className="brand-icon"><Atom size={22}/></span><span>ConceptLab <b>AI</b><small>INTERACTIVE LEARNING STUDIO</small></span></a>
      <div className="status"><span className="status-dot"/> DEMO MODE <span className="top-divider"/> <span>NO API KEY NEEDED</span></div>
    </header>
    <main className="page">
      <section className="hero">
        <div className="eyebrow"><Sparkles size={14}/> LEARN BY EXPLORING</div>
        <h1>Big ideas. <span>Hands-on understanding.</span></h1>
        <p>Enter a topic to explore a simple explanation, interactive 3D model, and a practical activity.</p>
        <form className="prompt-form" onSubmit={submitPrompt}>
          <Search size={19} className="search-icon"/>
          <input value={prompt} onChange={e=>setPrompt(e.target.value)} placeholder="Try “How does an electric motor work?”" aria-label="Enter a learning topic"/>
          <button type="submit">Explore topic <span>↗</span></button>
        </form>
        <div className="suggestions"><span>TRY A TOPIC</span>{topics.map(t=><button key={t.id} onClick={()=>selectTopic(t)} className={topicId===t.id?"selected":""}>{t.title}</button>)}</div>
      </section>

      <section className="lesson-heading">
        <div><div className="eyebrow">{topic.category.toUpperCase()} <span className="tiny-dot"/> INTERACTIVE LESSON</div><h2>{topic.title}</h2><p>{topic.subtitle}</p></div>
        <div className="lesson-actions"><button className="secondary-button" onClick={()=>{setValues(topic.controls.map(c=>c.initial));setPlaying(true);}}><RotateCcw size={15}/> Reset</button><button className="primary-button" onClick={()=>setTab(tab==="learn"?"lab":"learn")}><FlaskConical size={16}/> {tab==="learn"?"Open practical lab":"Back to lesson"}</button></div>
      </section>

      <div className="workspace">
        <section className="visual-card">
          <div className="card-header"><div><span className="live-dot"/> LIVE 3D VIEW</div><span className="drag-hint">Drag to rotate · Scroll to zoom</span></div>
          <div className="canvas-wrap"><Scene topic={topic} values={values} playing={playing}/><div className="model-chip"><span/> {topic.title.toUpperCase()} MODEL</div></div>
          <div className="model-footer"><div><span className="mini-label">SIMULATION STATUS</span><strong>{playing?"Animation running":"Animation paused"}</strong></div><button className="play-button" onClick={()=>setPlaying(!playing)}><Play size={15} fill="currentColor"/> {playing?"Pause motion":"Resume motion"}</button></div>
          <div className="controls-area"><div className="section-title"><Activity size={16}/> EXPERIMENT CONTROLS <span>Adjust and observe</span></div>
            {topic.controls.map((c,i)=><div className="range-control" key={c.label}><div className="range-label"><label>{c.label}</label><b>{values[i]}{c.unit}</b></div><input type="range" min={c.min} max={c.max} step={c.step} value={values[i]} onChange={e=>setValues(old=>old.map((v,j)=>j===i?Number(e.target.value):v))}/><div className="range-limits"><span>{c.min}{c.unit}</span><span>{c.max}{c.unit}</span></div></div>)}
            <div className="metric"><span>MODEL INDICATOR</span><strong>{metric}</strong><small>Illustrative values, not laboratory measurements</small></div>
          </div>
        </section>

        <section className="info-column">
          <div className="info-card explanation-card">
            <div className="card-header"><div><BookOpen size={16}/> THE CONCEPT</div><span className="tag">PLAIN ENGLISH</span></div>
            <p className="summary">{topic.summary}</p>
            <h3>How it works</h3>
            <ol className="steps-list">{topic.how.map((step,i)=><li key={step}><span>{String(i+1).padStart(2,"0")}</span><p>{step}</p></li>)}</ol>
          </div>
          <div className="info-card lab-card">
            <div className="card-header"><div><FlaskConical size={16}/> PRACTICAL CONNECTION</div><span className="tag teal">TRY IT SAFELY</span></div>
            <h3>{topic.practicalTitle}</h3>
            <div className="subheading">WHAT YOU NEED</div>
            <div className="materials">{topic.materials.map(m=><span key={m}>+ {m}</span>)}</div>
            <div className="subheading">METHOD</div>
            <ol className="practical-steps">{topic.steps.map((s,i)=><li key={s}><span>{i+1}</span>{s}</li>)}</ol>
            <div className="observation"><Lightbulb size={17}/><div><b>What to observe</b><p>{topic.observation}</p></div></div>
            <div className="safety-note"><b>Safety note</b><p>{topic.safety}</p></div>
          </div>
          <div className="info-card quiz-card">
            <div className="card-header"><div><Sparkles size={16}/> QUICK CHECK</div><span className="tag">SELF-TEST</span></div>
            <p className="quiz-question">{topic.id==="motor"?"What does an electric motor convert?":topic.id==="solar"?"What keeps planets in orbit around the Sun?":topic.id==="water"?"What is condensation?":topic.id==="photosynthesis"?"What energy source powers photosynthesis?":"Which particle determines an element's identity?"}</p>
            <div className="quiz-options">{(topic.id==="motor"?["Mechanical energy into electricity","Electrical energy into motion","Light into sound"]:topic.id==="solar"?["Gravity","Wind in space","Magnetic poles only"]:topic.id==="water"?["Liquid water becoming vapour","Water vapour cooling into droplets","Rain soaking into soil"]:topic.id==="photosynthesis"?["Light energy","Sound energy","Moonlight only"]:["Neutrons","Protons","Electrons"]).map(answer=><button key={answer} className={quizAnswer===answer?"chosen":""} onClick={()=>{setQuizAnswer(answer);setShowQuiz(true);}}>{answer}</button>)}</div>
            {showQuiz&&<div className={quizAnswer===(topic.id==="motor"?"Electrical energy into motion":topic.id==="solar"?"Gravity":topic.id==="water"?"Water vapour cooling into droplets":topic.id==="photosynthesis"?"Light energy":"Protons")?"quiz-feedback correct":"quiz-feedback"}>{quizAnswer===(topic.id==="motor"?"Electrical energy into motion":topic.id==="solar"?"Gravity":topic.id==="water"?"Water vapour cooling into droplets":topic.id==="photosynthesis"?"Light energy":"Protons")?"Correct! Well done.":"Not quite—try another answer. Review the explanation above."}</div>}
          </div>
        </section>
      </div>
      <footer><div className="brand small-brand"><span className="brand-icon"><Atom size={18}/></span><span>ConceptLab <b>AI</b></span></div><p>Learning demo · Explanations and models are simplified for education.</p><span>BUILT TO EXPLORE</span></footer>
    </main>
  </div>;
}
