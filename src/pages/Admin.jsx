import { useState, useEffect } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD;

export default function Admin() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [lots, setLots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = () => {
    if (password === ADMIN_PASSWORD) setAuthed(true);
    else setError("Wrong password.");
  };

  const fetchLots = async () => {
    setLoading(true);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/lots?order=created_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    const data = await res.json();
    setLots(data);
    setLoading(false);
  };

  const toggleActive = async (id, current) => {
    await fetch(`${SUPABASE_URL}/rest/v1/lots?id=eq.${id}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ active: !current })
    });
    fetchLots();
  };

  useEffect(() => { if (authed) fetchLots(); }, [authed]);

  const S = {
    page:{minHeight:"100vh",backgroundColor:"#FFFFFF",fontFamily:"'Cormorant Garamond',Georgia,serif",padding:"40px 24px"},
    header:{marginBottom:"40px"},
    badge:{display:"inline-block",border:"1px solid rgba(201,168,76,0.4)",color:"#C9A84C",fontSize:"10px",letterSpacing:"0.3em",padding:"4px 10px",marginBottom:"12px"},
    title:{margin:0,fontSize:"28px",fontWeight:300,letterSpacing:"0.2em",color:"#1A1A1A"},
    subtitle:{margin:"6px 0 0",fontSize:"12px",color:"#444444",letterSpacing:"0.1em"},
    loginBox:{maxWidth:"360px",margin:"100px auto",background:"#F8F8F8",border:"1px solid #DDDDDD",padding:"40px"},
    label:{display:"block",fontSize:"10px",letterSpacing:"0.2em",color:"#666666",marginBottom:"8px",textTransform:"uppercase"},
    input:{width:"100%",background:"transparent",border:"none",borderBottom:"1px solid rgba(255,255,255,0.1)",padding:"10px 0",color:"#1A1A1A",fontSize:"15px",fontFamily:"'Cormorant Garamond',Georgia,serif",outline:"none",boxSizing:"border-box",marginBottom:"24px"},
    btn:{background:"transparent",border:"1px solid rgba(201,168,76,0.5)",color:"#C9A84C",fontSize:"11px",letterSpacing:"0.2em",padding:"12px 24px",cursor:"pointer",fontFamily:"'Cormorant Garamond',Georgia,serif",width:"100%"},
    error:{color:"#C0392B",fontSize:"12px",marginTop:"12px",fontFamily:"monospace"},
    table:{width:"100%",borderCollapse:"collapse"},
    th:{fontSize:"10px",letterSpacing:"0.15em",color:"#444444",textTransform:"uppercase",padding:"12px 16px",textAlign:"left",borderBottom:"1px solid rgba(255,255,255,0.06)"},
    td:{padding:"16px",borderBottom:"1px solid rgba(255,255,255,0.04)",fontSize:"13px",color:"#1A1A1A",verticalAlign:"top"},
    activeBadge:{display:"inline-block",padding:"3px 10px",fontSize:"10px",letterSpacing:"0.1em",border:"1px solid rgba(100,200,100,0.4)",color:"rgba(100,200,100,0.8)"},
    inactiveBadge:{display:"inline-block",padding:"3px 10px",fontSize:"10px",letterSpacing:"0.1em",border:"1px solid rgba(255,100,100,0.3)",color:"rgba(255,100,100,0.6)"},
    toggleBtn:{background:"transparent",border:"1px solid rgba(201,168,76,0.3)",color:"#C9A84C",fontSize:"10px",letterSpacing:"0.1em",padding:"6px 14px",cursor:"pointer",fontFamily:"'Cormorant Garamond',Georgia,serif"},
    stripeLink:{color:"rgba(201,168,76,0.6)",fontSize:"11px",textDecoration:"none",letterSpacing:"0.05em"},
  };

  if (!authed) return (
    <div style={S.page}>
      <div style={S.loginBox}>
        <div style={S.badge}>P & S</div>
        <h1 style={{...S.title,fontSize:"18px",marginBottom:"28px"}}>ADMIN ACCESS</h1>
        <label style={S.label}>Password</label>
        <input style={S.input} type="password" value={password} onChange={e=>setPassword(e.target.value)} onKeyDown={e=>e.key==="Enter"&&login()} />
        <button style={S.btn} onClick={login}>ENTER →</button>
        {error && <p style={S.error}>{error}</p>}
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      <div style={S.header}>
        <div style={S.badge}>P & S</div>
        <h1 style={S.title}>ADMIN DASHBOARD</h1>
        <p style={S.subtitle}>{lots.length} LOT{lots.length!==1?"S":""} REGISTERED</p>
      </div>
      {loading ? <p style={{color:"#444444",letterSpacing:"0.1em"}}>Loading...</p> : (
        <div style={{overflowX:"auto"}}>
          <table style={S.table}>
            <thead>
              <tr>
                {["Lot Name","Owner","Email","Phone","Address","Prices","Stripe","Status","Action"].map(h=>(
                  <th key={h} style={S.th}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lots.map(lot=>(
                <tr key={lot.id}>
                  <td style={{...S.td,color:"#1A1A1A",fontWeight:500}}>{lot.name}</td>
                  <td style={S.td}>{lot.owner_name}</td>
                  <td style={S.td}>{lot.owner_email}</td>
                  <td style={S.td}>{lot.phone||"—"}</td>
                  <td style={S.td}>{lot.address}</td>
                  <td style={S.td}>
                    <div style={{fontSize:"11px",lineHeight:1.8}}>
                      {lot.price_1hr&&<div>1hr: CA${lot.price_1hr}</div>}
                      {lot.price_2hr&&<div>2hr: CA${lot.price_2hr}</div>}
                      {lot.price_4hr&&<div>4hr: CA${lot.price_4hr}</div>}
                      {lot.price_8hr&&<div>8hr: CA${lot.price_8hr}</div>}
                      {lot.price_24hr&&<div>24hr: CA${lot.price_24hr}</div>}
                    </div>
                  </td>
                  <td style={S.td}>
                    {lot.stripe_account_id ? (
                      <a href={`https://dashboard.stripe.com/connect/accounts/${lot.stripe_account_id}`} target="_blank" rel="noreferrer" style={S.stripeLink}>
                        {lot.stripe_account_id.slice(0,12)}... ↗
                      </a>
                    ) : "—"}
                  </td>
                  <td style={S.td}>
                    <span style={lot.active?S.activeBadge:S.inactiveBadge}>
                      {lot.active?"ACTIVE":"PENDING"}
                    </span>
                  </td>
                  <td style={S.td}>
                    <button style={S.toggleBtn} onClick={()=>toggleActive(lot.id,lot.active)}>
                      {lot.active?"DEACTIVATE":"ACTIVATE"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
