import React, { useRef } from 'react';
import { WallpaperParams } from '../types';
import { Shirt, User, Hash, Upload, X, Smartphone, Monitor, Shield, ChevronRight } from 'lucide-react';

interface InputFormProps {
  params: WallpaperParams;
  onChange: (field: keyof WallpaperParams, value: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
}

export const InputForm: React.FC<InputFormProps> = ({ params, onChange, onSubmit, isLoading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert("O arquivo deve ter no máximo 5MB");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64 = result.split(',')[1];
        onChange('logoBase64', base64);
        onChange('logoMimeType', file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearLogo = () => {
    onChange('logoBase64', '');
    onChange('logoMimeType', '');
    if (fileInputRef.current) {
        fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white/5 backdrop-blur-xl p-6 lg:p-8 rounded-3xl border border-white/10 shadow-2xl space-y-8 relative overflow-hidden group">
      
      {/* Decorative shine */}
      <div className="absolute -top-20 -right-20 w-40 h-40 bg-emerald-500/20 blur-[50px] rounded-full pointer-events-none group-hover:bg-emerald-500/30 transition-colors duration-700"></div>

      {/* Section 1: Setup */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-8 h-[1px] bg-slate-700"></span>
            Configuração
        </h3>
        
        <div className="grid grid-cols-2 gap-3">
          {/* Aspect Ratio Toggle */}
          <button
            onClick={() => onChange('aspectRatio', '9:16')}
            className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${
              params.aspectRatio === '9:16'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                : 'bg-black/20 border-transparent hover:bg-black/40 hover:border-white/10 text-slate-500'
            }`}
          >
            <Smartphone className="w-6 h-6" />
            <span className="text-xs font-bold uppercase">Stories (9:16)</span>
          </button>
          
          <button
            onClick={() => onChange('aspectRatio', '16:9')}
            className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border-2 transition-all duration-300 ${
              params.aspectRatio === '16:9'
                ? 'bg-emerald-500/10 border-emerald-500 text-emerald-400'
                : 'bg-black/20 border-transparent hover:bg-black/40 hover:border-white/10 text-slate-500'
            }`}
          >
            <Monitor className="w-6 h-6" />
            <span className="text-xs font-bold uppercase">Desktop (16:9)</span>
          </button>
        </div>

        {/* Gender Toggle */}
        <div className="grid grid-cols-2 gap-1 bg-black/30 p-1 rounded-xl">
           {(['masculino', 'feminino'] as const).map((g) => (
             <button
               key={g}
               onClick={() => onChange('genero', g)}
               className={`py-2.5 rounded-lg text-sm font-medium transition-all ${
                 params.genero === g
                   ? 'bg-slate-700 text-white shadow-lg'
                   : 'text-slate-500 hover:text-slate-300'
               }`}
             >
               {g.charAt(0).toUpperCase() + g.slice(1)}
             </button>
           ))}
        </div>
      </div>

      {/* Section 2: Identidade */}
      <div className="space-y-5">
        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
            <span className="w-8 h-[1px] bg-slate-700"></span>
            Identidade
        </h3>

        {/* Club Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-slate-400 ml-1">Clube do Coração</label>
          <div className="relative group/input">
            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" />
            <input
              type="text"
              value={params.clube}
              onChange={(e) => onChange('clube', e.target.value)}
              placeholder="Ex: Palmeiras, Barcelona..."
              className="w-full bg-black/30 border border-white/10 rounded-xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-5 gap-3">
          {/* Name Input */}
          <div className="col-span-3 space-y-1.5">
            <label className="text-xs font-medium text-slate-400 ml-1">Nome na Camisa</label>
            <div className="relative group/input">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" />
                <input
                type="text"
                value={params.nome}
                onChange={(e) => onChange('nome', e.target.value)}
                placeholder="NOME"
                maxLength={12}
                className="w-full bg-black/30 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all uppercase font-bold tracking-wide"
                />
            </div>
          </div>

          {/* Number Input */}
          <div className="col-span-2 space-y-1.5">
            <label className="text-xs font-medium text-slate-400 ml-1">Número</label>
            <div className="relative group/input">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 group-focus-within/input:text-emerald-400 transition-colors" />
                <input
                type="text"
                value={params.numero}
                onChange={(e) => onChange('numero', e.target.value)}
                placeholder="10"
                maxLength={2}
                className="w-full bg-black/30 border border-white/10 rounded-xl py-3.5 pl-10 pr-4 text-white placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-jersey text-lg tracking-wider"
                />
            </div>
          </div>
        </div>

        {/* Logo Upload */}
        <div className="space-y-1.5">
             <label className="text-xs font-medium text-slate-400 ml-1 flex justify-between">
                <span>Escudo / Logo</span>
                <span className="text-slate-600 italic">Opcional</span>
             </label>
             
             {!params.logoBase64 ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border border-dashed border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/5 bg-black/20 rounded-xl p-4 flex items-center justify-center gap-3 cursor-pointer transition-all group/upload h-16"
                >
                   <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover/upload:scale-110 transition-transform">
                       <Upload className="w-4 h-4 text-slate-400 group-hover/upload:text-emerald-400" />
                   </div>
                   <span className="text-sm text-slate-500 group-hover/upload:text-emerald-400/80 font-medium">Carregar imagem</span>
                </div>
             ) : (
                 <div className="relative bg-black/40 border border-emerald-500/30 rounded-xl p-2 pr-12 flex items-center gap-3 h-16">
                     <div className="h-full aspect-square bg-white/5 rounded-lg p-1">
                         <img 
                           src={`data:${params.logoMimeType || 'image/png'};base64,${params.logoBase64}`} 
                           alt="Logo" 
                           className="w-full h-full object-contain"
                         />
                     </div>
                     <div className="flex flex-col justify-center">
                         <span className="text-xs font-bold text-emerald-400 uppercase">Imagem Carregada</span>
                         <span className="text-[10px] text-slate-500">Será usada como base</span>
                     </div>
                     <button 
                       onClick={clearLogo}
                       className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-red-500/20 text-slate-500 hover:text-red-400 transition-colors"
                     >
                         <X className="w-4 h-4" />
                     </button>
                 </div>
             )}
             <input 
               type="file" 
               ref={fileInputRef}
               onChange={handleFileChange}
               accept="image/png, image/jpeg, image/webp"
               className="hidden"
             />
        </div>
      </div>

      {/* Action Button */}
      <button
        onClick={onSubmit}
        disabled={isLoading || !params.clube || !params.nome || !params.numero}
        className={`group w-full py-4 rounded-2xl font-jersey text-2xl tracking-wide transition-all relative overflow-hidden ${
            isLoading || !params.clube || !params.nome || !params.numero
            ? 'bg-slate-800 text-slate-600 cursor-not-allowed opacity-50'
            : 'bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-[0_0_30px_rgba(16,185,129,0.3)] hover:shadow-[0_0_50px_rgba(16,185,129,0.5)] hover:scale-[1.01]'
        }`}
      >
        <span className="relative z-10 flex items-center justify-center gap-2">
            {isLoading ? (
            <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                CRIANDO ARTE...
            </>
            ) : (
            <>
                ENTRAR EM CAMPO <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </>
            )}
        </span>
        
        {/* Button shine effect */}
        {!isLoading && (params.clube && params.nome) && (
            <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-0"></div>
        )}
      </button>
    </div>
  );
};