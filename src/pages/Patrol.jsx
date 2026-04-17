import { useState, useEffect, useRef } from "react";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY;

export default function Patrol() {
  const [lot, setLot] = useState(null);
  const [plate, setPlate] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [issuing, setIssuing] = useState(false);
  const [fineIssued, setFineIssued] = useState(false);
  const [scanning, setScanning] = useState(false);
  const videoRef = useRef(null);

  const lotId = new URLSearchParams(window.location.search).get("lot");

  useEffect(() => {
    if (!lotId) return;
    fetch(`${SUPABASE_URL}/rest/v1/lots?id=eq.${lotId}&active=eq.true`, {
      headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
    }).then(r => r.json()).then(d => setLot(d[0] || null));
  }, [lotId]);

  const checkPlate = async () => {
    if (!plate.trim()) return;
    setLoading(true);
    setResult(null);
    setFineIssued(false);
    const now = new Date();
    const oneHourAgo = new Date(now - 60 * 60 * 1000).toISOString();
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/transactions?lot_id=eq.${lotId}&plate=eq.${plate.toUpperCase().trim()}&created_at=gte.${oneHourAgo}&order=created_at.desc&limit=1`,
      { headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` } }
    );
    const data = await res.json();
    setResult(data.length > 0 ? { paid: true, tx: data[0] } : { paid: false });
    setLoading(false);
  };

  const issueFine = async () => {
    setIssuing(true);
    const fineData = {
      plate: plate.toUpperCase().trim(),
      lot_name: lot.name,
      lot_address: lot.address,
      fine_amount: lot.fine_amount || 50,
      issued_at: new Date().toLocaleString("en-CA"),
      lot_id: lotId,
    };
    // Print ticket
    const w = window.open("", "_blank");
    w.document.write(`
      <html><head><title>Parking Fine — ${fineData.plate}</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 400px; margin: 40px auto; padding: 20px; border: 3px solid #1a1a1a; }
        .header { text-align: center; border-bottom: 2px solid #1a1a1a; padding-bottom: 16px; margin-bottom: 20px; }
        .title { font-size: 24px; font-weight: bold; color: #C0392B; letter-spacing: 0.1em; }
        .subtitle { font-size: 12px; color: #666; margin-top: 4px; }
        .row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #eee; font-size: 14px; }
        .label { color: #666; font-size: 12px; text-transform: uppercase; }
        .value { font-weight: bold; color: #1a1a1a; }
        .fine-amount { text-align: center; padding: 20px; background: #FEE2E2; border-radius: 8px; margin: 20px 0; }
        .fine-number { font-size: 36px; font-weight: bold; color: #C0392B; }
        .pay-section { text-align: center; margin-top: 20px; padding: 16px; background: #F5F5F5; border-radius: 8px; }
        .pay-url { font-size: 12px; color: #444; word-break: break-all; }
        .footer { text-align: center; font-size: 11px; color: #999; margin-top: 20px; }
        @media print { body { border: 3px solid #1a1a1a; } }
      </style></head><body>
      <div class="header">
        <div class="title">⚠ PARKING FINE</div>
        <div class="subtitle">Park&Skip Enforcement</div>
      </div>
      <div class="row"><span class="label">Plate</span><span class="value">${fineData.plate}</span></div>
      <div class="row"><span class="label">Location</span><span class="value">${fineData.lot_name}</span></div>
      <div class="row"><span class="label">Address</span><span class="value">${fineData.lot_address}</span></div>
      <div class="row"><span class="label">Date & Time</span><span class="value">${fineData.issued_at}</span></div>
      <div class="row"><span class="label">Violation</span><span class="value">Unpaid Parking</span></div>
      <div class="fine-amount">
        <div style="font-size:12px;color:#666;margin-bottom:4px">FINE AMOUNT</div>
        <div class="fine-number">CA$${fineData.fine_amount}</div>
      </div>
      <div class="pay-section">
        <div style="font-size:13px;font-weight:bold;margin-bottom:8px">Pay online to avoid additional fees:</div>
        <div class="pay-url">park-skip.vercel.app/?lot=${lotId}</div>
      </div>
      <div class="footer">
        This notice was issued by an authorized parking enforcement officer.<br>
        Failure to pay may result in additional penalties.
      </div>
      </body></html>
    `);
    w.document.close();
    w.print();
    setFineIssued(true);
    setIssuing(false);
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

  if (!lotId) return (
    <div style={S.page}>
      <div style={S.card}>
        <h2 style={S.title}>PATROL LOOKUP</h2>
        <p style={{color:"#888",fontSize:"14px"}}>No lot ID provided. Use the link given by your lot manager.</p>
      </div>
    </div>
  );

  if (!lot) return (
    <div style={S.page}>
      <div style={S.card}>
        <h2 style={S.title}>PATROL LOOKUP</h2>
        <p style={{color:"#888",fontSize:"14px"}}>Loading lot info...</p>
      </div>
    </div>
  );

  return (
    <div style={S.page}>
      <div style={S.card}>
        {/* Header */}
        <div style={S.header}>
          <div style={S.badge}>PATROL</div>
          <h1 style={S.lotName}>{lot.name}</h1>
          <p style={S.lotAddress}>{lot.address}</p>
          <p style={S.fineNote}>Fine amount: <strong>CA${lot.fine_amount || 50}</strong></p>
        </div>

        {/* Input */}
        <div style={S.inputSection}>
          <label style={S.label}>LICENCE PLATE</label>
          <div style={S.inputRow}>
            <input
              style={S.input}
              value={plate}
              onChange={e => setPlate(e.target.value.toUpperCase())}
              onKeyDown={e => e.key === "Enter" && checkPlate()}
              placeholder="e.g. ABCD 123"
              maxLength={10}
              autoFocus
            />
            <button style={S.scanBtn} onClick={scanning ? stopScan : startScan}>
              {scanning ? "✕" : "📷"}
            </button>
          </div>

          {scanning && (
            <div style={{margin:"12px 0",borderRadius:"8px",overflow:"hidden",border:"2px solid #C9A84C"}}>
              <video ref={videoRef} autoPlay playsInline style={{width:"100%",display:"block"}} />
              <p style={{textAlign:"center",fontSize:"12px",color:"#888",padding:"8px"}}>Point camera at plate, then type what you see above</p>
            </div>
          )}

          <button style={{...S.checkBtn, opacity: loading ? 0.7 : 1}} onClick={checkPlate} disabled={loading}>
            {loading ? "CHECKING..." : "CHECK PLATE →"}
          </button>
        </div>

        {/* Result */}
        {result && (
          <div style={{...S.result, backgroundColor: result.paid ? "#DCFCE7" : "#FEE2E2", border: `2px solid ${result.paid ? "#16A34A" : "#DC2626"}`}}>
            {result.paid ? (
              <>
                <div style={S.resultIcon}>✅</div>
                <div style={{...S.resultTitle, color:"#16A34A"}}>PAID</div>
                <p style={S.resultSub}>This vehicle has a valid parking session.</p>
                <div style={S.txDetails}>
                  <div style={S.txRow}><span>Duration</span><span>{result.tx.duration}</span></div>
                  <div style={S.txRow}><span>Amount</span><span>CA${result.tx.total}</span></div>
                  <div style={S.txRow}><span>Time</span><span>{new Date(result.tx.created_at).toLocaleTimeString("en-CA", {hour:"2-digit",minute:"2-digit"})}</span></div>
                </div>
              </>
            ) : (
              <>
                <div style={S.resultIcon}>❌</div>
                <div style={{...S.resultTitle, color:"#DC2626"}}>NOT PAID</div>
                <p style={S.resultSub}>No valid payment found for <strong>{plate}</strong>.</p>
                {!fineIssued ? (
                  <button style={S.fineBtn} onClick={issueFine} disabled={issuing}>
                    {issuing ? "GENERATING..." : `⚠ ISSUE CA$${lot.fine_amount || 50} FINE`}
                  </button>
                ) : (
                  <div style={{textAlign:"center",padding:"12px",backgroundColor:"#fff",borderRadius:"8px",marginTop:"12px"}}>
                    <div style={{fontSize:"20px"}}>🖨</div>
                    <p style={{fontSize:"13px",color:"#444",margin:"4px 0"}}>Fine ticket opened for printing.</p>
                    <button style={{...S.fineBtn,backgroundColor:"#666",marginTop:"8px"}} onClick={() => { setResult(null); setPlate(""); setFineIssued(false); }}>
                      Check Another Plate
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const S = {
  page:{minHeight:"100vh",backgroundColor:"#F5F5F5",display:"flex",alignItems:"flex-start",justifyContent:"center",padding:"20px 16px",fontFamily:"'Cormorant Garamond',Georgia,serif"},
  card:{width:"100%",maxWidth:"480px",backgroundColor:"#fff",borderRadius:"12px",boxShadow:"0 4px 24px rgba(0,0,0,0.08)",overflow:"hidden"},
  header:{backgroundColor:"#1A1A1A",padding:"24px",textAlign:"center"},
  badge:{display:"inline-block",border:"1px solid rgba(201,168,76,0.6)",color:"#C9A84C",fontSize:"10px",letterSpacing:"0.3em",padding:"3px 10px",marginBottom:"12px"},
  lotName:{margin:0,fontSize:"22px",fontWeight:300,letterSpacing:"0.15em",color:"#FFFFFF"},
  lotAddress:{margin:"6px 0 0",fontSize:"13px",color:"rgba(255,255,255,0.5)"},
  fineNote:{margin:"8px 0 0",fontSize:"12px",color:"rgba(255,255,255,0.4)"},
  inputSection:{padding:"24px"},
  label:{display:"block",fontSize:"11px",letterSpacing:"0.15em",color:"#888",marginBottom:"8px",textTransform:"uppercase",fontFamily:"sans-serif"},
  inputRow:{display:"flex",gap:"8px",marginBottom:"12px"},
  input:{flex:1,padding:"14px 16px",border:"2px solid #E0E0E0",borderRadius:"8px",fontSize:"20px",fontFamily:"'Courier New',monospace",color:"#1a1a1a",outline:"none",letterSpacing:"0.1em",textTransform:"uppercase"},
  scanBtn:{padding:"14px 16px",border:"2px solid #E0E0E0",borderRadius:"8px",fontSize:"20px",cursor:"pointer",backgroundColor:"#fff"},
  checkBtn:{width:"100%",backgroundColor:"#1A1A1A",color:"#fff",border:"none",padding:"16px",fontSize:"14px",fontWeight:"600",cursor:"pointer",borderRadius:"8px",letterSpacing:"0.1em",fontFamily:"sans-serif"},
  result:{margin:"0 24px 24px",borderRadius:"10px",padding:"24px",textAlign:"center"},
  resultIcon:{fontSize:"36px",marginBottom:"8px"},
  resultTitle:{fontSize:"22px",fontWeight:"700",letterSpacing:"0.15em",fontFamily:"sans-serif"},
  resultSub:{fontSize:"14px",color:"#444",margin:"6px 0 0",fontFamily:"sans-serif"},
  txDetails:{backgroundColor:"rgba(255,255,255,0.7)",borderRadius:"8px",padding:"12px",marginTop:"12px",textAlign:"left"},
  txRow:{display:"flex",justifyContent:"space-between",padding:"4px 0",fontSize:"13px",fontFamily:"sans-serif",color:"#444"},
  fineBtn:{width:"100%",marginTop:"16px",backgroundColor:"#DC2626",color:"#fff",border:"none",padding:"16px",fontSize:"14px",fontWeight:"700",cursor:"pointer",borderRadius:"8px",letterSpacing:"0.05em",fontFamily:"sans-serif"},
  title:{fontSize:"20px",fontWeight:400,letterSpacing:"0.2em",color:"#1a1a1a"},
};
