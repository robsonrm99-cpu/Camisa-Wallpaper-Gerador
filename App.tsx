import React, { useState, useEffect } from 'react';
import { InputForm } from './components/InputForm';
import { WallpaperPreview } from './components/WallpaperPreview';
import { WallpaperParams, GenerationState, HistoryItem } from './types';
import { generateWallpaper, editWallpaper } from './services/geminiService';
import { Zap, AlertCircle, Trophy, X, ShieldCheck, HelpCircle, Star, Sparkles } from 'lucide-react';
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

const FAQItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => (
  <div className="bg-white/5 border border-white/5 rounded-xl p-6 hover:bg-white/10 transition-colors">
    <h4 className="text-emerald-400 font-bold mb-2 flex items-center gap-2">
      <HelpCircle className="w-4 h-4" /> {question}
    </h4>
    <p className="text-slate-400 text-sm leading-relaxed">{answer}</p>
  </div>
);

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

      {/* Content Rich Section for AdSense Value */}
      <div className="border-t border-white/5 pt-16 animate-in fade-in slide-in-from-bottom-8 duration-700 space-y-12">
        
        {/* How It Works */}
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h3 className="font-jersey text-3xl text-slate-300 uppercase">Como funciona o FutArt?</h3>
          <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                <div className="w-10 h-10 bg-emerald-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="text-white font-bold mb-2">1. Personalização</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Insira o nome do seu clube (ex: "Flamengo", "Corinthians"), seu nome e número favorito. Nossa IA identifica as cores e padrões oficiais.
                </p>
              </div>
              <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Sparkles className="w-5 h-5 text-purple-400" />
                </div>
                <h4 className="text-white font-bold mb-2">2. Geração IA</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Utilizamos o modelo Gemini 2.5 Flash para criar uma arte vetorial estilo "E-Sports" em segundos, com alta resolução para celular ou PC.
                </p>
              </div>
              <div className="bg-black/20 p-6 rounded-2xl border border-white/5">
                <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center mb-4">
                  <Zap className="w-5 h-5 text-blue-400" />
                </div>
                <h4 className="text-white font-bold mb-2">3. Edição Mágica</h4>
                <p className="text-sm text-slate-400 leading-relaxed">
                  Não gostou de algum detalhe? Use o campo de edição para pedir alterações como "adicionar chuva", "mudar o fundo" ou "ajustar iluminação".
                </p>
              </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-3xl mx-auto w-full">
           <h3 className="font-jersey text-3xl text-slate-300 uppercase mb-8 text-center">Perguntas Frequentes (FAQ)</h3>
           <div className="space-y-4">
              <FAQItem 
                question="O serviço é gratuito?"
                answer="Sim, o FutArt é 100% gratuito. Mantemos a ferramenta no ar através de anúncios exibidos na página."
              />
              <FAQItem 
                question="Posso usar as imagens comercialmente?"
                answer="Não. As imagens são geradas como 'Fan Art' para uso pessoal (papel de parede, redes sociais). Elas podem conter elementos protegidos por direitos de imagem dos clubes."
              />
              <FAQItem 
                question="Por que o escudo do meu time ficou diferente?"
                answer="A IA recria os escudos com base em referências artísticas para evitar cópias exatas que violem direitos autorais. Para maior precisão, recomendamos fazer o upload do logo oficial no formulário."
              />
              <FAQItem 
                question="Quais times são compatíveis?"
                answer="O sistema reconhece os principais times do Brasil (Flamengo, Palmeiras, São Paulo, Vasco, etc.) e do mundo (Real Madrid, Barcelona, City). Para times menores, descreva as cores no campo de edição se necessário."
              />
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