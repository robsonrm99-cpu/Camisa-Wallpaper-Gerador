import React from 'react';
import { HistoryItem } from '../types';
import { Clock, Trash2, Image as ImageIcon } from 'lucide-react';

interface HistoryGalleryProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
  onClear: () => void;
  currentId?: string;
}

export const HistoryGallery: React.FC<HistoryGalleryProps> = ({ history, onSelect, onClear, currentId }) => {
  if (history.length === 0) return null;

  return (
    <div className="w-full animate-in slide-in-from-bottom-4 fade-in duration-700">
      <div className="flex items-center justify-between mb-3 px-1">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
          <Clock className="w-3 h-3" />
          Histórico da Sessão
        </h3>
        <button 
          onClick={onClear}
          className="text-[10px] text-slate-600 hover:text-red-400 transition-colors flex items-center gap-1"
        >
          <Trash2 className="w-3 h-3" />
          Limpar
        </button>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 snap-x scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`relative group flex-shrink-0 snap-start transition-all duration-300 rounded-xl overflow-hidden border-2 ${
              currentId === item.id 
                ? 'border-emerald-500 ring-2 ring-emerald-500/20 scale-105 z-10' 
                : 'border-white/10 hover:border-white/30 opacity-70 hover:opacity-100'
            }`}
            style={{ 
              width: item.params.aspectRatio === '16:9' ? '120px' : '80px',
              aspectRatio: item.params.aspectRatio === '16:9' ? '16/9' : '9/16'
            }}
          >
            <img 
              src={`data:image/png;base64,${item.imageData}`} 
              alt="History thumbnail" 
              className="w-full h-full object-cover"
            />
            
            {/* Overlay info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                <span className="text-[8px] font-bold text-white uppercase truncate w-full text-left">
                    {item.params.clube}
                </span>
                <span className="text-[8px] text-emerald-400 font-mono">
                    #{item.params.numero}
                </span>
            </div>

            {/* Type badge */}
            {item.type === 'edited' && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full shadow-lg border border-black/50"></div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
};