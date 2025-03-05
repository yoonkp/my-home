import React from "react";

export default function WaveEffect() {
  const waveStyles = `
    @keyframes wave {
      0% {
        transform: translateX(0) translateY(0);
      }
      50% {
        transform: translateX(-45%) translateY(-14px);
      }
      100% {
        transform: translateX(0) translateY(10);
      }
    }

    .waves {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 250px;
      background: transparent;
      overflow: hidden;
    }

    .wave {
      position: absolute;
      bottom: -40px;
      width: 200%;
      height: 200px;
      background: rgba(173, 216, 230, 0.7);
      border-radius: 45% 45% 0 0;
      animation: wave 8s linear infinite;

      &:nth-child(1) {
        animation-duration: 8s;
      }

      &:nth-child(2) {
        background: rgba(173, 216, 230, 0.5);
        animation-duration: 10s;
        animation-delay: -3s;
      }

      &:nth-child(3) {
        background: rgba(173, 216, 230, 0.3);
        animation-duration: 12s;
        animation-delay: -7s;
      }
    }
  `;

  return (
    <>
      <style>{waveStyles}</style>
      <div className="waves">
        <div className="wave"></div>
        <div className="wave"></div>
        <div className="wave"></div>
      </div>
    </>
  );
}
