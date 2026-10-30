import React, { useEffect, useRef, useState } from "react";
import { Link, NavLink, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowRight, Award, BookOpen, CheckCircle2, ChevronRight, Clock3,
  GraduationCap, LayoutDashboard, LogIn, Menu, ShieldCheck, Sparkles,
  Users, X, Mail, Lock, UserRound, BookMarked, ClipboardList, Settings,
  LogOut, Plus, Search, CircleDollarSign, Sun, Moon, Monitor, RefreshCw
} from "lucide-react";
import { supabase, supabaseReady } from "./supabase";

const courses = [
  { title: "Graphic Design", category: "Design & Creativity", fee: 7000, duration: "6 weeks", description: "Learn visual communication, layout, typography, branding and practical design workflows." },
  { title: "AI Video Creation", category: "AI & Technology", fee: 5000, duration: "4 weeks", description: "Create engaging videos with modern AI tools, prompting techniques and creative workflows." },
  { title: "Video Editing", category: "Media Production", fee: 15000, duration: "8 weeks", description: "Edit polished videos, tell stronger stories and build a practical editing workflow." },
  { title: "Prompt Engineering", category: "AI & Technology", fee: null, duration: "Coming soon", description: "Learn to communicate clearly with AI tools and build repeatable prompt workflows." },
  { title: "Social Media Management", category: "Digital Business", fee: null, duration: "Coming soon", description: "Plan content, manage platforms and develop effective social media strategies." },
  { title: "Virtual Assistant", category: "Digital Business", fee: null, duration: "Coming soon", description: "Build the organization, communication and digital skills needed to support businesses." },
  { title: "Email Marketing", category: "Digital Business", fee: null, duration: "Coming soon", description: "Understand email campaigns, audience building and customer communication." },
  { title: "Affiliate Marketing", category: "Digital Business", fee: null, duration: "Coming soon", description: "Explore affiliate business models, audience development and ethical promotion." }
];

const money = n => n == null ? "Coming soon" : `₦${Number(n).toLocaleString("en-NG")}`;
const initial = name => (name || "Student").trim().split(/\s+/).map(x => x[0]).slice(0,2).join("").toUpperCase();

