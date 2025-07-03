import React from 'react';

interface TypeCardProps {
  typeId: string;
  name: string;
  subtitle: string;
  icon?: string;
  description: string;
}

const typeColors: { [key: string]: string } = {
  FV: 'from-pink-400 to-pink-200',
  VA: 'from-cyan-400 to-cyan-100',
  HC: 'from-blue-400 to-blue-100',
  MB: 'from-green-400 to-green-100',
  AT: 'from-yellow-300 to-yellow-100',
  GS: 'from-purple-400 to-purple-100',
};

export default function TypeCard({ typeId, name, subtitle, icon, description }: TypeCardProps) {
  return (
    <div
      className={`bg-gradient-to-br ${typeColors[typeId] || 'from-gray-200 to-gray-50'} rounded-xl shadow-lg p-6 flex flex-col items-center transition-transform hover:scale-105 duration-200`}
    >
      <div className="text-4xl mb-2">{icon}</div>
      <h3 className="text-2xl font-bold text-gray-800 mb-1">{name}</h3>
      <div className="text-md text-blue-700 font-semibold mb-2">{subtitle}</div>
      <p className="text-gray-700 text-center text-sm whitespace-pre-line line-clamp-4">{description}</p>
    </div>
  );
} 