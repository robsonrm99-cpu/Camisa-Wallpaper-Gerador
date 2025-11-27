import React from 'react';

interface FooterProps {
  onNavigate: (view: 'home' | 'about' | 'contact' | 'privacy' | 'terms') => void;
  currentView: string;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, currentView }) => {
  return (
    <footer className="w-full border-t border-white/5 bg-black/40 backdrop-blur-md mt-auto pt-8 pb-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          
          <div className="col-span-1 text-center md:text-left">
            <span className="font-jersey text-2xl uppercase tracking-wider text-slate-500 block mb-2">
              Fut<span className="text-slate-400">Art</span>
            </span>
            <p className="text-xs text-slate-600 leading-relaxed">
              O seu estúdio de criação de wallpapers esportivos com Inteligência Artificial.
            </p>
          </div>

          <div className="col-span-1">
             <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Navegação</h4>
             <ul className="space-y-2">
                <li><button onClick={() => onNavigate('home')} className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Gerador</button></li>
                <li><button onClick={() => onNavigate('about')} className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Sobre Nós</button></li>
                <li><button onClick={() => onNavigate('contact')} className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Fale Conosco</button></li>
             </ul>
          </div>

          <div className="col-span-1">
             <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Legal</h4>
             <ul className="space-y-2">
                <li><button onClick={() => onNavigate('privacy')} className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Política de Privacidade</button></li>
                <li><button onClick={() => onNavigate('terms')} className="text-slate-400 hover:text-emerald-400 text-sm transition-colors">Termos de Uso</button></li>
             </ul>
          </div>
          
           <div className="col-span-1">
             <h4 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Isenção</h4>
             <p className="text-[10px] text-slate-600 leading-relaxed">
               Este site é uma ferramenta de Fan Art. Não somos afiliados a nenhum clube esportivo. Todas as imagens são geradas por IA.
             </p>
          </div>

        </div>
        
        <div className="border-t border-white/5 pt-6 text-center">
            <p className="text-xs text-slate-700">
              &copy; {new Date().getFullYear()} FutArt. Todos os direitos reservados.
            </p>
        </div>
      </div>
    </footer>
  );
};