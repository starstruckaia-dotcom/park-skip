import { useState } from "react";

const WEBHOOK_URL = "https://lubiai.ca/webhook/parkskip-onboard-lot";
const steps = ["Your Info", "Lot Details", "Pricing", "Review"];
const initialForm = { owner_name: "", email: "", phone: "", lot_name: "", address: "", city: "", capacity: "", price_1hr: "", price_2hr: "", price_4hr: "", price_8hr: "", price_24hr: "" };

export default function Onboard() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);
  const [onboardingUrl, setOnboardingUrl] = useState("");
  const update = (f, v) => setForm(p => ({ ...p, [f]: v }));

  const next = () => {
    setError("");
    if (step === 0 && (!form.owner_name || !form.email || !form.phone)) { setError("Please fill in your name and email."); return; }
    if (step === 1 && (!form.lot_name || !form.address || !form.city || !form.capacity)) { setError("Please fill in all lot details."); return; }
    if (step === 2 && !form.price_1hr) { setError("Please enter at least the 1-hour rate."); return; }
    setStep(s => s + 1);
  };

  const submit = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetch(WEBHOOK_URL, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...form, capacity: parseInt(form.capacity), price_1hr: parseFloat(form.price_1hr)||0, price_2hr: parseFloat(form.price_2hr)||0, price_4hr: parseFloat(form.price_4hr)||0, price_8hr: parseFloat(form.price_8hr)||0, price_24hr: parseFloat(form.price_24hr)||0 }) });
      const data = await res.json();
      if (data.url) { setOnboardingUrl(data.url); setDone(true); } else { setError("Something went wrong. Please try again."); }
    } catch { setError("Connection error. Please try again."); }
    finally { setLoading(false); }
  };

  const S = { page:{minHeight:"100vh",backgroundColor:"#0A0A0A",display:"flex",alignItems:"flex-start",justifyContent:"center",fontFamily:"'Cormorant Garamond',Georgia,serif",padding:"40px 16px 60px"}, container:{width:"100%",maxWidth:"520px",display:"flex",flexDirection:"column",alignItems:"center",gap:"32px"}, header:{textAlign:"center",paddingTop:"20px"}, badge:{display:"inline-block",border:"1px solid rgba(201,168,76,0.4)",color:"#C9A84C",fontSize:"10px",letterSpacing:"0.3em",padding:"4px 10px",marginBottom:"12px"}, title:{margin:0,fontSize:"clamp(28px,6vw,42px)",fontWeight:300,letterSpacing:"0.25em",color:"#F5F0E8"}, subtitle:{margin:"8px 0 0",fontSize:"11px",letterSpacing:"0.35em",color:"rgba(201,168,76,0.7)"}, steps:{display:"flex",gap:"8px",alignItems:"center",width:"100%",justifyContent:"center"}, stepItem:{display:"flex",flexDirection:"column",alignItems:"center",gap:"6px",flex:1}, stepDot:{width:"28px",height:"28px",borderRadius:"50%",border:"1px solid rgba(255,255,255,0.15)",color:"rgba(255,255,255,0.3)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:"11px"}, stepDotActive:{border:"1px solid #C9A84C",color:"#C9A84C"}, stepDotDone:{border:"1px solid rgba(201,168,76,0.5)",color:"rgba(201,168,76,0.7)",backgroundColor:"rgba(201,168,76,0.08)"}, stepLabel:{fontSize:"9px",letterSpacing:"0.15em",color:"rgba(255,255,255,0.25)",textTransform:"uppercase"}, stepLabelActive:{color:"#C9A84C"}, card:{width:"100%",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",padding:"36px 32px",boxSizing:"border-box"}, cardTitle:{margin:"0 0 6px",fontSize:"13px",fontWeight:400,letterSpacing:"0.25em",color:"#F5F0E8"}, cardSub:{margin:"0 0 28px",fontSize:"13px",color:"rgba(255,255,255,0.35)",letterSpacing:"0.05em"}, field:{marginBottom:"20px"}, label:{display:"block",fontSize:"10px",letterSpacing:"0.2em",color:"rgba(255,255,255,0.4)",marginBottom:"8px",textTransform:"uppercase"}, input:{width:"100%",background:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,0.1)",padding:"10px 0",color:"#F5F0E8",fontSize:"15px",fontFamily:"'Cormorant Garamond',Georgia,serif",outline:"none",boxSizing:"border-box"}, priceGrid:{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"16px 24px"}, priceWrap:{display:"flex",alignItems:"center",borderBottom:"1px solid rgba(255,255,255,0.1)"}, priceCur:{fontSize:"12px",color:"rgba(201,168,76,0.6)",marginRight:"6px",padding:"10px 0"}, priceInput:{flex:1,background:"transparent",border:"none",padding:"10px 0",color:"#F5F0E8",fontSize:"15px",fontFamily:"'Cormorant Garamond',Georgia,serif",outline:"none"}, reviewSection:{borderBottom:"1px solid rgba(255,255,255,0.06)",paddingBottom:"16px",marginBottom:"16px"}, reviewRow:{display:"flex",justifyContent:"space-between",padding:"6px 0"}, reviewLabel:{fontSize:"10px",letterSpacing:"0.15em",color:"rgba(255,255,255,0.35)",textTransform:"uppercase"}, reviewValue:{fontSize:"14px",color:"#F5F0E8"}, error:{color:"#C0392B",fontSize:"12px",margin:"0 0 16px",fontFamily:"monospace"}, actions:{display:"flex",justifyContent:"space-between",alignItems:"center",marginTop:"32px",gap:"16px"}, backBtn:{background:"transparent",border:"none",color:"rgba(255,255,255,0.35)",fontSize:"11px",letterSpacing:"0.15em",cursor:"pointer",padding:"0",fontFamily:"'Cormorant Garamond',Georgia,serif"}, nextBtn:{marginLeft:"auto",background:"transparent",border:"1px solid rgba(201,168,76,0.5)",color:"#C9A84C",fontSize:"11px",letterSpacing:"0.2em",padding:"14px 28px",cursor:"pointer",fontFamily:"'Cormorant Garamond',Georgia,serif"}, successIcon:{width:"48px",height:"48px",border:"1px solid rgba(201,168,76,0.4)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#C9A84C",fontSize:"20px",margin:"0 auto 24px"}, stripeBtn:{display:"block",textAlign:"center",border:"1px solid rgba(201,168,76,0.5)",color:"#C9A84C",fontSize:"11px",letterSpacing:"0.2em",padding:"16px 28px",marginTop:"28px",textDecoration:"none",fontFamily:"'Cormorant Garamond',Georgia,serif"}, note:{marginTop:"16px",fontSize:"12px",color:"rgba(255,255,255,0.3)",textAlign:"center"}, footer:{fontSize:"11px",color:"rgba(255,255,255,0.15)",letterSpacing:"0.1em"} };

  return (
    <div style={S.page}>
      <div style={S.container}>
        <div style={S.header}>
          <div style={S.badge}>P & S</div>
          <h1 style={S.title}>PARK&amp;SKIP</h1>
          <p style={S.subtitle}>LOT OWNER PORTAL</p>
        </div>
        {!done ? (<>
          <div style={S.steps}>{steps.map((s,i) => (<div key={i} style={S.stepItem}><div style={{...S.stepDot,...(i===step?S.stepDotActive:i<step?S.stepDotDone:{})}}>{i<step?"✓":i+1}</div><span style={{...S.stepLabel,...(i===step?S.stepLabelActive:{})}}>{s}</span></div>))}</div>
          <div style={S.card}>
            {step===0&&<><h2 style={S.cardTitle}>YOUR INFORMATION</h2><p style={S.cardSub}>Tell us about yourself</p>{[["owner_name","Full Name","Jane Smith"],["email","Email Address","jane@example.com","email"],["phone","Phone Number","+1 613 555 0000","tel"]].map(([f,l,p,t="text"])=><div key={f} style={S.field}><label style={S.label}>{l}</label><input style={S.input} type={t} value={form[f]} onChange={e=>update(f,e.target.value)} placeholder={p}/></div>)}</>}
            {step===1&&<><h2 style={S.cardTitle}>LOT DETAILS</h2><p style={S.cardSub}>Tell us about your parking lot</p>{[["lot_name","Lot Name","Downtown Lot A"],["address","Street Address","123 Main St"],["city","City","Ottawa, ON"],["capacity","Capacity (# of spots)","50","number"]].map(([f,l,p,t="text"])=><div key={f} style={S.field}><label style={S.label}>{l}</label><input style={S.input} type={t} value={form[f]} onChange={e=>update(f,e.target.value)} placeholder={p}/></div>)}</>}
            {step===2&&<><h2 style={S.cardTitle}>PRICING TIERS</h2><p style={S.cardSub}>Set your rates in CAD. Leave blank to disable a tier.</p><div style={S.priceGrid}>{[["price_1hr","1 Hour"],["price_2hr","2 Hours"],["price_4hr","4 Hours"],["price_8hr","8 Hours"],["price_24hr","24 Hours"]].map(([f,l])=><div key={f}><label style={S.label}>{l}</label><div style={S.priceWrap}><span style={S.priceCur}>CA$</span><input style={S.priceInput} type="number" min="0" step="0.5" value={form[f]} onChange={e=>update(f,e.target.value)} placeholder="0.00"/></div></div>)}</div></>}
            {step===3&&<><h2 style={S.cardTitle}>REVIEW & SUBMIT</h2><p style={S.cardSub}>Confirm your details before submitting</p><div style={S.reviewSection}>{[["Name",form.owner_name],["Email",form.email],form.phone&&["Phone",form.phone]].filter(Boolean).map(([l,v])=><div key={l} style={S.reviewRow}><span style={S.reviewLabel}>{l}</span><span style={S.reviewValue}>{v}</span></div>)}</div><div style={S.reviewSection}>{[["Lot",form.lot_name],["Address",`${form.address}, ${form.city}`],["Capacity",`${form.capacity} spots`]].map(([l,v])=><div key={l} style={S.reviewRow}><span style={S.reviewLabel}>{l}</span><span style={S.reviewValue}>{v}</span></div>)}</div><div style={S.reviewSection}>{[["1hr",form.price_1hr],["2hr",form.price_2hr],["4hr",form.price_4hr],["8hr",form.price_8hr],["24hr",form.price_24hr]].filter(([,v])=>v).map(([l,v])=><div key={l} style={S.reviewRow}><span style={S.reviewLabel}>{l}</span><span style={S.reviewValue}>CA${v}</span></div>)}</div></>}
            {error&&<p style={S.error}>{error}</p>}
            <div style={S.actions}>
              {step>0&&<button style={S.backBtn} onClick={()=>{setError("");setStep(s=>s-1)}}>← BACK</button>}
              {step<3?<button style={S.nextBtn} onClick={next}>CONTINUE →</button>:<button style={{...S.nextBtn,opacity:loading?0.6:1}} onClick={submit} disabled={loading}>{loading?"SUBMITTING...":"SUBMIT & CONNECT BANK →"}</button>}
            </div>
          </div>
        </>) : (
          <div style={S.card}>
            <div style={S.successIcon}>✓</div>
            <h2 style={S.cardTitle}>YOU'RE ALMOST THERE</h2>
            <p style={S.cardSub}>Your lot has been registered. Complete Stripe setup to start receiving payments.</p>
            <a href={onboardingUrl} style={S.stripeBtn}>CONNECT YOUR BANK →</a>
            <p style={S.note}>You'll be redirected to Stripe's secure onboarding. Takes about 5 minutes.</p>
          </div>
        )}
        <p style={S.footer}>© 2026 Park&amp;Skip</p>
      </div>
    </div>
  );
}
