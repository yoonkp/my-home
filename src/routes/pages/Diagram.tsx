import React, { useRef, useEffect } from "react";
import { gsap } from "gsap";

const VennDiagram: React.FC = () => {
  const aRef = useRef<HTMLDivElement>(null);
  const bRef = useRef<HTMLDivElement>(null);
  const cRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 애니메이션
    if (aRef.current && bRef.current && cRef.current) {
      gsap.fromTo([aRef.current, bRef.current, cRef.current], { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 1.5, stagger: 0.5 });
    }
  }, []);

  return (
    <div style={{ position: "relative", width: "400px", height: "400px", margin: "auto" }}>
      {/* A (작업환경) */}
      <div
        ref={aRef}
        style={{
          position: "absolute",
          top: "50px",
          left: "100px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(255, 0, 0, 0.5)",
        }}
      >
        <p style={{ textAlign: "center", marginTop: "90px", fontWeight: "bold" }}>작업환경 (A)</p>
      </div>

      {/* B (실시간 반응 속도) */}
      <div
        ref={bRef}
        style={{
          position: "absolute",
          top: "50px",
          left: "200px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(0, 255, 0, 0.5)",
        }}
      >
        <p style={{ textAlign: "center", marginTop: "90px", fontWeight: "bold" }}>실시간 반응 속도 (B)</p>
      </div>

      {/* C (아키텍처 이해도) */}
      <div
        ref={cRef}
        style={{
          position: "absolute",
          top: "150px",
          left: "150px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: "rgba(0, 0, 255, 0.5)",
        }}
      >
        <p style={{ textAlign: "center", marginTop: "90px", fontWeight: "bold" }}>아키텍처 이해도 (C)</p>
      </div>
    </div>
  );
};

export default VennDiagram;
