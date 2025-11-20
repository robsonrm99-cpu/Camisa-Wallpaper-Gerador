import React, { useState } from 'react';
import { InputForm } from './components/InputForm';
import { WallpaperPreview } from './components/WallpaperPreview';
import { WallpaperParams, GenerationState, HistoryItem } from './types';
import { generateWallpaper, editWallpaper } from './services/geminiService';
import { Zap, AlertCircle } from 'lucide-react';
import { Logo } from './components/Logo';
import { HistoryGallery } from './components/HistoryGallery';

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

  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentHistoryId, setCurrentHistoryId] = useState<string | undefined>(undefined);

  const handleParamChange = (field: keyof WallpaperParams, value: string) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  const addToHistory = (imageData: string, type: 'generated' | 'edited', currentParams: WallpaperParams) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      imageData,
      timestamp: Date.now(),
      params: { ...currentParams }, // Copy params
      type
    };
    setHistory(prev => [newItem, ...prev]);
    setCurrentHistoryId(newItem.id);
  };

  const handleGenerate = async () => {
    setGenState({ isLoading: true, error: null, imageData: null });
    try {
      const base64Image = await generateWallpaper(params);
      setGenState({ isLoading: false, error: null, imageData: base64Image });
      addToHistory(base64Image, 'generated', params);
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
      addToHistory(newBase64Image, 'edited', params);
    } catch (error) {
      setGenState({ 
        isLoading: false, 
        error: "Falha na edição. Tente outra instrução.", 
        imageData: currentImage 
      });
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setGenState({
      isLoading: false,
      error: null,
      imageData: item.imageData
    });
    setParams(item.params); // Restore params used for that image
    setCurrentHistoryId(item.id);
  };

  const handleClearHistory = () => {
    if (confirm("Tem certeza que deseja limpar o histórico da sessão?")) {
      setHistory([]);
      setCurrentHistoryId(undefined);
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden font-sans selection:bg-emerald-500/30 pb-12">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-mesh pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-spotlight pointer-events-none z-0"></div>
      
      {/* Header Section - Centralized */}
      <header className="relative z-10 pt-12 pb-10 flex flex-col items-center text-center px-4 space-y-6">
         
         {/* Brand Identity */}
         <div className="flex flex-col items-center gap-5">
             <div className="relative group">
                <div className="absolute inset-0 bg-emerald-500/20 blur-xl rounded-full group-hover:bg-emerald-500/30 transition-all duration-500"></div>
                <div className="w-20 h-20 relative flex items-center justify-center transform transition-transform duration-500 group-hover:scale-110 group-hover:rotate-3">
                   <Logo className="w-full h-full drop-shadow-2xl" />
                </div>
             </div>
             
             <div className="flex flex-col items-center">
               <h1 className="font-jersey text-5xl sm:text-6xl uppercase tracking-wider text-white leading-none flex items-center gap-2">
                 Fut<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-500">Art</span>
               </h1>
               <span className="text-[10px] sm:text-xs font-bold tracking-[0.4em] text-slate-500 uppercase mt-3">
                 Wallpaper Creator
               </span>
             </div>

             {/* Tech Badge */}
             <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm mt-2">
               <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400/20" /> 
               <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
                 Gemini 2.5 + Imagen
               </span>
             </div>
         </div>

         {/* Hero Text */}
         <div className="max-w-2xl mx-auto space-y-4 pt-4">
             <h2 className="font-jersey text-5xl sm:text-6xl lg:text-7xl text-transparent bg-clip-text bg-gradient-to-br from-white via-slate-200 to-slate-500 uppercase drop-shadow-sm leading-[0.9]">
               Crie seu Manto
             </h2>
             <p className="text-slate-400 text-base sm:text-lg font-light leading-relaxed max-w-lg mx-auto">
               Inteligência artificial desenhando o uniforme do seu time, com seu nome e número, em segundos.
             </p>
         </div>
      </header>

      <main className="relative z-10 max-w-6xl mx-auto px-4">
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
          
          {/* Left Column: Configuration */}
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
             <div className="w-full max-w-md lg:max-w-full sticky top-8 space-y-8">
               <WallpaperPreview 
                  imageData={genState.imageData}
                  isLoading={genState.isLoading}
                  onEdit={handleEdit}
                  aspectRatio={params.aspectRatio}
               />
               
               {/* History Gallery - Renders only if history exists */}
               <HistoryGallery 
                  history={history}
                  onSelect={handleSelectHistory}
                  onClear={handleClearHistory}
                  currentId={currentHistoryId}
               />

               {/* Tips - Only show if no image and no history */}
               {!genState.imageData && !genState.isLoading && history.length === 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 opacity-60">
                      <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                        <span className="block text-xs text-emerald-400 font-bold uppercase mb-1">Dica 01</span>
                        <p className="text-sm text-slate-400">Use o nome completo do time para melhores resultados (ex: "Sociedade Esportiva Palmeiras").</p>
                      </div>
                      <div className="bg-slate-900/50 p-4 rounded-xl border border-white/5">
                        <span className="block text-xs text-purple-400 font-bold uppercase mb-1">Dica 02</span>
                        <p className="text-sm text-slate-400">Após gerar, você pode pedir para adicionar "chuva", "fumaça" ou "neon" no editor.</p>
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