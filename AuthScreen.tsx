import { FormEvent, useState } from "react";
import { Atom, Eye, EyeOff, LockKeyhole, Mail, UserRound } from "lucide-react";
import { supabase } from "./supabaseClient";

type Mode = "login" | "signup";

export default function AuthScreen() {
  const [mode, setMode] = useState<Mode>("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");
    setError("");
    try {
      if (mode === "signup") {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: { data: { full_name: name.trim() } },
        });
        if (signUpError) throw signUpError;
        if (data.session) {
          setMessage("Account created! Opening your learning dashboard…");
        } else {
          setMessage("Account created. Check your email for the confirmation link, then return here to log in.");
          setMode("login");
        }
      } else {
        const { error: loginError } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });
        if (loginError) throw loginError;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-glow auth-glow-one" /><div className="auth-glow auth-glow-two" />
      <section className="auth-card">
        <div className="auth-brand"><span className="auth-brand-icon"><Atom size={23} /></span><span>ConceptLab <b>AI</b></span></div>
        <div className="auth-eyebrow">YOUR PERSONAL SCIENCE EXPLORER</div>
        <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p className="auth-subtitle">{mode === "login" ? "Sign in to continue exploring ideas in 3D." : "Join ConceptLab AI and start exploring science."}</p>

        <div className="auth-tabs">
          <button type="button" className={mode === "login" ? "active" : ""} onClick={() => { setMode("login"); setError(""); setMessage(""); }}>Log in</button>
          <button type="button" className={mode === "signup" ? "active" : ""} onClick={() => { setMode("signup"); setError(""); setMessage(""); }}>Sign up</button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "signup" && <label className="auth-label">Full name<div className="auth-input-wrap"><UserRound size={17}/><input autoComplete="name" value={name} onChange={e=>setName(e.target.value)} placeholder="Your name" required maxLength={80}/></div></label>}
          <label className="auth-label">Email address<div className="auth-input-wrap"><Mail size={17}/><input type="email" autoComplete="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" required/></div></label>
          <label className="auth-label">Password<div className="auth-input-wrap"><LockKeyhole size={17}/><input type={showPassword ? "text" : "password"} autoComplete={mode === "login" ? "current-password" : "new-password"} value={password} onChange={e=>setPassword(e.target.value)} placeholder={mode === "signup" ? "At least 6 characters" : "Enter your password"} minLength={6} required/><button className="show-password" type="button" aria-label={showPassword ? "Hide password" : "Show password"} onClick={()=>setShowPassword(v=>!v)}>{showPassword ? <EyeOff size={17}/> : <Eye size={17}/>}</button></div></label>
          {error && <div className="auth-alert auth-error" role="alert">{error}</div>}
          {message && <div className="auth-alert auth-success" role="status">{message}</div>}
          <button className="auth-submit" type="submit" disabled={busy}>{busy ? "Please wait…" : mode === "login" ? "Log in to ConceptLab" : "Create account"}<span>↗</span></button>
        </form>
        <div className="auth-privacy"><LockKeyhole size={13}/> Your password is securely handled by Supabase Authentication.</div>
      </section>
      <p className="auth-bottom">LEARN · EXPERIMENT · DISCOVER</p>
    </main>
  );
}
