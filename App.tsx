import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { WallpaperPreview } from './components/WallpaperPreview';
import { WallpaperParams, GenerationState } from './types';
import { generateWallpaper, editWallpaper } from './services/geminiService';
import { Zap, AlertCircle } from 'lucide-react';
import { Logo } from './components/Logo';

const App: React.FC = () => {
  const [params, setParams] = useState<WallpaperParams>({
    genero: 'masculino',
    nome: '',
    numero: '',
    clube: '',
    logoBase64: '',
    logoMimeType: '',
    aspectRatio: '9:16'
  });

  const [genState, setGenState] = useState<GenerationState>({
    isLoading: false,
    error: null,
    imageData: null
  });

  const handleParamChange = (field: keyof WallpaperParams, value: string) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    setGenState({ isLoading: true, error: null, imageData: null });
    try {
      const base64Image = await generateWallpaper(params);
      setGenState({ isLoading: false, error: null, imageData: base64Image });
    } catch (error) {
      setGenState({ 
        isLoading: false, 
        error: "Falha ao gerar imagem. Tente novamente.", 
        imageData: null 
      });
    }
  };

  const handleEdit = async (instruction: string) => {
    if (!genState.imageData) return;
    
    const currentImage = genState.imageData; // Keep current in case of error
    setGenState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const newBase64Image = await editWallpaper(currentImage, instruction);
      setGenState({ isLoading: false, error: null, imageData: newBase64Image });
    } catch (error) {
      setGenState({ 
        isLoading: false, 
        error: "Falha na edição. Tente outra instrução.", 
        imageData: currentImage 
      });
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans selection:bg-emerald-500/30">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-mesh pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-spotlight pointer-events-none z-0"></div>
      
      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-center relative">
          
          {/* Centered Brand */}
          <div className="flex items-center gap-3">
            <div className="relative group">
                <div className="absolute inset-0 bg-emerald-500/20 blur-lg rounded-full group-hover:bg-emerald-500/30 transition-all duration-500"></div>
                <div className="w-10 h-10 relative flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                   <Logo className="w-full h-full drop-shadow-lg" />
                </div>
            </div>
            <div className="flex flex-col">
              <h1 className="font-jersey text-3xl uppercase tracking-wider text-white leading-none flex items-center gap-1">
                Fut<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Art</span>
              </h1>
            </div>
          </div>

          {/* Right Badge (Absolute) */}
          <div className="absolute right-4 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
            <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400/20" /> 
            <span className="text-[10px] font-bold uppercase text-slate-300 tracking-wider">
              Gemini 2.5 + Imagen
            </span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 lg:py-12">
        
        {/* Header Section (Centered) */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4 animate-in fade-in slide-in-from-top-4 duration-700">
            <h2 className="font-jersey text-5xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-b from-white via-slate-200 to-slate-500 uppercase drop-shadow-sm leading-[0.9] tracking-wide">
              Crie seu Manto Sagrado
            </h2>
            <p className="text-slate-400 text-lg font-light leading-relaxed max-w-xl mx-auto">
              Inteligência artificial desenhando o uniforme do seu time, com seu nome e número, em segundos.
            </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left Column: Configuration Form */}
          <div className="lg:col-span-5 space-y-6">
            <InputForm 
              params={params} 
              onChange={handleParamChange} 
              onSubmit={handleGenerate} 
              isLoading={genState.isLoading} 
            />

            {genState.error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 text-red-400 animate-in fade-in slide-in-from-top-2">
                <AlertCircle className="w-5 h-5 shrink-0" />
                <p className="text-sm font-medium">{genState.error}</p>
              </div>
            )}
          </div>

          {/* Right Column: Preview Stage */}
          <div className="lg:col-span-7 w-full flex flex-col items-center">
             <div className="w-full max-w-md lg:max-w-full mx-auto sticky top-8 transition-all duration-500">
               <WallpaperPreview 
                  imageData={genState.imageData}
                  isLoading={genState.isLoading}
                  onEdit={handleEdit}
                  aspectRatio={params.aspectRatio}
               />
               
               {/* Tips */}
               {!genState.imageData && !genState.isLoading && (
                  <div className="mt-8 grid grid-cols-2 gap-4 opacity-60">
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5 hover:border-emerald-500/30 transition-colors">
                        <span className="block text-xs text-emerald-400 font-bold uppercase mb-1">Dica 01</span>
                        <p className="text-sm text-slate-300">Use o nome completo do time (ex: "Clube de Regatas do Flamengo").</p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5 hover:border-purple-500/30 transition-colors">
                        <span className="block text-xs text-purple-400 font-bold uppercase mb-1">Dica 02</span>
                        <p className="text-sm text-slate-300">Após gerar, peça para adicionar "chuva" ou "fumaça" no editor.</p>
                      </div>
                  </div>
               )}
             </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;