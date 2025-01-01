import React from "react";

export default function CloudEffect() {
  const cloudStyles = `
    @keyframes moveClouds {
      0% {
        transform: translateX(-100%);
      }
      100% {
        transform: translateX(100%);
      }
    }

    .clouds {
      position: absolute;
      top: 20%;
      left: 0;
      width: 100%;
      height: 150px;
      overflow: hidden;
    }

    .cloud {
      position: absolute;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 50%;
      box-shadow: 50px 50px 100px rgba(0, 0, 0, 0.1),
                  -30px 30px 60px rgba(0, 0, 0, 0.05);
      animation: moveClouds linear infinite;

      &:nth-child(1) {
        width: 200px;
        height: 120px;
        top: 20%;
        animation-duration: 20s;
      }

      &:nth-child(2) {
        width: 250px;
        height: 150px;
        top: 50%;
        animation-duration: 25s;
      }

      &:nth-child(3) {
        width: 180px;
        height: 100px;
        top: 10%;
        animation-duration: 30s;
      }
    }
  `;

  return (
    <>
      <style>{cloudStyles}</style>
      <div className="clouds">
        <div className="cloud"></div>
        <div className="cloud"></div>
        <div className="cloud"></div>
      </div>
    </>
  );
}
