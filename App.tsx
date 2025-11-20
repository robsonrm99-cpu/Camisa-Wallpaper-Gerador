import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { WallpaperPreview } from './components/WallpaperPreview';
import { WallpaperParams, GenerationState } from './types';
import { generateWallpaper, editWallpaper } from './services/geminiService';
import { Zap, AlertCircle, Trophy } from 'lucide-react';

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
    <div className="min-h-screen relative overflow-x-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-mesh pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-spotlight pointer-events-none z-0"></div>
      
      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] transform -skew-x-6 border border-white/10">
               <Trophy className="w-5 h-5 text-white fill-current transform skew-x-6" />
            </div>
            <div>
              <h1 className="font-jersey text-2xl uppercase tracking-wider text-white leading-none">
                Fut<span className="text-emerald-400">Art</span>
              </h1>
              <span className="text-[10px] font-medium tracking-[0.2em] text-slate-400 uppercase block">Wallpaper Maker</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold uppercase text-emerald-400 tracking-wider">
              <Zap className="w-3 h-3" /> Powered by Google AI
            </span>
          </div>
        </div>
      </nav>

      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 lg:py-12">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left Column: Configuration */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-2">
              <h2 className="font-jersey text-4xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 uppercase drop-shadow-sm">
                Vista a camisa
              </h2>
              <p className="text-slate-400 text-lg font-light leading-relaxed max-w-md">
                Transforme sua paixão em arte digital. Crie wallpapers únicos com o manto do seu time usando inteligência artificial.
              </p>
            </div>

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
             <div className="w-full max-w-md lg:max-w-full mx-auto sticky top-8">
               <WallpaperPreview 
                  imageData={genState.imageData}
                  isLoading={genState.isLoading}
                  onEdit={handleEdit}
                  aspectRatio={params.aspectRatio}
               />
               
               {/* Tips moved below preview for better flow */}
               {!genState.imageData && !genState.isLoading && (
                  <div className="mt-8 grid grid-cols-2 gap-4 opacity-60">
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5">
                        <span className="block text-xs text-emerald-400 font-bold uppercase mb-1">Dica 01</span>
                        <p className="text-sm text-slate-300">Use o nome completo do time (ex: "Clube de Regatas do Flamengo").</p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-lg border border-white/5">
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