function Brand({ light=false }) {
  return <Link className={`brand ${light ? "brand-light" : ""}`} to="/" aria-label="Krevian Academy home">
    <img src={light ? "/krevian-logo-white.png" : "/krevian-logo-purple.png"} alt="Krevian Academy" />
  </Link>;
}
function ThemeToggle({themeMode,onToggle}) {
  const Icon = themeMode === "dark" ? Moon : themeMode === "light" ? Sun : Monitor;
  const label = themeMode === "system" ? "Theme: device setting" : `Theme: ${themeMode}`;
  return <button className="theme-toggle" onClick={onToggle} aria-label={`${label}. Change theme`} title={`${label} · tap to change`}><Icon size={17}/><span>{themeMode === "system" ? "Auto" : themeMode === "dark" ? "Dark" : "Light"}</span></button>;
}
function Header({ user, profile, onLogout, themeMode, onThemeToggle }) {
  const [open,setOpen] = useState(false);
  return <header className="site-header">
    <div className="container nav-wrap">
      <Brand />
      <div className="nav-actions"><ThemeToggle themeMode={themeMode} onToggle={onThemeToggle}/><button className="mobile-menu" onClick={()=>setOpen(!open)} aria-label="Toggle menu">{open?<X/>:<Menu/>}</button></div>
      <nav className={open?"nav-links show":"nav-links"}>
        <NavLink to="/" onClick={()=>setOpen(false)}>Home</NavLink>
        <a href="/#courses" onClick={()=>setOpen(false)}>Courses</a>
        <a href="/#about" onClick={()=>setOpen(false)}>About</a>
        {user ? <>
          <Link to={profile?.role==="admin"?"/admin":"/student"} className="nav-dashboard" onClick={()=>setOpen(false)}>Dashboard</Link>
          <button className="nav-login" onClick={onLogout}>Sign out</button>
        </> : <>
          <Link to="/login" className="nav-login" onClick={()=>setOpen(false)}>Log in</Link>
          <Link to="/apply" className="btn btn-gold btn-small" onClick={()=>setOpen(false)}>Apply now <ArrowRight size={15}/></Link>
        </>}
      </nav>
    </div>
  </header>;
}
function Footer() {
  return <footer className="footer"><div className="container footer-grid">
    <div><Brand light/><p>Practical digital skills. Creative confidence. New opportunities.</p></div>
    <div><b>Explore</b><a href="/#courses">Our courses</a><Link to="/apply">Apply to study</Link><Link to="/login">Student login</Link></div>
    <div><b>Contact</b><a href="mailto:hello@krevianacademy.com">hello@krevianacademy.com</a><span>Online learning · Nigeria</span></div>
  </div><div className="container footer-bottom">© {new Date().getFullYear()} Krevian Academy. All rights reserved.</div></footer>;
}
function CourseCard({course}) {
  return <article className="course-card">
    <div className="course-icon"><BookOpen size={22}/></div>
    <span className="eyebrow">{course.category}</span>
    <h3>{course.title}</h3><p>{course.description}</p>
    <div className="course-meta"><span><Clock3 size={15}/>{course.duration}</span><strong>{money(course.fee)}</strong></div>
    {course.fee ? <Link className="course-link" to={`/apply?course=${encodeURIComponent(course.title)}`}>Apply for this course <ArrowRight size={16}/></Link> : <span className="coming">Enrollment opening soon</span>}
  </article>;
}
function Home() {
  return <>
    <section className="hero"><div className="container hero-grid">
      <div className="hero-copy"><span className="pill"><Sparkles size={14}/> YOUR NEXT CHAPTER STARTS HERE</span>
        <h1>Learn skills.<br/><em>Create value.</em><br/>Build your future.</h1>
        <p>At Krevian Academy, we help you develop practical digital skills, grow your confidence and prepare for opportunities in a changing world.</p>
        <div className="hero-actions"><Link to="/apply" className="btn btn-gold">Start your application <ArrowRight size={17}/></Link><a href="#courses" className="btn btn-outline">Explore courses</a></div>
        <div className="hero-proof"><span><CheckCircle2 size={16}/> Practical learning</span><span><CheckCircle2 size={16}/> Beginner-friendly</span></div>
      </div>
      <div className="hero-art"><div className="art-glow"></div><div className="art-card art-card-main"><img className="hero-brand-logo" src="/krevian-logo-purple.png" alt="Krevian Academy"/><span>YOUR POTENTIAL<br/><b>HAS NO LIMIT.</b></span></div><div className="art-card art-card-note"><GraduationCap/><div><b>Learn something useful.</b><small>Build skills that move you forward.</small></div></div><div className="art-orbit"></div></div>
    </div></section>
    <section className="stats"><div className="container stats-grid"><div><b>Practical</b><span>Skill-focused training</span></div><div><b>Flexible</b><span>Learn from anywhere</span></div><div><b>Supportive</b><span>Guidance as you grow</span></div><div><b>Purposeful</b><span>Skills for real opportunities</span></div></div></section>
    <section className="section" id="courses"><div className="container"><div className="section-heading"><span className="eyebrow">EXPLORE YOUR OPTIONS</span><h2>Skills that open <em>new doors.</em></h2><p>Choose a learning path that matches your interests and goals.</p></div><div className="course-grid">{courses.map(c=><CourseCard key={c.title} course={c}/>)}</div></div></section>
    <section className="about-section" id="about"><div className="container about-grid"><div className="about-art"><div className="about-badge"><Award size={30}/><b>Learn with purpose</b><span>Grow with confidence</span></div><img className="about-watermark" src="/krevian-logo-white.png" alt=""/></div><div><span className="eyebrow">ABOUT KREVIAN ACADEMY</span><h2>More than learning.<br/><em>A step towards possibility.</em></h2><p>We believe useful skills can create meaningful opportunities. Our learning experience is designed to make digital education approachable, practical and relevant.</p><ul className="check-list"><li><CheckCircle2/> Learn through guided, practical sessions</li><li><CheckCircle2/> Build skills at your own pace</li><li><CheckCircle2/> Get a supportive learning experience</li></ul><Link to="/apply" className="btn btn-purple">Become a student <ArrowRight size={17}/></Link></div></div></section>
    <section className="cta-section"><div className="container cta-inner"><div><span className="eyebrow">READY TO BEGIN?</span><h2>Your next opportunity<br/>could start with one skill.</h2></div><Link to="/apply" className="btn btn-gold">Apply to Krevian <ArrowRight size={17}/></Link></div></section>
  </>;
}
function AuthLayout({title,subtitle,children}) {
  return <main className="auth-page"><div className="auth-panel"><Link to="/" className="back-link">← Back to website</Link><Brand/><div className="auth-title"><h1>{title}</h1><p>{subtitle}</p></div>{children}</div><div className="auth-aside"><div className="auth-aside-inner"><span className="eyebrow">KREVIAN ACADEMY</span><h2>Every skill you learn is a step forward.</h2><p>Build your confidence. Discover your potential. Prepare for what's next.</p><img className="auth-aside-mark" src="/krevian-logo-white.png" alt="Krevian Academy"/></div></div></main>;
}
function Login({onLogin}) {
  const [email,setEmail]=useState(""),[password,setPassword]=useState(""),[busy,setBusy]=useState(false),[error,setError]=useState("");
  async function submit(e){e.preventDefault();setBusy(true);setError("");const result=await onLogin(email,password);if(result?.error)setError(result.error);setBusy(false);}
  return <AuthLayout title="Welcome back" subtitle="Log in to continue your learning journey."><form className="form" onSubmit={submit}><label>Email address<input type="email" required value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com"/></label><label>Password<input type="password" required value={password} onChange={e=>setPassword(e.target.value)} placeholder="Enter your password"/></label>{error&&<div className="alert error">{error}</div>}<button className="btn btn-purple full" disabled={busy}>{busy?"Signing in...":"Log in"} <ArrowRight size={16}/></button><p className="form-foot">New to Krevian? <Link to="/signup">Create an account</Link></p></form></AuthLayout>;
}

