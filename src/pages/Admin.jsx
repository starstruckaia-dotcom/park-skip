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
    if (password === ADMIN_PASSWORD) { setAuthed(true); setError(""); }
    else setError("Incorrect password.");
  };

  const fetchLots = async () => {
    setLoading(true);
    const res = await fetch(`${SUPABASE_URL}/rest/v1/lots?order=created_at.desc`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    });
    setLots(await res.json());
    setLoading(false);
  };

  const toggleActive = async (id, current, lot) => {
    if (!current) {
      await fetch("https://lubiai.ca/webhook/parkskip-generate-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lot_id: lot.id, lot_name: lot.name, owner_email: lot.owner_email, owner_name: lot.owner_name, serial_number: `PS-${new Date().getFullYear()}-${lot.id.slice(0,6).toUpperCase()}` })
      });
    }
    await fetch(`${SUPABASE_URL}/rest/v1/lots?id=eq.${id}`, {
      method: "PATCH",
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}`, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ active: !current })
    });
    fetchLots();
  };

  useEffect(() => { if (authed) fetchLots(); }, [authed]);

  if (!authed) return (
    <div style={{minHeight:"100vh",backgroundColor:"#F5F5F5",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"Georgia,serif",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:"380px",backgroundColor:"#fff",border:"1px solid #ddd",borderRadius:"8px",padding:"48px 40px",boxShadow:"0 4px 24px rgba(0,0,0,0.08)"}}>
        <div style={{textAlign:"center",marginBottom:"32px"}}>
          <div style={{fontSize:"22px",fontWeight:"600",color:"#1a1a1a",letterSpacing:"0.05em"}}>Park&Skip</div>
          <div style={{fontSize:"13px",color:"#888",marginTop:"4px"}}>Admin Dashboard</div>
        </div>
        <label style={{display:"block",fontSize:"12px",fontWeight:"600",color:"#444",marginBottom:"8px"}}>PASSWORD</label>
        <input
          style={{width:"100%",padding:"12px 14px",border:"1px solid #ddd",borderRadius:"6px",fontSize:"15px",color:"#1a1a1a",outline:"none",boxSizing:"border-box",marginBottom:"8px"}}
          type="password"
          value={password}
          onChange={e=>setPassword(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&login()}
          placeholder="••••••••••••"
          autoFocus
        />
        {error && <p style={{color:"#e53e3e",fontSize:"12px",margin:"0 0 12px"}}>{error}</p>}
        <button
          style={{width:"100%",marginTop:"12px",backgroundColor:"#1a1a1a",color:"#fff",border:"none",padding:"14px",fontSize:"14px",fontWeight:"600",cursor:"pointer",borderRadius:"6px",letterSpacing:"0.05em"}}
          onClick={login}
        >
          Sign In →
        </button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",backgroundColor:"#F7F8FA",fontFamily:"Georgia,serif",margin:0,padding:0}}>
      {/* Top Nav */}
      <div style={{backgroundColor:"#fff",borderBottom:"1px solid #E0E0E0",padding:"0 32px",display:"flex",alignItems:"center",justifyContent:"space-between",height:"60px"}}>
        <div style={{display:"flex",alignItems:"center",gap:"12px"}}>
          <span style={{fontSize:"18px",fontWeight:"700",color:"#1a1a1a",letterSpacing:"0.05em"}}>Park&Skip</span>
          <span style={{backgroundColor:"#F0F0F0",color:"#666",fontSize:"11px",padding:"2px 10px",borderRadius:"20px",fontFamily:"sans-serif"}}>Admin</span>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
          <span style={{fontSize:"13px",color:"#888",fontFamily:"sans-serif"}}>{lots.length} lot{lots.length!==1?"s":""} registered</span>
          <button onClick={fetchLots} style={{background:"none",border:"1px solid #ddd",borderRadius:"6px",padding:"6px 14px",fontSize:"12px",cursor:"pointer",color:"#444",fontFamily:"sans-serif"}}>Refresh</button>
        </div>
      </div>

      {/* Table */}
      <div style={{padding:"24px 32px"}}>
        <div style={{backgroundColor:"#fff",border:"1px solid #E0E0E0",borderRadius:"8px",overflow:"hidden",boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
          {loading ? (
            <div style={{padding:"60px",textAlign:"center",color:"#888",fontFamily:"sans-serif"}}>Loading...</div>
          ) : lots.length === 0 ? (
            <div style={{padding:"60px",textAlign:"center",color:"#888",fontFamily:"sans-serif"}}>No lots registered yet.</div>
          ) : (
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontFamily:"sans-serif"}}>
                <thead>
                  <tr style={{backgroundColor:"#F7F8FA",borderBottom:"1px solid #E0E0E0"}}>
                    {["Lot","Owner","Contact","Address","Pricing","Stripe","Status","Action"].map(h=>(
                      <th key={h} style={{padding:"12px 16px",textAlign:"left",fontSize:"11px",borderRight:"1px solid #E8E8E8",fontWeight:"700",color:"#888",letterSpacing:"0.08em",textTransform:"uppercase",whiteSpace:"nowrap"}}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lots.map((lot,i)=>(
                    <tr key={lot.id} style={{borderBottom:"1px solid #F0F0F0",backgroundColor:i%2===0?"#fff":"#FAFAFA"}}>
                      <td style={{padding:"14px 16px",verticalAlign:"top",borderRight:"1px solid #F0F0F0"}}>
                        <div style={{fontWeight:"600",fontSize:"14px",color:"#1a1a1a"}}>{lot.name}</div>
                        <div style={{fontSize:"11px",color:"#aaa",marginTop:"2px"}}>{lot.id.slice(0,8)}...</div>
                      </td>
                      <td style={{padding:"14px 16px",verticalAlign:"top",borderRight:"1px solid #F0F0F0"}}>
                        <div style={{fontSize:"13px",color:"#1a1a1a",fontWeight:"500"}}>{lot.owner_name}</div>
                      </td>
                      <td style={{padding:"14px 16px",verticalAlign:"top",borderRight:"1px solid #F0F0F0"}}>
                        <div style={{fontSize:"12px",color:"#444"}}>{lot.owner_email}</div>
                        <div style={{fontSize:"12px",color:"#888",marginTop:"2px"}}>{lot.phone||"—"}</div>
                      </td>
                      <td style={{padding:"14px 16px",verticalAlign:"top",borderRight:"1px solid #F0F0F0"}}>
                        <div style={{fontSize:"12px",color:"#444",maxWidth:"180px"}}>{lot.address}</div>
                      </td>
                      <td style={{padding:"14px 16px",verticalAlign:"top",borderRight:"1px solid #F0F0F0"}}>
                        <div style={{display:"flex",flexWrap:"wrap",gap:"4px"}}>
                          {[["1h",lot.price_1hr],["2h",lot.price_2hr],["4h",lot.price_4hr],["8h",lot.price_8hr],["24h",lot.price_24hr]].filter(([,v])=>v).map(([l,v])=>(
                            <span key={l} style={{backgroundColor:"#F0F0F0",padding:"2px 7px",fontSize:"11px",color:"#444",borderRadius:"4px",whiteSpace:"nowrap"}}>{l}: ${v}</span>
                          ))}
                        </div>
                      </td>
                      <td style={{padding:"14px 16px",verticalAlign:"top",borderRight:"1px solid #F0F0F0"}}>
                        {lot.stripe_account_id ? (
                          <a href={`https://dashboard.stripe.com/connect/accounts/${lot.stripe_account_id}`} target="_blank" rel="noreferrer" style={{fontSize:"11px",color:"#6366f1",textDecoration:"none"}}>
                            {lot.stripe_account_id.slice(0,14)}... ↗
                          </a>
                        ) : <span style={{fontSize:"12px",color:"#ccc"}}>—</span>}
                      </td>
                      <td style={{padding:"14px 16px",verticalAlign:"top",borderRight:"1px solid #F0F0F0"}}>
                        <span style={{display:"inline-flex",alignItems:"center",gap:"5px",padding:"4px 10px",fontSize:"11px",fontWeight:"600",borderRadius:"20px",backgroundColor:lot.active?"#DCFCE7":"#FEF3C7",color:lot.active?"#16A34A":"#D97706"}}>
                          <span style={{width:"6px",height:"6px",borderRadius:"50%",backgroundColor:lot.active?"#16A34A":"#D97706",display:"inline-block"}}></span>
                          {lot.active?"Active":"Pending"}
                        </span>
                      </td>
                      <td style={{padding:"14px 16px",verticalAlign:"top",borderRight:"1px solid #F0F0F0"}}>
                        <button
                          style={{padding:"7px 16px",fontSize:"12px",fontWeight:"600",cursor:"pointer",borderRadius:"6px",border:"none",backgroundColor:lot.active?"#FEE2E2":"#1a1a1a",color:lot.active?"#DC2626":"#fff",whiteSpace:"nowrap"}}
                          onClick={()=>toggleActive(lot.id,lot.active,lot)}
                        >
                          {lot.active?"Deactivate":"Activate"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
