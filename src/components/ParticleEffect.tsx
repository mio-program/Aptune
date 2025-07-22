'use client';

import React, { useEffect, useRef } from 'react';

export default function ParticleEffect() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const createParticle = () => {
      const particle = document.createElement('div');
      particle.className = 'particle';
      
      // ランダムな位置とサイズ
      const startX = Math.random() * window.innerWidth;
      const size = Math.random() * 3 + 1;
      const duration = Math.random() * 10 + 8;
      const delay = Math.random() * 5;
      
      particle.style.left = `${startX}px`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.animationDuration = `${duration}s`;
      particle.style.animationDelay = `${delay}s`;
      
      // ランダムな色（オレンジ系 or 緑系）
      const colors = ['#ff6b35', '#f7931e', '#ff4500', '#00ff41', '#00cc33'];
      particle.style.background = colors[Math.floor(Math.random() * colors.length)];
      particle.style.boxShadow = `0 0 10px ${particle.style.background}`;
      
      container.appendChild(particle);
      
      // アニメーション終了後に削除
      setTimeout(() => {
        if (container.contains(particle)) {
          container.removeChild(particle);
        }
      }, (duration + delay) * 1000);
    };

    // 初期パーティクル生成
    for (let i = 0; i < 20; i++) {
      setTimeout(() => createParticle(), i * 200);
    }

    // 定期的にパーティクル生成
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30%の確率で生成
        createParticle();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      // 既存のパーティクルをクリア
      const particles = container.querySelectorAll('.particle');
      particles.forEach(particle => particle.remove());
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className="particles"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: -1,
        overflow: 'hidden'
      }}
    />
  );
}