import { useState, useRef, useEffect } from "react";

interface EffectModalProps {
  title: string;
  closeModal: () => void;
  EffectComponent: React.ComponentType; // 동적으로 렌더링할 컴포넌트
}

export default function EffectModal({ title, closeModal, EffectComponent }: EffectModalProps) {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const modal = modalRef.current;
    if (modal) {
      const rect = modal.getBoundingClientRect();
      setPosition({
        x: window.innerWidth / 2 - rect.width / 2,
        y: window.innerHeight / 2 - rect.height / 2,
      });
    }
  }, []);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (dragging) {
      setPosition({
        x: e.clientX - offset.x,
        y: e.clientY - offset.y,
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, offset]);

  return (
    <div
      ref={modalRef}
      className="modal-effect"
      style={{
        top: `${position.y}px`,
        left: `${position.x}px`,
        cursor: "grab",
      }}
      onMouseDown={handleMouseDown}
    >
      <div className="modal-top">
        <h2 className="title">{title}</h2>
        <button onClick={closeModal} className="btn-close">
          <i className="icon-close bgc-white"></i>
        </button>
      </div>
      <div className="modal-cont">
        <EffectComponent />
      </div>
    </div>
  );
}