function Signup() {
  const [form,setForm]=useState({full_name:"",email:"",password:""});
  const [busy,setBusy]=useState(false),[message,setMessage]=useState(null);
  const update=e=>setForm({...form,[e.target.name]:e.target.value});
  async function submit(e){
    e.preventDefault(); setBusy(true); setMessage(null);
    if(!supabaseReady){setMessage({type:"error",text:"Connect Supabase first using the setup guide."});setBusy(false);return;}
    const {data,error}=await supabase.auth.signUp({
      email:form.email,password:form.password,
      options:{data:{full_name:form.full_name}}
    });
    if(error){setMessage({type:"error",text:error.message});}
    else {
      if(data.user && data.session){
        await supabase.from("profiles").upsert({id:data.user.id,email:data.user.email,full_name:form.full_name,role:"student"});
      }
      setMessage({type:"success",text:data.session?"Your account has been created. You can now access your student portal.":"Your account has been created. Check your email to confirm your address, then log in."});
      setForm({full_name:"",email:"",password:""});
    }
    setBusy(false);
  }
  return <AuthLayout title="Create your account" subtitle="Register to access your Krevian Academy student portal.">
    <form className="form" onSubmit={submit}>
      <label>Full name<input name="full_name" value={form.full_name} onChange={update} required placeholder="Your full name"/></label>
      <label>Email address<input name="email" type="email" value={form.email} onChange={update} required placeholder="you@example.com"/></label>
      <label>Create password<input name="password" type="password" value={form.password} onChange={update} required minLength="8" placeholder="At least 8 characters"/></label>
      {message&&<div className={`alert ${message.type}`}>{message.text}</div>}
      <button className="btn btn-purple full" disabled={busy}>{busy?"Creating account...":"Create student account"} <ArrowRight size={16}/></button>
      <p className="form-foot">Already registered? <Link to="/login">Log in</Link></p>
    </form>
  </AuthLayout>;
}

