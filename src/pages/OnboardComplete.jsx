export default function OnboardComplete() {
  return (
    <div style={{minHeight:"100vh",backgroundColor:"#0A0A0A",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',Georgia,serif",padding:"40px 16px"}}>
      <div style={{width:"100%",maxWidth:"520px",display:"flex",flexDirection:"column",alignItems:"center",gap:"32px",textAlign:"center"}}>
        <div style={{textAlign:"center"}}>
          <div style={{display:"inline-block",border:"1px solid rgba(201,168,76,0.6)",color:"#C9A84C",fontSize:"11px",letterSpacing:"0.3em",padding:"4px 10px",marginBottom:"12px"}}>P & S</div>
          <h1 style={{margin:0,fontSize:"clamp(32px,6vw,48px)",fontWeight:300,letterSpacing:"0.25em",color:"#FFFFFF"}}>PARK&amp;SKIP</h1>
        </div>
        <div style={{width:"100%",background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.15)",padding:"48px 32px",boxSizing:"border-box"}}>
          <div style={{width:"72px",height:"72px",border:"2px solid #C9A84C",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#C9A84C",fontSize:"32px",margin:"0 auto 28px"}}>✓</div>
          <h2 style={{margin:"0 0 16px",fontSize:"20px",fontWeight:400,letterSpacing:"0.2em",color:"#FFFFFF"}}>YOU'RE ALL SET</h2>
          <p style={{margin:"0 0 32px",fontSize:"16px",color:"rgba(255,255,255,0.75)",letterSpacing:"0.02em",lineHeight:1.8}}>Your lot has been registered and your bank account is connected. You're ready to start accepting parking payments through Park&Skip.</p>
          <div style={{borderTop:"1px solid rgba(255,255,255,0.12)",paddingTop:"28px",display:"flex",flexDirection:"column",gap:"16px"}}>
            <p style={{margin:"0 0 8px",fontSize:"12px",letterSpacing:"0.2em",color:"#C9A84C",fontWeight:600}}>WHAT HAPPENS NEXT</p>
            {["We'll generate your QR code within 24 hours","You'll receive it by email to print and post","Payments go directly to your bank account"].map((s,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:"16px",textAlign:"left",background:"rgba(255,255,255,0.03)",padding:"14px 16px",border:"1px solid rgba(255,255,255,0.08)"}}>
                <span style={{color:"#C9A84C",fontSize:"13px",fontWeight:"bold",minWidth:"24px"}}>0{i+1}</span>
                <span style={{fontSize:"15px",color:"rgba(255,255,255,0.85)",lineHeight:1.5}}>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{fontSize:"12px",color:"rgba(255,255,255,0.3)",letterSpacing:"0.1em"}}>© 2026 Park&amp;Skip</p>
      </div>
    </div>
  );
}
