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
    else setError("Incorrect password. Try again.");
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

  const toggleActive = async (id, current, lot) => {
    if (!current) {
      await fetch("https://lubiai.ca/webhook/parkskip-generate-qr", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          lot_id: lot.id,
          lot_name: lot.name,
          owner_email: lot.owner_email,
          owner_name: lot.owner_name,
          serial_number: `PS-${new Date().getFullYear()}-${lot.id.slice(0,6).toUpperCase()}`
        })
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
    <div style={{minHeight:"100vh",backgroundColor:"#F5F5F5",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',Georgia,serif",padding:"20px"}}>
      <div style={{width:"100%",maxWidth:"400px",backgroundColor:"#FFFFFF",border:"1px solid #E0E0E0",borderRadius:"4px",padding:"48px 40px",boxShadow:"0 2px 20px rgba(0,0,0,0.08)"}}>
        <div style={{textAlign:"center",marginBottom:"32px"}}>
          <div style={{display:"inline-block",border:"1px solid rgba(201,168,76,0.6)",color:"#C9A84C",fontSize:"10px",letterSpacing:"0.3em",padding:"4px 10px",marginBottom:"16px"}}>P & S</div>
          <h1 style={{margin:0,fontSize:"22px",fontWeight:400,letterSpacing:"0.2em",color:"#1A1A1A"}}>ADMIN ACCESS</h1>
          <p style={{margin:"8px 0 0",fontSize:"13px",color:"#888888"}}>Enter your password to continue</p>
        </div>
        <div style={{marginBottom:"8px"}}>
          <label style={{display:"block",fontSize:"11px",letterSpacing:"0.15em",color:"#666666",marginBottom:"8px",textTransform:"uppercase"}}>Password</label>
          <input
            style={{width:"100%",padding:"12px 16px",border:"1px solid #DDDDDD",borderRadius:"3px",fontSize:"15px",fontFamily:"'Cormorant Garamond',Georgia,serif",color:"#1A1A1A",outline:"none",boxSizing:"border-box",backgroundColor:"#FAFAFA"}}
            type="password"
            value={password}
            onChange={e=>setPassword(e.target.value)}
            onKeyDown={e=>e.key==="Enter"&&login()}
            placeholder="Enter admin password"
            autoFocus
          />
        </div>
        {error && <p style={{color:"#C0392B",fontSize:"12px",margin:"8px 0",fontFamily:"monospace"}}>{error}</p>}
        <button
          style={{width:"100%",marginTop:"20px",backgroundColor:"#1A1A1A",color:"#FFFFFF",border:"none",padding:"14px",fontSize:"12px",letterSpacing:"0.2em",cursor:"pointer",fontFamily:"'Cormorant Garamond',Georgia,serif",borderRadius:"3px"}}
          onClick={login}
        >
          ENTER →
        </button>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh",backgroundColor:"#F5F5F5",fontFamily:"'Cormorant Garamond',Georgia,serif"}}>
      {/* Header */}
      <div style={{backgroundColor:"#1A1A1A",padding:"16px 24px",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
        <div style={{display:"flex",alignItems:"center",gap:"16px"}}>
          <span style={{border:"1px solid rgba(201,168,76,0.6)",color:"#C9A84C",fontSize:"10px",letterSpacing:"0.3em",padding:"3px 8px"}}>P & S</span>
          <span style={{color:"#FFFFFF",fontSize:"16px",letterSpacing:"0.2em",fontWeight:300}}>ADMIN DASHBOARD</span>
        </div>
        <span style={{color:"rgba(255,255,255,0.5)",fontSize:"12px"}}>{lots.length} LOT{lots.length!==1?"S":""} REGISTERED</span>
      </div>

      {/* Content */}
      <div style={{padding:"24px"}}>
        {loading ? (
          <p style={{color:"#888888",letterSpacing:"0.1em",textAlign:"center",padding:"40px"}}>Loading...</p>
        ) : lots.length === 0 ? (
          <div style={{textAlign:"center",padding:"60px",color:"#888888"}}>
            <p style={{fontSize:"16px"}}>No lots registered yet.</p>
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div style={{display:"none"}} className="desktop-only">
            </div>
            
            {/* Card-based layout (works on all screen sizes) */}
            <div style={{display:"flex",flexDirection:"column",gap:"16px",maxWidth:"1200px",margin:"0 auto"}}>
              {lots.map(lot=>(
                <div key={lot.id} style={{backgroundColor:"#FFFFFF",border:"1px solid #E0E0E0",borderRadius:"4px",padding:"24px",boxShadow:"0 1px 4px rgba(0,0,0,0.05)"}}>
                  <div style={{display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignItems:"flex-start",gap:"16px"}}>
                    {/* Left - Lot Info */}
                    <div style={{flex:"1",minWidth:"200px"}}>
                      <h3 style={{margin:"0 0 4px",fontSize:"18px",fontWeight:500,color:"#1A1A1A",letterSpacing:"0.05em"}}>{lot.name}</h3>
                      <p style={{margin:"0 0 2px",fontSize:"13px",color:"#666666"}}>{lot.address}</p>
                      <p style={{margin:0,fontSize:"12px",color:"#999999",letterSpacing:"0.05em"}}>ID: {lot.id.slice(0,8)}...</p>
                    </div>

                    {/* Middle - Owner Info */}
                    <div style={{flex:"1",minWidth:"200px"}}>
                      <p style={{margin:"0 0 4px",fontSize:"11px",letterSpacing:"0.15em",color:"#999999",textTransform:"uppercase"}}>Owner</p>
                      <p style={{margin:"0 0 2px",fontSize:"14px",color:"#1A1A1A",fontWeight:500}}>{lot.owner_name}</p>
                      <p style={{margin:"0 0 2px",fontSize:"13px",color:"#444444"}}>{lot.owner_email}</p>
                      <p style={{margin:0,fontSize:"13px",color:"#444444"}}>{lot.phone||"No phone"}</p>
                    </div>

                    {/* Middle - Pricing */}
                    <div style={{flex:"1",minWidth:"150px"}}>
                      <p style={{margin:"0 0 8px",fontSize:"11px",letterSpacing:"0.15em",color:"#999999",textTransform:"uppercase"}}>Pricing</p>
                      <div style={{display:"flex",flexWrap:"wrap",gap:"6px"}}>
                        {[["1hr",lot.price_1hr],["2hr",lot.price_2hr],["4hr",lot.price_4hr],["8hr",lot.price_8hr],["24hr",lot.price_24hr]].filter(([,v])=>v).map(([l,v])=>(
                          <span key={l} style={{backgroundColor:"#F5F5F5",border:"1px solid #E0E0E0",padding:"3px 8px",fontSize:"12px",color:"#444444",borderRadius:"2px"}}>{l}: CA${v}</span>
                        ))}
                      </div>
                    </div>

                    {/* Right - Status & Actions */}
                    <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:"12px",minWidth:"160px"}}>
                      <span style={{padding:"4px 14px",fontSize:"11px",letterSpacing:"0.15em",fontWeight:600,borderRadius:"20px",backgroundColor:lot.active?"#E8F5E9":"#FFF3E0",color:lot.active?"#2E7D32":"#E65100",border:`1px solid ${lot.active?"#A5D6A7":"#FFCC80"}`}}>
                        {lot.active?"● ACTIVE":"○ PENDING"}
                      </span>
                      {lot.stripe_account_id && (
                        <a href={`https://dashboard.stripe.com/connect/accounts/${lot.stripe_account_id}`} target="_blank" rel="noreferrer" style={{fontSize:"11px",color:"#C9A84C",textDecoration:"none",letterSpacing:"0.05em"}}>
                          View on Stripe ↗
                        </a>
                      )}
                      <button
                        style={{padding:"10px 20px",fontSize:"12px",letterSpacing:"0.15em",cursor:"pointer",fontFamily:"'Cormorant Garamond',Georgia,serif",borderRadius:"3px",border:"none",backgroundColor:lot.active?"#FFEBEE":"#1A1A1A",color:lot.active?"#C62828":"#FFFFFF",fontWeight:500}}
                        onClick={()=>toggleActive(lot.id,lot.active,lot)}
                      >
                        {lot.active?"DEACTIVATE":"ACTIVATE"}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
