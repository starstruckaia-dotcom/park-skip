import { useState, useEffect, useRef } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function Owner() {
  const [tab, setTab] = useState("dashboard");
  const [lot, setLot] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [plate, setPlate] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fineIssued, setFineIssued] = useState(false);
  const [scanning, setScanning] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const videoRef = useRef(null);

  const lotId = new URLSearchParams(window.location.search).get("lot");

  useEffect(() => {
    if (!lotId) return;
    fetch(`${SUPABASE_URL}/rest/v1/lots?id=eq.${lotId}&active=eq.true`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    }).then(r => r.json()).then(d => {
      if (d[0]) setLot(d[0]);
      else setNotFound(true);
    });
  }, [lotId]);

  const fetchTransactions = async () => {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/transactions?lot_id=eq.${lotId}&order=created_at.desc&limit=50`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    setTransactions(await res.json());
  };

  useEffect(() => { if (lot && tab === "transactions") fetchTransactions(); }, [lot, tab]);

  const checkPlate = async () => {
    if (!plate.trim()) return;
    setLoading(true); setResult(null); setFineIssued(false);
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/transactions?lot_id=eq.${lotId}&plate=eq.${plate.toUpperCase().trim()}&created_at=gte.${oneHourAgo}&order=created_at.desc&limit=1`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const data = await res.json();
    setResult(data.length > 0 ? { paid: true, tx: data[0] } : { paid: false });
    setLoading(false);
  };

  const issueFine = () => {
    const w = window.open("", "_blank");
    w.document.write(`<html><head><title>Parking Fine</title>
    <style>body{font-family:Arial,sans-serif;max-width:400px;margin:40px auto;padding:20px;border:3px solid #1a1a1a}
    .red{color:#DC2626}.bold{font-weight:700}.row{display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #eee;font-size:14px}
    .amount{text-align:center;padding:20px;background:#FEE2E2;margin:20px 0;border-radius:8px}
    .pay{text-align:center;padding:16px;background:#f5f5f5;border-radius:8px;margin-top:16px;font-size:12px}
    </style></head><body>
    <h2 class="red" style="text-align:center">⚠ PARKING FINE</h2>
    <p style="text-align:center;color:#666;font-size:12px">Park&Skip Enforcement</p>
    <div class="row"><span>Plate</span><span class="bold">${plate.toUpperCase()}</span></div>
    <div class="row"><span>Location</span><span class="bold">${lot.name}</span></div>
    <div class="row"><span>Address</span><span>${lot.address}</span></div>
    <div class="row"><span>Date & Time</span><span>${new Date().toLocaleString("en-CA")}</span></div>
    <div class="row"><span>Violation</span><span class="bold red">Unpaid Parking</span></div>
    <div class="amount"><div style="font-size:12px;color:#666">FINE AMOUNT</div>
    <div style="font-size:40px;font-weight:700;color:#DC2626">CA$${lot.fine_amount||50}</div></div>
    <div class="pay"><strong>Pay online to avoid additional fees:</strong><br>park-skip.vercel.app/?lot=${lotId}</div>
    <p style="text-align:center;font-size:11px;color:#999;margin-top:20px">Issued by authorized parking enforcement officer.<br>Failure to pay may result in additional penalties.</p>
    </body></html>`);
    w.document.close(); w.print();
    setFineIssued(true);
  };

  const startScan = async () => {
    setScanning(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch { setScanning(false); alert("Camera access denied."); }
  };

  const stopScan = () => {
    if (videoRef.current?.srcObject) videoRef.current.srcObject.getTracks().forEach(t => t.stop());
    setScanning(false);
  };

  if (!lotId || notFound) return (
    <div style={S.page}>
      <div style={S.centered}>
        <div style={S.logo}>Park&Skip</div>
        <p style={{color:"#888",fontSize:"15px",textAlign:"center"}}>Invalid or inactive lot. Contact Park&Skip support.</p>
      </div>
    </div>
  );

  if (!lot) return (
    <div style={S.page}><div style={S.centered}><div style={S.logo}>Park&Skip</div><p style={{color:"#888"}}>Loading...</p></div></div>
  );

  return (
    <div style={S.page}>
      {/* Header */}
      <div style={S.header}>
        <div>
          <div style={S.logo}>Park&Skip</div>
          <div style={S.lotName}>{lot.name}</div>
          <div style={S.lotAddr}>{lot.address}</div>
        </div>
        <div style={{...S.activeBadge}}>● ACTIVE</div>
      </div>

      {/* Tabs */}
      <div style={S.tabs}>
        {[["dashboard","📋 Overview"],["patrol","🚔 Patrol"],["transactions","💳 Payments"]].map(([id,label])=>(
          <button key={id} style={{...S.tab,...(tab===id?S.tabActive:{})}} onClick={()=>setTab(id)}>{label}</button>
        ))}
      </div>

      {/* Content */}
      <div style={S.content}>

        {/* OVERVIEW TAB */}
        {tab==="dashboard" && (
          <div>
            <div style={S.statsRow}>
              <div style={S.statCard}>
                <div style={S.statLabel}>LOT NAME</div>
                <div style={S.statValue}>{lot.name}</div>
              </div>
              <div style={S.statCard}>
                <div style={S.statLabel}>FINE AMOUNT</div>
                <div style={{...S.statValue,color:"#DC2626"}}>CA${lot.fine_amount||50}</div>
              </div>
              <div style={S.statCard}>
                <div style={S.statLabel}>CAPACITY</div>
                <div style={S.statValue}>{lot.capacity||"—"} spots</div>
              </div>
            </div>
            <div style={S.infoCard}>
              <div style={S.infoTitle}>PRICING</div>
              <div style={S.priceGrid}>
                {[["1 Hour",lot.price_1hr],["2 Hours",lot.price_2hr],["4 Hours",lot.price_4hr],["8 Hours",lot.price_8hr],["24 Hours",lot.price_24hr]].filter(([,v])=>v).map(([l,v])=>(
                  <div key={l} style={S.priceItem}>
                    <div style={S.priceLabel}>{l}</div>
                    <div style={S.priceVal}>CA${v}</div>
                  </div>
                ))}
              </div>
            </div>
            <div style={S.infoCard}>
              <div style={S.infoTitle}>YOUR PARKING LINK</div>
              <div style={S.linkBox}>park-skip.vercel.app/?lot={lotId.slice(0,8)}...</div>
              <p style={{fontSize:"12px",color:"#888",margin:"8px 0 0"}}>Share this with parkers or use your QR code.</p>
            </div>
          </div>
        )}

        {/* PATROL TAB */}
        {tab==="patrol" && (
          <div>
            <div style={S.infoCard}>
              <div style={S.infoTitle}>PLATE LOOKUP</div>
              <p style={{fontSize:"13px",color:"#666",margin:"0 0 16px"}}>Check if a vehicle has paid. Fine amount: <strong>CA${lot.fine_amount||50}</strong></p>
              <div style={S.inputRow}>
                <input
                  style={S.plateInput}
                  value={plate}
                  onChange={e=>setPlate(e.target.value.toUpperCase())}
                  onKeyDown={e=>e.key==="Enter"&&checkPlate()}
                  placeholder="PLATE NUMBER"
                  maxLength={10}
                  autoFocus
                />
                <button style={S.scanBtn} onClick={scanning?stopScan:startScan}>{scanning?"✕":"📷"}</button>
              </div>
              {scanning && (
                <div style={{margin:"12px 0",borderRadius:"8px",overflow:"hidden",border:"2px solid #C9A84C"}}>
                  <video ref={videoRef} autoPlay playsInline style={{width:"100%",display:"block"}}/>
                  <p style={{textAlign:"center",fontSize:"12px",color:"#888",padding:"8px"}}>Point camera at plate, then type above</p>
                </div>
              )}
              <button style={{...S.checkBtn,opacity:loading?0.7:1}} onClick={checkPlate} disabled={loading}>
                {loading?"CHECKING...":"CHECK PLATE →"}
              </button>
            </div>

            {result && (
              <div style={{...S.resultCard,borderColor:result.paid?"#16A34A":"#DC2626",backgroundColor:result.paid?"#DCFCE7":"#FEE2E2"}}>
                <div style={S.resultIcon}>{result.paid?"✅":"❌"}</div>
                <div style={{...S.resultTitle,color:result.paid?"#16A34A":"#DC2626"}}>{result.paid?"PAID":"NOT PAID"}</div>
                {result.paid ? (
                  <>
                    <p style={S.resultSub}>Valid parking session found.</p>
                    <div style={S.txBox}>
                      {[["Duration",result.tx.duration],["Amount",`CA$${result.tx.total}`],["Time",new Date(result.tx.created_at).toLocaleTimeString("en-CA",{hour:"2-digit",minute:"2-digit"})]].map(([l,v])=>(
                        <div key={l} style={S.txRow}><span style={{color:"#666"}}>{l}</span><span style={{fontWeight:600}}>{v}</span></div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <p style={S.resultSub}>No valid payment for <strong>{plate}</strong>.</p>
                    {!fineIssued ? (
                      <button style={S.fineBtn} onClick={issueFine}>⚠ ISSUE CA${lot.fine_amount||50} FINE</button>
                    ) : (
                      <div style={{textAlign:"center",marginTop:"12px"}}>
                        <p style={{fontSize:"13px",color:"#444"}}>🖨 Fine ticket sent to printer.</p>
                        <button style={{...S.fineBtn,backgroundColor:"#666",marginTop:"8px"}} onClick={()=>{setResult(null);setPlate("");setFineIssued(false);}}>Check Another Plate</button>
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {/* TRANSACTIONS TAB */}
        {tab==="transactions" && (
          <div style={S.infoCard}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:"16px"}}>
              <div style={S.infoTitle}>RECENT PAYMENTS</div>
              <button onClick={fetchTransactions} style={S.refreshBtn}>Refresh</button>
            </div>
            {transactions.length===0 ? (
              <p style={{color:"#888",fontSize:"14px",textAlign:"center",padding:"24px"}}>No payments yet.</p>
            ) : (
              <div style={{overflowX:"auto"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:"13px",fontFamily:"sans-serif"}}>
                  <thead>
                    <tr style={{backgroundColor:"#F5F5F5"}}>
                      {["Plate","Duration","Amount","Time"].map(h=>(
                        <th key={h} style={{padding:"10px 12px",textAlign:"left",fontSize:"11px",fontWeight:700,color:"#888",letterSpacing:"0.08em",textTransform:"uppercase",borderBottom:"1px solid #E0E0E0"}}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {transactions.map((tx,i)=>(
                      <tr key={tx.id||i} style={{borderBottom:"1px solid #F0F0F0"}}>
                        <td style={{padding:"12px",fontWeight:600,fontFamily:"monospace",color:"#1a1a1a"}}>{tx.plate}</td>
                        <td style={{padding:"12px",color:"#444"}}>{tx.duration}</td>
                        <td style={{padding:"12px",color:"#16A34A",fontWeight:600}}>CA${tx.total}</td>
                        <td style={{padding:"12px",color:"#888"}}>{new Date(tx.created_at).toLocaleString("en-CA",{month:"short",day:"numeric",hour:"2-digit",minute:"2-digit"})}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  page:{minHeight:"100vh",width:"100%",backgroundColor:"#F5F5F5",fontFamily:"'Cormorant Garamond',Georgia,serif"},
  centered:{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",minHeight:"100vh",gap:"16px"},
  header:{backgroundColor:"#1A1A1A",padding:"20px 24px",display:"flex",justifyContent:"space-between",alignItems:"flex-start"},
  logo:{fontSize:"20px",fontWeight:700,color:"#FFFFFF",letterSpacing:"0.05em",fontFamily:"sans-serif"},
  lotName:{fontSize:"15px",color:"rgba(255,255,255,0.7)",marginTop:"4px"},
  lotAddr:{fontSize:"12px",color:"rgba(255,255,255,0.4)",marginTop:"2px"},
  activeBadge:{backgroundColor:"#DCFCE7",color:"#16A34A",fontSize:"11px",fontWeight:700,padding:"4px 12px",borderRadius:"20px",fontFamily:"sans-serif"},
  tabs:{display:"flex",backgroundColor:"#fff",borderBottom:"1px solid #E0E0E0"},
  tab:{flex:1,padding:"14px 8px",border:"none",backgroundColor:"transparent",fontSize:"13px",cursor:"pointer",color:"#888",fontFamily:"sans-serif",borderBottom:"2px solid transparent"},
  tabActive:{color:"#1a1a1a",fontWeight:700,borderBottom:"2px solid #1a1a1a"},
  content:{padding:"16px"},
  statsRow:{display:"flex",gap:"12px",marginBottom:"16px",flexWrap:"wrap"},
  statCard:{flex:1,minWidth:"100px",backgroundColor:"#fff",border:"1px solid #E0E0E0",borderRadius:"8px",padding:"16px",textAlign:"center"},
  statLabel:{fontSize:"10px",letterSpacing:"0.15em",color:"#888",textTransform:"uppercase",fontFamily:"sans-serif",marginBottom:"6px"},
  statValue:{fontSize:"20px",fontWeight:700,color:"#1a1a1a",fontFamily:"sans-serif"},
  infoCard:{backgroundColor:"#fff",border:"1px solid #E0E0E0",borderRadius:"8px",padding:"20px",marginBottom:"16px"},
  infoTitle:{fontSize:"11px",letterSpacing:"0.2em",color:"#888",textTransform:"uppercase",fontFamily:"sans-serif",marginBottom:"16px",fontWeight:700},
  priceGrid:{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(100px,1fr))",gap:"10px"},
  priceItem:{backgroundColor:"#F5F5F5",borderRadius:"6px",padding:"12px",textAlign:"center"},
  priceLabel:{fontSize:"11px",color:"#888",fontFamily:"sans-serif"},
  priceVal:{fontSize:"18px",fontWeight:700,color:"#1a1a1a",fontFamily:"sans-serif",marginTop:"4px"},
  linkBox:{backgroundColor:"#F5F5F5",borderRadius:"6px",padding:"12px",fontSize:"13px",color:"#444",fontFamily:"monospace",wordBreak:"break-all"},
  inputRow:{display:"flex",gap:"8px",marginBottom:"12px"},
  plateInput:{flex:1,padding:"14px 16px",border:"2px solid #E0E0E0",borderRadius:"8px",fontSize:"20px",fontFamily:"monospace",color:"#1a1a1a",outline:"none",letterSpacing:"0.1em",textTransform:"uppercase"},
  scanBtn:{padding:"14px 16px",border:"2px solid #E0E0E0",borderRadius:"8px",fontSize:"20px",cursor:"pointer",backgroundColor:"#fff"},
  checkBtn:{width:"100%",backgroundColor:"#1A1A1A",color:"#fff",border:"none",padding:"16px",fontSize:"14px",fontWeight:700,cursor:"pointer",borderRadius:"8px",letterSpacing:"0.05em",fontFamily:"sans-serif"},
  resultCard:{borderRadius:"10px",padding:"24px",textAlign:"center",border:"2px solid",marginTop:"16px"},
  resultIcon:{fontSize:"36px",marginBottom:"8px"},
  resultTitle:{fontSize:"22px",fontWeight:700,letterSpacing:"0.1em",fontFamily:"sans-serif"},
  resultSub:{fontSize:"14px",color:"#444",margin:"6px 0",fontFamily:"sans-serif"},
  txBox:{backgroundColor:"rgba(255,255,255,0.7)",borderRadius:"8px",padding:"12px",marginTop:"12px",textAlign:"left"},
  txRow:{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:"13px",fontFamily:"sans-serif"},
  fineBtn:{width:"100%",marginTop:"16px",backgroundColor:"#DC2626",color:"#fff",border:"none",padding:"16px",fontSize:"14px",fontWeight:700,cursor:"pointer",borderRadius:"8px",fontFamily:"sans-serif"},
  refreshBtn:{backgroundColor:"#F5F5F5",border:"1px solid #E0E0E0",borderRadius:"6px",padding:"6px 14px",fontSize:"12px",cursor:"pointer",color:"#444",fontFamily:"sans-serif"},
};
