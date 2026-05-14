import React, { useRef, useState, useEffect } from 'react';
import { Trash2, Undo2, PenTool } from 'lucide-react';

const DrawingCanvas = ({ strokes = [], onSave }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentStrokes, setCurrentStrokes] = useState(strokes);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const updateSize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      ctx.scale(dpr, dpr);
      redraw();
    };

    const resizeObserver = new ResizeObserver(updateSize);
    resizeObserver.observe(canvas.parentElement || canvas);
    
    updateSize();
    return () => resizeObserver.disconnect();
  }, []);

  const redraw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    currentStrokes.forEach(stroke => {
      if (stroke.length < 2) return;
      ctx.beginPath();
      ctx.strokeStyle = '#635F40';
      ctx.lineWidth = 3;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(stroke[0].x, stroke[0].y);
      for (let i = 1; i < stroke.length; i++) {
        ctx.lineTo(stroke[i].x, stroke[i].y);
      }
      ctx.stroke();
    });
  };

  useEffect(redraw, [currentStrokes]);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Map screen mouse coordinates to element coordinates accurately
    const scaleX = canvas.width / rect.width / (window.devicePixelRatio || 1);
    const scaleY = canvas.height / rect.height / (window.devicePixelRatio || 1);

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  const start = (e) => {
    setIsDrawing(true);
    const pos = getPos(e);
    setCurrentStrokes([...currentStrokes, [pos]]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const pos = getPos(e);
    const newStrokes = [...currentStrokes];
    const lastStroke = newStrokes[newStrokes.length - 1];
    
    // Minimal distance to avoid duplicate points
    const lastPos = lastStroke[lastStroke.length - 1];
    if (Math.hypot(pos.x - lastPos.x, pos.y - lastPos.y) > 1) {
      lastStroke.push(pos);
      setCurrentStrokes(newStrokes);
    }
  };

  const stop = () => {
    setIsDrawing(false);
    onSave?.(currentStrokes);
  };

  const clear = () => {
    setCurrentStrokes([]);
    onSave?.([]);
  };

  const undo = () => {
    const newStrokes = [...currentStrokes];
    newStrokes.pop();
    setCurrentStrokes(newStrokes);
    onSave?.(newStrokes);
  };

  return (
    <div className="canvas-wrapper">
      <div className="canvas-toolbar">
        <button onClick={clear} className="btn-secondary" title="Borrar todo">
          <Trash2 size={18} />
        </button>
        <button onClick={undo} className="btn-secondary" title="Deshacer">
          <Undo2 size={18} />
        </button>
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--primary)', fontWeight:600 }}>
          <PenTool size={18} />
          <span>Modo Libre</span>
        </div>
      </div>
      <canvas
        ref={canvasRef}
        onMouseDown={start}
        onMouseMove={draw}
        onMouseUp={stop}
        onMouseLeave={stop}
        onTouchStart={start}
        onTouchMove={draw}
        onTouchEnd={stop}
      />
    </div>
  );
};

export default DrawingCanvas;
