import React from "react";

const LoadingForEndUser = () => {
  return (
    <>
      <style>{`
        .spinner {
          position: relative;
          width: 50px;
          height: 50px;
          margin: 50px auto;
        }

        .spinner div {
          position: absolute;
          width: 4px;
          height: 20px;
          background: #000;
          left: 50%;
          top: 50%;
          transform-origin: center -15px;
          animation: spinner-fzua35 1s infinite ease-in-out;
        }

        .spinner div:nth-child(1) { transform: rotate(36deg); animation-delay: 0.1s; }
        .spinner div:nth-child(2) { transform: rotate(72deg); animation-delay: 0.2s; }
        .spinner div:nth-child(3) { transform: rotate(108deg); animation-delay: 0.3s; }
        .spinner div:nth-child(4) { transform: rotate(144deg); animation-delay: 0.4s; }
        .spinner div:nth-child(5) { transform: rotate(180deg); animation-delay: 0.5s; }
        .spinner div:nth-child(6) { transform: rotate(216deg); animation-delay: 0.6s; }
        .spinner div:nth-child(7) { transform: rotate(252deg); animation-delay: 0.7s; }
        .spinner div:nth-child(8) { transform: rotate(288deg); animation-delay: 0.8s; }
        .spinner div:nth-child(9) { transform: rotate(324deg); animation-delay: 0.9s; }
        .spinner div:nth-child(10) { transform: rotate(360deg); animation-delay: 1s; }

        @keyframes spinner-fzua35 {
          0%, 100% {
            opacity: 0.3;
          }
          50% {
            opacity: 1;
            transform: scale(1.3);
          }
        }
      `}</style>

      <div className="spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </>
  );
};

export default LoadingForEndUser;