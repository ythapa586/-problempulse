
import React, { useEffect, useState, useMemo } from 'react';
// Fix: Import Problem from types and CATEGORIES from constants
import { Problem } from '../types';
import { CATEGORIES } from '../constants';
import { useNavigate } from 'react-router-dom';
import { Crosshair, MapPin, Loader2, AlertTriangle } from 'lucide-react';

interface ImpactHeatmapProps {
  problems: Problem[];
}

interface RadarPoint {
  problemId: string;
  x: number;
  y: number;
  size: number;
  color: string;
  title: string;
}

export const ImpactHeatmap: React.FC<ImpactHeatmapProps> = ({ problems }) => {
  const navigate = useNavigate();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
          setLoading(false);
        },
        () => setLoading(false)
      );
    } else {
      setLoading(false);
    }
  }, []);

  const radarPoints = useMemo(() => {
    const centerX = 50;
    const centerY = 50;
    
    return problems.map((p, idx) => {
      // Fix: Use the CATEGORIES constant instead of a hardcoded array to determine index
      const catIndex = (CATEGORIES as unknown as string[]).indexOf(p.category);
      const angle = (catIndex * 60) + (idx * 15 % 45); // Spread them within the slice
      const radian = (angle * Math.PI) / 180;
      
      // Map severity to radius (Critical is closer to center, Low is far)
      let radius = 40;
      let color = '#6366f1'; // Default indigo
      
      switch(p.severity) {
        case 'Critical': radius = 12; color = '#f43f5e'; break; // Rose
        case 'High': radius = 22; color = '#f59e0b'; break; // Amber
        case 'Medium': radius = 32; color = '#10b981'; break; // Emerald
        case 'Low': radius = 42; color = '#6366f1'; break; // Indigo
      }

      const x = centerX + radius * Math.cos(radian);
      const y = centerY + radius * Math.sin(radian);
      const size = (p.impactScore / 100) * 12 + 6;

      return {
        problemId: p.id,
        x,
        y,
        size,
        color,
        title: p.title
      };
    });
  }, [problems]);

  return (
    <div className="relative w-full aspect-[2/1] min-h-[400px] bg-slate-950 rounded-[2.5rem] overflow-hidden border border-slate-800 shadow-2xl group">
      {/* Background Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#1e293b 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
      
      {/* Radar Rings */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[15%] aspect-square border border-slate-800 rounded-full" />
        <div className="w-[35%] aspect-square border border-slate-800 rounded-full" />
        <div className="w-[55%] aspect-square border border-slate-800 rounded-full" />
        <div className="w-[75%] aspect-square border border-slate-800 rounded-full" />
        
        {/* Category Dividers */}
        {[0, 60, 120, 180, 240, 300].map(deg => (
          <div key={deg} className="absolute w-[80%] h-px bg-slate-800/50" style={{ transform: `rotate(${deg}deg)` }} />
        ))}
      </div>

      {/* Sweeping Line Animation */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-1/2 h-1/2 origin-left bg-gradient-to-r from-transparent to-indigo-500/10 animate-[spin_4s_linear_infinite]" 
             style={{ clipPath: 'polygon(0 50%, 100% 0, 100% 100%)' }} />
      </div>

      {/* Points */}
      {radarPoints.map((point) => (
        <button
          key={point.problemId}
          onClick={() => navigate(`/problem/${point.problemId}`)}
          className="absolute -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-150 group/point z-20"
          style={{ left: `${point.x}%`, top: `${point.y}%` }}
        >
          <div className="relative">
            <div className="absolute inset-0 animate-ping rounded-full opacity-40" style={{ backgroundColor: point.color }} />
            <div className="relative rounded-full border-2 border-white/20 shadow-lg shadow-black/50" 
                 style={{ width: point.size, height: point.size, backgroundColor: point.color }} />
            
            {/* Tooltip */}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 px-3 py-1.5 bg-white dark:bg-slate-900 rounded-xl text-[10px] font-black whitespace-nowrap opacity-0 group-hover/point:opacity-100 transition-opacity pointer-events-none shadow-xl border border-slate-100 dark:border-slate-800">
              {point.title}
            </div>
          </div>
        </button>
      ))}

      {/* Interface Overlays */}
      <div className="absolute top-8 left-8 flex items-center gap-4">
        <div className="p-3 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-3">
          <div className="relative">
            <Crosshair className="w-5 h-5 text-indigo-400" />
            <div className="absolute inset-0 animate-ping bg-indigo-400 rounded-full opacity-20" />
          </div>
          <div>
            <div className="text-[10px] font-black uppercase tracking-widest text-slate-400 leading-none mb-1">Radar Status</div>
            <div className="text-xs font-bold text-white flex items-center gap-2">
              {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Active Scanning'}
            </div>
          </div>
        </div>
        
        {coords && (
          <div className="px-4 py-2 bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 flex items-center gap-2 text-white">
            <MapPin className="w-3 h-3 text-emerald-400" />
            <span className="text-[10px] font-black uppercase tracking-wider">
              {coords.lat.toFixed(4)}, {coords.lng.toFixed(4)}
            </span>
          </div>
        )}
      </div>

      {/* Category Labels */}
      <div className="absolute inset-0 pointer-events-none opacity-40 uppercase text-[9px] font-black tracking-widest text-slate-500">
        <div className="absolute top-[10%] left-1/2 -translate-x-1/2">Environmental</div>
        <div className="absolute top-[30%] right-[5%] -translate-y-1/2">Health</div>
        <div className="absolute bottom-[30%] right-[5%] -translate-y-1/2">Economy</div>
        <div className="absolute bottom-[10%] left-1/2 -translate-x-1/2">Social</div>
        <div className="absolute bottom-[30%] left-[5%] -translate-y-1/2">Technology</div>
        <div className="absolute top-[30%] left-[5%] -translate-y-1/2">Education</div>
      </div>

      <div className="absolute bottom-8 right-8 flex flex-col gap-2">
        <div className="flex items-center gap-2 px-4 py-2 bg-rose-500/10 backdrop-blur-md rounded-xl border border-rose-500/20">
          <AlertTriangle className="w-4 h-4 text-rose-500" />
          <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest">
            {problems.filter(p => p.severity === 'Critical').length} Critical Pulses
          </span>
        </div>
      </div>
    </div>
  );
};

const LegendItem = ({ color, label }: { color: string, label: string }) => (
  <div className="flex items-center gap-2">
    <div className={`w-2 h-2 rounded-full ${color}`} />
    <span className="text-[9px] font-black text-slate-400 uppercase tracking-tight">{label}</span>
  </div>
);
