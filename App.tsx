import React, { useState, useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { WallpaperPreview } from './components/WallpaperPreview';
import { WallpaperParams, GenerationState, HistoryItem } from './types';
import { generateWallpaper, editWallpaper } from './services/geminiService';
import { Zap, AlertCircle, Trophy, X, ShieldCheck } from 'lucide-react';
import { Footer } from './components/Footer';
import { AboutPage, ContactPage, PrivacyPage, TermsPage } from './components/StaticPages';

type ViewState = 'home' | 'about' | 'contact' | 'privacy' | 'terms';

const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-slate-900/95 border-t border-emerald-500/20 p-4 z-50 backdrop-blur-md animate-in slide-in-from-bottom-full duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-start gap-3">
           <ShieldCheck className="w-5 h-5 text-emerald-400 mt-1 shrink-0" />
           <p className="text-sm text-slate-300">
             Utilizamos cookies para personalizar anúncios e melhorar sua experiência, em conformidade com a LGPD e políticas do Google AdSense. 
             Ao continuar, você concorda com nossa <button onClick={() => {}} className="text-emerald-400 hover:underline">Política de Privacidade</button>.
           </p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={acceptCookies}
             className="bg-emerald-500 hover:bg-emerald-400 text-black text-sm font-bold px-6 py-2 rounded-lg transition-colors whitespace-nowrap"
           >
             Aceitar e Fechar
           </button>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>('home');
  
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

  const [history, setHistory] = useState<HistoryItem[]>([]);

  const handleParamChange = (field: keyof WallpaperParams, value: string) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  const addToHistory = (base64Data: string, aspectRatio: '9:16' | '16:9') => {
    const newItem: HistoryItem = {
      data: base64Data,
      aspectRatio: aspectRatio,
      timestamp: Date.now()
    };
    setHistory(prev => [newItem, ...prev]);
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setGenState(prev => ({ ...prev, imageData: item.data, error: null }));
    setParams(prev => ({ ...prev, aspectRatio: item.aspectRatio }));
    setCurrentView('home');
  };

  const handleGenerate = async () => {
    setGenState({ isLoading: true, error: null, imageData: null });
    try {
      const base64Image = await generateWallpaper(params);
      setGenState({ isLoading: false, error: null, imageData: base64Image });
      addToHistory(base64Image, params.aspectRatio);
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
    
    const currentImage = genState.imageData; 
    setGenState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      const newBase64Image = await editWallpaper(currentImage, instruction);
      setGenState({ isLoading: false, error: null, imageData: newBase64Image });
      addToHistory(newBase64Image, params.aspectRatio);
    } catch (error) {
      setGenState({ 
        isLoading: false, 
        error: "Falha na edição. Tente outra instrução.", 
        imageData: currentImage 
      });
    }
  };

  // Main Generator View Content
  const renderHome = () => (
    <div className="space-y-16">
      <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-start">
        {/* Left Column: Configuration */}
        <div className="lg:col-span-5 space-y-8 animate-in slide-in-from-left-4 fade-in duration-500">
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
                history={history}
                onSelectHistory={handleSelectHistory}
            />
          </div>
        </div>
      </div>

      {/* SEO Content Section (Required for AdSense Content Value) */}
      <div className="max-w-4xl mx-auto border-t border-white/5 pt-16 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h3 className="font-jersey text-3xl text-slate-300 uppercase mb-6 text-center">Como criar o Wallpaper de Futebol Perfeito</h3>
        <div className="grid md:grid-cols-3 gap-8 text-slate-400">
            <div className="space-y-2">
              <h4 className="text-emerald-400 font-bold uppercase text-sm">1. Escolha do Time</h4>
              <p className="text-sm leading-relaxed">
                Para melhores resultados, insira o nome completo do clube (ex: "Sociedade Esportiva Palmeiras"). 
                Nossa IA reconhece as cores e padrões oficiais dos maiores times do Brasil e do mundo.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-emerald-400 font-bold uppercase text-sm">2. Personalização</h4>
              <p className="text-sm leading-relaxed">
                Adicione seu nome e número da sorte. A inteligência artificial ajusta a tipografia para combinar com o estilo esportivo,
                criando uma camisa virtual realista vista de costas.
              </p>
            </div>
            <div className="space-y-2">
              <h4 className="text-emerald-400 font-bold uppercase text-sm">3. Edição Mágica</h4>
              <p className="text-sm leading-relaxed">
                Após gerar, use o campo de edição para adicionar efeitos como "chuva intensa", "fumaça de sinalizador" ou "estádio lotado ao fundo"
                para dar um toque épico à sua arte.
              </p>
            </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden">
      <CookieBanner />
      
      {/* Background Effects */}
      <div className="fixed inset-0 bg-mesh pointer-events-none z-0"></div>
      <div className="fixed inset-0 bg-spotlight pointer-events-none z-0"></div>
      
      {/* Navbar */}
      <nav className="relative z-10 border-b border-white/5 bg-black/20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div 
            className="flex items-center gap-3 cursor-pointer group" 
            onClick={() => setCurrentView('home')}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(16,185,129,0.3)] transform -skew-x-6 border border-white/10 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] transition-all">
               <Trophy className="w-5 h-5 text-white fill-current transform skew-x-6" />
            </div>
            <div>
              <h1 className="font-jersey text-2xl uppercase tracking-wider text-white leading-none group-hover:text-emerald-400 transition-colors">
                Fut<span className="text-emerald-400 group-hover:text-white transition-colors">Art</span>
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

      {/* Main Content Area */}
      <main className="relative z-10 max-w-7xl mx-auto px-4 py-8 lg:py-12 flex-grow w-full">
        {currentView === 'home' && renderHome()}
        {currentView === 'about' && <AboutPage />}
        {currentView === 'contact' && <ContactPage />}
        {currentView === 'privacy' && <PrivacyPage />}
        {currentView === 'terms' && <TermsPage />}
      </main>

      {/* Footer */}
      <Footer onNavigate={setCurrentView} currentView={currentView} />
    </div>
  );
};

export default App;