function Apply() {
  const [form,setForm]=useState({full_name:"",email:"",phone:"",course:"",experience:"",reason:""});
  const [busy,setBusy]=useState(false),[message,setMessage]=useState(null);
  const update=e=>setForm({...form,[e.target.name]:e.target.value});
  async function submit(e){e.preventDefault();setBusy(true);setMessage(null);
    if(!supabaseReady){setMessage({type:"error",text:"The application portal is not connected yet. Please configure Supabase using the setup guide before accepting applications."});setBusy(false);return;}
    const {error}=await supabase.from("applications").insert({...form,status:"pending"});
    setMessage(error?{type:"error",text:error.message}:{type:"success",text:"Your application has been submitted. The academy team will review it and contact you using the details provided."});
    if(!error)setForm({full_name:"",email:"",phone:"",course:"",experience:"",reason:""});setBusy(false);
  }
  return <AuthLayout title="Apply to Krevian" subtitle="Tell us a little about yourself and the course you want to study."><form className="form" onSubmit={submit}>
    <div className="form-two"><label>Full name<input name="full_name" value={form.full_name} onChange={update} required placeholder="Your full name"/></label><label>Phone / WhatsApp<input name="phone" value={form.phone} onChange={update} required placeholder="+234..."/></label></div>
    <label>Email address<input name="email" type="email" value={form.email} onChange={update} required placeholder="you@example.com"/></label>
    <label>Choose a course<select name="course" value={form.course} onChange={update} required><option value="">Select a course</option>{courses.filter(c=>c.fee).map(c=><option key={c.title}>{c.title}</option>)}</select></label>
    <label>Have you studied this skill before?<select name="experience" value={form.experience} onChange={update} required><option value="">Select one</option><option>I'm a complete beginner</option><option>I have some experience</option><option>I'm looking to improve my skills</option></select></label>
    <label>Why do you want to join? <span className="optional">(optional)</span><textarea name="reason" value={form.reason} onChange={update} rows="3" placeholder="Tell us briefly about your goals..."/></label>
    {message&&<div className={`alert ${message.type}`}>{message.text}</div>}
    <button className="btn btn-purple full" disabled={busy}>{busy?"Submitting...":"Submit application"} <ArrowRight size={16}/></button>
    <p className="form-foot">Already have an account? <Link to="/login">Log in</Link></p>
  </form></AuthLayout>;
}
function DashboardShell({user,profile,onLogout,children,admin=false}) {
  return <div className="dashboard"><aside className="sidebar"><Brand light/><div className="side-user"><div className="avatar">{initial(profile?.full_name||user?.email)}</div><div><b>{profile?.full_name||user?.email}</b><small>{admin?"Administrator":"Student"}</small></div></div><nav><span className="side-label">WORKSPACE</span><NavLink end to={admin?"/admin":"/student"}><LayoutDashboard/>Overview</NavLink>{admin?<><NavLink to="/admin/applications"><ClipboardList/>Applications</NavLink><NavLink to="/admin/students"><Users/>Students</NavLink><NavLink to="/admin/courses"><BookOpen/>Courses</NavLink></>:<><NavLink to="/student/courses"><BookMarked/>My learning</NavLink><NavLink to="/student/profile"><UserRound/>My profile</NavLink></>}</nav><button className="side-logout" onClick={onLogout}><LogOut/>Sign out</button></aside><main className="dash-main"><div className="dash-top"><span> KREVIAN ACADEMY / {admin?"ADMIN":"STUDENT"} PORTAL</span><div className="avatar small">{initial(profile?.full_name||user?.email)}</div></div>{children}</main></div>;
}
function StudentDashboard({user,profile}) {
  const [apps,setApps]=useState([]),[loading,setLoading]=useState(true);
  useEffect(()=>{(async()=>{if(supabaseReady&&user){const {data}=await supabase.from("applications").select("*").eq("email",user.email).order("created_at",{ascending:false});setApps(data||[]);}setLoading(false);})();},[user]);
  return <><div className="dash-heading"><div><span className="eyebrow">STUDENT PORTAL</span><h1>Welcome, {(profile?.full_name||user?.email||"Student").split(" ")[0]}.</h1><p>Here's an overview of your learning journey.</p></div><Link to="/apply" className="btn btn-purple btn-small">Apply for a course <Plus size={15}/></Link></div>
    <div className="dash-cards"><div className="dash-card"><span>Applications</span><b>{loading?"—":apps.length}</b><small>Submitted applications</small></div><div className="dash-card"><span>Approved</span><b>{apps.filter(a=>a.status==="approved").length}</b><small>Ready to begin</small></div><div className="dash-card"><span>Learning resources</span><b>—</b><small>Coming with your course</small></div></div>
    <div className="dash-box"><div className="box-heading"><div><h3>My applications</h3><p>Track the status of your course applications.</p></div><ClipboardList/></div>{loading?<p>Loading applications...</p>:apps.length?<div className="table-wrap"><table><thead><tr><th>Course</th><th>Date submitted</th><th>Status</th></tr></thead><tbody>{apps.map(a=><tr key={a.id}><td>{a.course}</td><td>{new Date(a.created_at).toLocaleDateString()}</td><td><span className={`status ${a.status}`}>{a.status}</span></td></tr>)}</tbody></table></div>:<div className="empty"><BookOpen/><b>No applications yet</b><p>Your submitted applications will appear here.</p><Link to="/apply" className="text-link">Explore courses and apply <ArrowRight size={15}/></Link></div>}</div>
  </>;
}
function StudentCourses(){return <><div className="dash-heading"><div><span className="eyebrow">LEARNING</span><h1>Explore courses</h1><p>Discover available learning paths at Krevian Academy.</p></div></div><div className="course-grid">{courses.map(c=><CourseCard key={c.title} course={c}/>)}</div></>}
function Profile({user,profile}){return <><div className="dash-heading"><div><span className="eyebrow">ACCOUNT</span><h1>My profile</h1><p>Your account information.</p></div></div><div className="dash-box profile-box"><div className="avatar big">{initial(profile?.full_name||user?.email)}</div><h3>{profile?.full_name||"Student"}</h3><p>{user?.email}</p><span className="status approved">Student account</span><p className="muted">Profile editing can be enabled in a future release.</p></div></>}
function AdminOverview(){const [apps,setApps]=useState([]),[students,setStudents]=useState(0);useEffect(()=>{if(supabaseReady){supabase.from("applications").select("*").order("created_at",{ascending:false}).then(({data})=>setApps(data||[]));supabase.from("profiles").select("id",{count:"exact",head:true}).then(({count})=>setStudents(count||0));}},[]);return <><div className="dash-heading"><div><span className="eyebrow">ADMINISTRATION</span><h1>Academy overview</h1><p>Monitor applications and student activity.</p></div></div><div className="dash-cards"><div className="dash-card"><span>Total applications</span><b>{apps.length}</b><small>All submitted applications</small></div><div className="dash-card"><span>Registered profiles</span><b>{students}</b><small>Platform accounts</small></div><div className="dash-card"><span>Awaiting review</span><b>{apps.filter(a=>a.status==="pending").length}</b><small>Pending applications</small></div></div><div className="dash-box"><div className="box-heading"><div><h3>Recent applications</h3><p>Latest student submissions.</p></div><Link className="text-link" to="/admin/applications">View all <ArrowRight size={15}/></Link></div><ApplicationsTable rows={apps.slice(0,6)} onChange={setApps}/></div></>}
function ApplicationsTable({rows,onChange}){async function change(id,status){const {error}=await supabase.from("applications").update({status}).eq("id",id);if(!error)onChange(old=>old.map(a=>a.id===id?{...a,status}:a));}return rows.length?<div className="table-wrap"><table><thead><tr><th>Applicant</th><th>Course</th><th>Submitted</th><th>Status</th><th>Action</th></tr></thead><tbody>{rows.map(a=><tr key={a.id}><td><b>{a.full_name}</b><small className="table-sub">{a.email}</small></td><td>{a.course}</td><td>{new Date(a.created_at).toLocaleDateString()}</td><td><span className={`status ${a.status}`}>{a.status}</span></td><td><select className="status-select" value={a.status} onChange={e=>change(a.id,e.target.value)}><option value="pending">Pending</option><option value="approved">Approve</option><option value="rejected">Reject</option></select></td></tr>)}</tbody></table></div>:<div className="empty"><ClipboardList/><b>No applications found</b><p>New applications will appear here.</p></div>}
function AdminApplications(){const [rows,setRows]=useState([]),[q,setQ]=useState("");useEffect(()=>{supabase.from("applications").select("*").order("created_at",{ascending:false}).then(({data})=>setRows(data||[]));},[]);const filtered=rows.filter(a=>(a.full_name+" "+a.email+" "+a.course).toLowerCase().includes(q.toLowerCase()));return <><div className="dash-heading"><div><span className="eyebrow">ADMINISTRATION</span><h1>Applications</h1><p>Review and update student applications.</p></div></div><div className="dash-box"><div className="search-field"><Search/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search applicants or courses..."/></div><ApplicationsTable rows={filtered} onChange={setRows}/></div></>}
function AdminStudents(){const [rows,setRows]=useState([]);useEffect(()=>{supabase.from("profiles").select("*").order("created_at",{ascending:false}).then(({data})=>setRows(data||[]));},[]);return <><div className="dash-heading"><div><span className="eyebrow">ADMINISTRATION</span><h1>Students</h1><p>Registered platform profiles.</p></div></div><div className="dash-box"><div className="table-wrap"><table><thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead><tbody>{rows.map(s=><tr key={s.id}><td>{s.full_name||"—"}</td><td>{s.email||"—"}</td><td><span className="status approved">{s.role}</span></td><td>{s.created_at?new Date(s.created_at).toLocaleDateString():"—"}</td></tr>)}</tbody></table></div></div></>}
function AdminCourses(){return <><div className="dash-heading"><div><span className="eyebrow">ACADEMY CONTENT</span><h1>Courses</h1><p>Current course catalogue and published fees.</p></div></div><div className="dash-box"><div className="table-wrap"><table><thead><tr><th>Course</th><th>Category</th><th>Duration</th><th>Fee</th><th>Availability</th></tr></thead><tbody>{courses.map(c=><tr key={c.title}><td><b>{c.title}</b></td><td>{c.category}</td><td>{c.duration}</td><td>{money(c.fee)}</td><td><span className={`status ${c.fee?"approved":"pending"}`}>{c.fee?"Open":"Coming soon"}</span></td></tr>)}</tbody></table></div><p className="muted">Course catalogue is currently configured in the website source. Database-based course editing can be added when you are ready.</p></div></>}
function NotFound(){return <div className="not-found"><h1>Page not found</h1><Link to="/" className="btn btn-purple">Return home</Link></div>}

function ScrollReveal(){
  const {pathname}=useLocation();
  useEffect(()=>{
    const nodes=document.querySelectorAll(".section-heading, .course-card, .about-grid > *, .stats-grid > div, .cta-inner, .hero-copy, .hero-art, .dash-heading, .dash-card, .dash-box");
    if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){nodes.forEach(n=>n.classList.add("is-visible"));return;}
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}}),{threshold:.12,rootMargin:"0px 0px -35px 0px"});
    nodes.forEach((node,index)=>{node.classList.add("reveal");if(node.classList.contains("course-card"))node.style.setProperty("--reveal-delay",`${(index%4)*75}ms`);observer.observe(node);});
    return()=>observer.disconnect();
  },[pathname]);
  return null;
}
function PullToRefresh(){
  const [pull,setPull]=useState(0);
  const pullRef=useRef(0),startY=useRef(0),tracking=useRef(false);
  useEffect(()=>{
    const start=e=>{if(window.scrollY===0){startY.current=e.touches[0].clientY;tracking.current=true;}};
    const move=e=>{if(!tracking.current)return;const distance=e.touches[0].clientY-startY.current;if(distance>0){const next=Math.min(distance*.48,92);pullRef.current=next;setPull(next);if(distance>8)e.preventDefault();}else{tracking.current=false;pullRef.current=0;setPull(0);}};
    const end=()=>{if(!tracking.current)return;tracking.current=false;if(pullRef.current>=62){setPull(0);pullRef.current=0;window.location.reload();}else{pullRef.current=0;setPull(0);}};
    window.addEventListener("touchstart",start,{passive:true});window.addEventListener("touchmove",move,{passive:false});window.addEventListener("touchend",end,{passive:true});
    return()=>{window.removeEventListener("touchstart",start);window.removeEventListener("touchmove",move);window.removeEventListener("touchend",end);};
  },[]);
  return <div className={`pull-refresh ${pull>0?"pull-active":""}`} style={{height:pull?`${Math.max(0,pull)}px`:0}} aria-live="polite"><RefreshCw size={17} className={pull>=62?"ready":""}/><span>{pull>=62?"Release to refresh":"Pull to refresh"}</span></div>;
}

