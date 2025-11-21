import React from 'react';
import { Download, Wand2, Image as ImageIcon, Share2, History } from 'lucide-react';
import { HistoryItem } from '../types';

interface WallpaperPreviewProps {
  imageData: string | null;
  isLoading: boolean;
  onEdit: (instruction: string) => void;
  aspectRatio: '9:16' | '16:9';
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
}

export const WallpaperPreview: React.FC<WallpaperPreviewProps> = ({ 
  imageData, 
  isLoading, 
  onEdit, 
  aspectRatio,
  history,
  onSelectHistory
}) => {
  const [editPrompt, setEditPrompt] = React.useState('');

  const handleDownload = () => {
    if (!imageData) return;
    const link = document.createElement('a');
    link.href = `data:image/png;base64,${imageData}`;
    link.download = `camisa-wallpaper-${aspectRatio.replace(':', '-')}.png`;
    link.click();
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editPrompt.trim()) {
      onEdit(editPrompt);
      setEditPrompt('');
    }
  };

  // Define aspect ratio style
  const aspectRatioClass = aspectRatio === '16:9' ? 'aspect-video' : 'aspect-[9/16]';
  // On desktop, 9:16 is restrained width, 16:9 takes full width. On mobile, both are full width.
  const containerClass = aspectRatio === '16:9' ? 'w-full' : 'w-full max-w-[380px]';

  return (
    <div className={`flex flex-col items-center space-y-6 ${aspectRatio === '16:9' ? 'w-full' : 'w-full lg:w-auto'}`}>
      
      {/* Card Frame */}
      <div className={`relative ${containerClass} ${aspectRatioClass} bg-black/40 rounded-3xl p-2 border border-white/10 shadow-2xl transition-all duration-500`}>
        
        {/* Inner Canvas */}
        <div className="w-full h-full rounded-2xl overflow-hidden bg-slate-900 relative flex items-center justify-center group">
            
            {/* Grid Pattern for Empty State */}
            <div className="absolute inset-0 opacity-20 pointer-events-none" 
                 style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(to right, #334155 1px, transparent 1px)', backgroundSize: '20px 20px' }}>
            </div>

            {/* Loading State */}
            {isLoading && (
                <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center text-center p-6">
                    <div className="relative w-20 h-20 mb-6">
                        <div className="absolute inset-0 border-4 border-slate-700 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
                        <Wand2 className="absolute inset-0 m-auto text-emerald-400 w-8 h-8 animate-pulse" />
                    </div>
                    <h3 className="font-jersey text-2xl text-white tracking-wide mb-2">CRIANDO UNIFORME</h3>
                    <p className="text-slate-400 text-sm">A inteligência artificial está desenhando cada detalhe...</p>
                </div>
            )}

            {/* Empty State */}
            {!imageData && !isLoading && (
                <div className="text-center p-8 relative z-10">
                    <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/10">
                        <ImageIcon className="w-10 h-10 text-slate-600" />
                    </div>
                    <h3 className="font-jersey text-2xl text-slate-300 uppercase mb-2">
                        Aguardando Dados
                    </h3>
                    <p className="text-slate-500 text-sm max-w-[200px] mx-auto">
                        Preencha as informações ao lado para gerar seu wallpaper exclusivo.
                    </p>
                </div>
            )}

            {/* Image Display */}
            {imageData && (
                <>
                    <img
                        src={`data:image/png;base64,${imageData}`}
                        alt="Wallpaper Gerado"
                        className="w-full h-full object-cover"
                    />
                    
                    {/* Hover Overlay Actions */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-6">
                        <button 
                            onClick={handleDownload}
                            className="w-full bg-white text-black font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-emerald-400 transition-colors mb-3 transform translate-y-4 group-hover:translate-y-0 duration-300"
                        >
                            <Download className="w-5 h-5" />
                            BAIXAR ARTE
                        </button>
                    </div>
                </>
            )}
        </div>
      </div>

      {/* Magic Editor - Floating below */}
      {imageData && (
        <div className={`${containerClass} animate-in slide-in-from-bottom-4 fade-in duration-500`}>
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-1 pl-1 flex items-center gap-2 shadow-xl">
                <div className="pl-3 pr-1">
                    <Wand2 className="w-5 h-5 text-purple-400" />
                </div>
                <form onSubmit={handleEditSubmit} className="flex-1 flex gap-2">
                    <input 
                        type="text" 
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        placeholder="Ex: Adicionar chuva, neon..."
                        className="flex-1 bg-transparent border-none text-sm text-white placeholder-slate-500 focus:ring-0 h-12"
                        disabled={isLoading}
                    />
                    <button 
                        type="submit"
                        disabled={isLoading || !editPrompt.trim()}
                        className="bg-purple-600/90 hover:bg-purple-500 text-white px-5 rounded-xl text-xs font-bold uppercase tracking-wider h-10 my-1 mr-1 transition-colors"
                    >
                        Editar
                    </button>
                </form>
            </div>
        </div>
      )}

      {/* History Section */}
      {history.length > 0 && (
        <div className={`${containerClass} pt-4 animate-in slide-in-from-bottom-6 fade-in duration-700`}>
          <div className="bg-black/20 border border-white/5 rounded-2xl p-4 backdrop-blur-sm">
             <div className="flex items-center justify-between mb-3 px-1">
                <div className="flex items-center gap-2">
                    <History className="w-3 h-3 text-slate-400" />
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Histórico</h3>
                </div>
                <span className="text-[10px] text-slate-600 bg-white/5 px-2 py-0.5 rounded-full">{history.length}</span>
             </div>
             
             <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
                {history.map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => onSelectHistory(item)}
                    className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all duration-300 group h-16 w-auto aspect-[9/16] border ${
                      imageData === item.data 
                        ? 'border-emerald-500 ring-2 ring-emerald-500/20' 
                        : 'border-white/10 opacity-60 hover:opacity-100 hover:border-white/30'
                    }`}
                  >
                    <img 
                      src={`data:image/png;base64,${item.data}`} 
                      alt={`Histórico ${idx}`}
                      className="h-full w-full object-cover" 
                    />
                  </button>
                ))}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};