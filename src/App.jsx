import React, { useEffect, useRef } from 'react';
import './App.css';

function App() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let animationFrameId;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const mouse = { x: width / 2, y: height / 2 };

    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('resize', handleResize);

    // Underwater Bubbles Configuration
    const numBubbles = 50;
    const bubbles = Array.from({ length: numBubbles }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 3.5 + 1.5,
      speedY: Math.random() * 1.2 + 0.4,
      wobbleAmp: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.2,
    }));

    // Fish Spine Segments
    const numSegments = 30;
    const segments = Array.from({ length: numSegments }, () => ({
      x: mouse.x,
      y: mouse.y,
      angle: 0,
    }));

    // Realistic Fish SVG Head & Pectoral Fins Drawing
    const drawFishHeadSVG = (x, y, angle) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);

      ctx.shadowBlur = 12;
      ctx.shadowColor = '#00f3ff';

      // 1. Organic Flapping Side Pectoral Fins (Transparent Flowy Vector Fins)
      const finTime = Date.now() * 0.012;
      const finFlap = Math.sin(finTime) * 10;

      ctx.fillStyle = 'rgba(0, 230, 255, 0.35)';
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 1.2;

      // Top / Left Fin SVG Vector
      ctx.beginPath();
      ctx.moveTo(-2, -14);
      ctx.bezierCurveTo(-15, -35 + finFlap, -42, -40 + finFlap, -30, -18);
      ctx.quadraticCurveTo(-18, -14, -2, -10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Bottom / Right Fin SVG Vector
      ctx.beginPath();
      ctx.moveTo(-2, 14);
      ctx.bezierCurveTo(-15, 35 - finFlap, -42, 40 - finFlap, -30, 18);
      ctx.quadraticCurveTo(-18, 14, -2, 10);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // 2. Realistic Fish Head Vector Contour (Smoothed Snout & Gills)
      const headGradient = ctx.createLinearGradient(32, 0, -18, 0);
      headGradient.addColorStop(0, '#00e5ff');
      headGradient.addColorStop(0.7, '#0088ff');
      headGradient.addColorStop(1, '#0055c4');

      ctx.fillStyle = headGradient;
      ctx.beginPath();
      ctx.moveTo(32, 0); // Rounded Snout Tip
      ctx.bezierCurveTo(24, -15, 6, -20, -18, -18);
      ctx.lineTo(-18, 18);
      ctx.bezierCurveTo(6, 20, 24, 15, 32, 0);
      ctx.closePath();
      ctx.fill();

      // 3. Gill Cover Overlay Accent Line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(-2, 0, 16, -Math.PI / 2.3, Math.PI / 2.3);
      ctx.stroke();

      // 4. Detailed Fish Eye Spheres
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#ffffff';
      ctx.shadowBlur = 8;

      // Outer White Eye
      ctx.beginPath();
      ctx.arc(14, -9, 3.5, 0, Math.PI * 2);
      ctx.arc(14, 9, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Black Iris & Pupil
      ctx.fillStyle = '#001a33';
      ctx.beginPath();
      ctx.arc(15, -9, 2, 0, Math.PI * 2);
      ctx.arc(15, 9, 2, 0, Math.PI * 2);
      ctx.fill();

      // Eye Reflection Light Spot
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(15.8, -9.8, 0.8, 0, Math.PI * 2);
      ctx.arc(15.8, 8.2, 0.8, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
    };

    // Realistic Water Background Render
    const drawWaterBackground = () => {
      const time = Date.now() * 0.0015;

      const oceanBg = ctx.createRadialGradient(
        width / 2, height / 3, 50,
        width / 2, height / 2, Math.max(width, height)
      );
      oceanBg.addColorStop(0, '#003a66');
      oceanBg.addColorStop(0.5, '#001b3a');
      oceanBg.addColorStop(1, '#000814');
      ctx.fillStyle = oceanBg;
      ctx.fillRect(0, 0, width, height);

      // Water Waves Layer
      ctx.save();
      ctx.globalAlpha = 0.12;
      for (let j = 0; j < 3; j++) {
        ctx.fillStyle = '#00d2ff';
        ctx.beginPath();
        ctx.moveTo(0, 0);
        for (let x = 0; x <= width; x += 25) {
          const y = Math.sin(x * 0.008 + time + j) * 20 + Math.cos(x * 0.015 - time) * 15 + (j * 40) + 30;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Bubbles
      bubbles.forEach((b) => {
        b.y -= b.speedY;
        b.x += Math.sin(time * 2 + b.y * 0.02) * b.wobbleAmp * 0.1;

        if (b.y < -10) {
          b.y = height + 10;
          b.x = Math.random() * width;
        }

        ctx.save();
        ctx.globalAlpha = b.opacity;
        ctx.strokeStyle = '#80e5ff';
        ctx.fillStyle = 'rgba(0, 225, 255, 0.12)';
        ctx.lineWidth = 1;
        
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(b.x - b.radius * 0.3, b.y - b.radius * 0.3, b.radius * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      });
    };

    const render = () => {
      drawWaterBackground();

      // Mouse Following Head Physics
      const head = segments[0];
      const dx = mouse.x - head.x;
      const dy = mouse.y - head.y;
      head.angle = Math.atan2(dy, dx);
      head.x += dx * 0.18;
      head.y += dy * 0.18;

      // Inverse Kinematics Body Mechanics
      for (let i = 1; i < numSegments; i++) {
        const prev = segments[i - 1];
        const curr = segments[i];

        const segDx = prev.x - curr.x;
        const segDy = prev.y - curr.y;
        curr.angle = Math.atan2(segDy, segDx);

        const targetX = prev.x - Math.cos(curr.angle) * 10;
        const targetY = prev.y - Math.sin(curr.angle) * 10;

        curr.x += (targetX - curr.x) * 0.45;
        curr.y += (targetY - curr.y) * 0.45;
      }

      // Render Fish Body Segments, Fins & Tail (Tail to Head)
      for (let i = numSegments - 1; i >= 1; i--) {
        const seg = segments[i];
        
        // Organic Fish Tapering Contour (Koi Fish Shape)
        const sizeRatio = Math.sin((i / numSegments) * Math.PI);
        const bodyRadius = Math.max(2, sizeRatio * 17);

        ctx.save();
        ctx.translate(seg.x, seg.y);
        ctx.rotate(seg.angle);

        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00f3ff';

        // Dorsal Fin (Top Wave Fin)
        if (i >= 8 && i <= 17) {
          ctx.fillStyle = 'rgba(0, 243, 255, 0.4)';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(0, -bodyRadius);
          ctx.bezierCurveTo(-8, -bodyRadius - 16, -22, -bodyRadius - 12, -16, -bodyRadius);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }

        // Smooth Fish Scale Body Layer
        const bodyGrad = ctx.createRadialGradient(0, -bodyRadius * 0.3, 1, 0, 0, bodyRadius);
        bodyGrad.addColorStop(0, '#80efff');
        bodyGrad.addColorStop(0.5, i % 2 === 0 ? '#00b4d8' : '#0077b6');
        bodyGrad.addColorStop(1, '#003a8c');

        ctx.fillStyle = bodyGrad;
        ctx.beginPath();
        ctx.arc(0, 0, bodyRadius, 0, Math.PI * 2);
        ctx.fill();

        // Realistic Flowing Tail Fin SVG at the back
        if (i === numSegments - 1) {
          const tailWave = Math.sin(Date.now() * 0.014) * 12;

          ctx.fillStyle = 'rgba(0, 220, 255, 0.65)';
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = 1.5;

          ctx.beginPath();
          ctx.moveTo(-2, 0);
          ctx.bezierCurveTo(-22, -30 + tailWave, -50, -42 + tailWave, -55, -22 + tailWave);
          ctx.bezierCurveTo(-38, 0, -55, 22 + tailWave, -50, 42 + tailWave);
          ctx.bezierCurveTo(-22, 30 + tailWave, -2, 0, -2, 0);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();

          // Tail Fin Vein Lines
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(-2, 0); ctx.lineTo(-48, -20 + tailWave);
          ctx.moveTo(-2, 0); ctx.lineTo(-42, 0 + tailWave);
          ctx.moveTo(-2, 0); ctx.lineTo(-48, 20 + tailWave);
          ctx.stroke();
        }

        ctx.restore();
      }

      // Draw Fish Head SVG
      drawFishHeadSVG(head.x, head.y, head.angle);

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fish-app">
      <canvas ref={canvasRef} className="fish-canvas" />
      <div className="overlay-text">
        <h1>Cyber Fish</h1>
      </div>
    </div>
  );
}

export default App;