export default function App(){
  const [session,setSession]=useState(null),[profile,setProfile]=useState(null),[booting,setBooting]=useState(true);
  const navigate=useNavigate();
  const [themeMode,setThemeMode]=useState(()=>{try{return localStorage.getItem("krevian-theme")||"system";}catch{return "system";}});
  const [systemDark,setSystemDark]=useState(()=>window.matchMedia?.("(prefers-color-scheme: dark)").matches||false);
  const effectiveTheme=themeMode==="system"?(systemDark?"dark":"light"):themeMode;
  function toggleTheme(){setThemeMode(current=>{const next=current==="system"?"dark":current==="dark"?"light":"system";try{localStorage.setItem("krevian-theme",next);}catch{}return next;});}
  useEffect(()=>{const media=window.matchMedia("(prefers-color-scheme: dark)"),change=e=>setSystemDark(e.matches);media.addEventListener?.("change",change);return()=>media.removeEventListener?.("change",change);},[]);
  useEffect(()=>{document.documentElement.dataset.theme=effectiveTheme;document.documentElement.style.colorScheme=effectiveTheme;},[effectiveTheme]);
  async function loadProfile(user){if(!supabaseReady||!user){setProfile(null);return;}let {data}=await supabase.from("profiles").select("*").eq("id",user.id).maybeSingle();if(!data){const created=await supabase.from("profiles").insert({id:user.id,email:user.email,full_name:user.user_metadata?.full_name||"",role:"student"}).select().single();data=created.data;}setProfile(data);}
  useEffect(()=>{if(!supabaseReady){setBooting(false);return;}supabase.auth.getSession().then(async({data})=>{setSession(data.session);if(data.session)await loadProfile(data.session.user);setBooting(false);});const {data:{subscription}}=supabase.auth.onAuthStateChange(async(_event,s)=>{setSession(s);if(s){setTimeout(()=>loadProfile(s.user),0);}else setProfile(null);});return()=>subscription.unsubscribe();},[]);
  async function login(email,password){if(!supabaseReady)return {error:"Authentication is not configured. Follow the setup guide to connect Supabase."};const {error}=await supabase.auth.signInWithPassword({email,password});return {error:error?.message};}
  async function logout(){if(supabaseReady)await supabase.auth.signOut();setSession(null);setProfile(null);navigate("/");}
  if(booting)return <div className="loading-screen"><Brand/><p>Preparing your academy...</p></div>;
  if(!supabaseReady)return <div className="setup-banner"><b>Setup required:</b> connect your Supabase project using the instructions in README.md. The public website is available, but forms, accounts and portals require the backend configuration.</div>;
  const user=session?.user;
  return <><PullToRefresh/><Header user={user} profile={profile} onLogout={logout} themeMode={themeMode} onThemeToggle={toggleTheme}/><ScrollReveal/><Routes>
    <Route path="/" element={<Home/>}/><Route path="/apply" element={<Apply/>}/><Route path="/signup" element={<Signup/>}/><Route path="/login" element={<Login onLogin={login}/>}/>
    <Route path="/student" element={user&&profile?.role!=="admin"?<DashboardShell user={user} profile={profile} onLogout={logout}><StudentDashboard user={user} profile={profile}/></DashboardShell>:<Login onLogin={login}/>}/>
    <Route path="/student/courses" element={user&&profile?.role!=="admin"?<DashboardShell user={user} profile={profile} onLogout={logout}><StudentCourses/></DashboardShell>:<Login onLogin={login}/>}/>
    <Route path="/student/profile" element={user&&profile?.role!=="admin"?<DashboardShell user={user} profile={profile} onLogout={logout}><Profile user={user} profile={profile}/></DashboardShell>:<Login onLogin={login}/>}/>
    <Route path="/admin" element={user&&profile?.role==="admin"?<DashboardShell user={user} profile={profile} onLogout={logout} admin><AdminOverview/></DashboardShell>:<Login onLogin={login}/>}/>
    <Route path="/admin/applications" element={user&&profile?.role==="admin"?<DashboardShell user={user} profile={profile} onLogout={logout} admin><AdminApplications/></DashboardShell>:<Login onLogin={login}/>}/>
    <Route path="/admin/students" element={user&&profile?.role==="admin"?<DashboardShell user={user} profile={profile} onLogout={logout} admin><AdminStudents/></DashboardShell>:<Login onLogin={login}/>}/>
    <Route path="/admin/courses" element={user&&profile?.role==="admin"?<DashboardShell user={user} profile={profile} onLogout={logout} admin><AdminCourses/></DashboardShell>:<Login onLogin={login}/>}/>
    <Route path="*" element={<NotFound/>}/>
  </Routes>{!location.pathname.startsWith("/student")&&!location.pathname.startsWith("/admin")&&<Footer/>}</>;
}
