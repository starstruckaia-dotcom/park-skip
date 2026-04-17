export default function OnboardComplete() {
  return (
    <div style={{minHeight:"100vh",backgroundColor:"#0A0A0A",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',Georgia,serif",padding:"40px 16px"}}>
      <div style={{width:"100%",maxWidth:"520px",display:"flex",flexDirection:"column",alignItems:"center",gap:"32px",textAlign:"center"}}>
        <div style={{textAlign:"center"}}>
          <div style={{display:"inline-block",border:"1px solid rgba(201,168,76,0.4)",color:"#C9A84C",fontSize:"10px",letterSpacing:"0.3em",padding:"4px 10px",marginBottom:"12px"}}>P & S</div>
          <h1 style={{margin:0,fontSize:"clamp(28px,6vw,42px)",fontWeight:300,letterSpacing:"0.25em",color:"#F5F0E8"}}>PARK&amp;SKIP</h1>
        </div>
        <div style={{width:"100%",background:"rgba(255,255,255,0.03)",border:"1px solid rgba(255,255,255,0.08)",padding:"48px 32px",boxSizing:"border-box"}}>
          <div style={{width:"64px",height:"64px",border:"1px solid rgba(201,168,76,0.4)",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",color:"#C9A84C",fontSize:"28px",margin:"0 auto 28px"}}>✓</div>
          <h2 style={{margin:"0 0 12px",fontSize:"14px",fontWeight:400,letterSpacing:"0.25em",color:"#F5F0E8"}}>YOU'RE ALL SET</h2>
          <p style={{margin:"0 0 32px",fontSize:"14px",color:"rgba(255,255,255,0.4)",letterSpacing:"0.05em",lineHeight:1.7}}>Your lot has been registered and your bank account is connected. You're ready to start accepting parking payments through Park&Skip.</p>
          <div style={{borderTop:"1px solid rgba(255,255,255,0.06)",paddingTop:"28px",display:"flex",flexDirection:"column",gap:"12px"}}>
            <p style={{margin:0,fontSize:"11px",letterSpacing:"0.15em",color:"rgba(201,168,76,0.6)"}}>WHAT HAPPENS NEXT</p>
            {["We'll generate your QR code within 24 hours","You'll receive it by email to print and post","Payments go directly to your bank account"].map((s,i)=>(
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:"12px",textAlign:"left"}}>
                <span style={{color:"#C9A84C",fontSize:"11px",marginTop:"2px"}}>0{i+1}</span>
                <span style={{fontSize:"13px",color:"rgba(255,255,255,0.4)",letterSpacing:"0.03em"}}>{s}</span>
              </div>
            ))}
          </div>
        </div>
        <p style={{fontSize:"11px",color:"rgba(255,255,255,0.15)",letterSpacing:"0.1em"}}>© 2026 Park&amp;Skip</p>
      </div>
    </div>
  );
}
