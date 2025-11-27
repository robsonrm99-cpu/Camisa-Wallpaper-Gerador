import React from 'react';
import { Mail, Shield, Zap, Info, MessageSquare, Lock, FileText } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4 mb-12">
        <h2 className="font-jersey text-4xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 uppercase">
          Sobre a FutArt
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          Unindo a paixão pelo futebol com o poder da inteligência artificial generativa.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <div className="w-12 h-12 bg-emerald-500/20 rounded-xl flex items-center justify-center mb-6">
            <Zap className="w-6 h-6 text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Nossa Missão</h3>
          <p className="text-slate-400 leading-relaxed">
            Democratizar a criação de arte digital para torcedores. Acreditamos que todo fã merece ter um wallpaper exclusivo, 
            de alta qualidade, que represente seu amor pelo clube, sem precisar de habilidades complexas de design ou softwares pesados.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
            <Info className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Tecnologia</h3>
          <p className="text-slate-400 leading-relaxed">
            Utilizamos o modelo <strong>Gemini 2.5 Flash</strong> do Google, uma das IAs mais avançadas do mundo. 
            Nosso sistema proprietário traduz suas preferências (time, nome, número) em instruções artísticas ("prompts") otimizados para gerar uma imagem única a cada clique.
          </p>
        </div>
      </div>
    </div>
  );
};

export const ContactPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4 mb-12">
        <h2 className="font-jersey text-4xl lg:text-5xl text-white uppercase">
          Fale Conosco
        </h2>
        <p className="text-slate-400">
          Dúvidas sobre o uso da ferramenta, parcerias ou reportar bugs?
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center border border-white/10 shadow-lg">
                <Mail className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="space-y-2">
                <h3 className="text-xl font-bold text-white">Canal de Atendimento</h3>
                <p className="text-slate-400 text-sm max-w-md mx-auto">
                    Entre em contato diretamente com nossa equipe de suporte.
                </p>
            </div>

            <a 
              href="mailto:contato@futart.app" 
              className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 px-8 rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
                <MessageSquare className="w-5 h-5" />
                Enviar E-mail
            </a>
        </div>
      </div>
    </div>
  );
};

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-slate-300">
      <div className="text-center mb-12">
        <h2 className="font-jersey text-4xl text-white uppercase mb-4">Política de Privacidade</h2>
        <div className="w-16 h-1 bg-emerald-500 mx-auto rounded-full"></div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
        <section>
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" /> 1. Coleta de Dados
          </h3>
          <p className="text-sm leading-relaxed">
            O FutArt preza pela sua privacidade. Não exigimos cadastro para gerar imagens. 
            As imagens carregadas (logos) são processadas temporariamente para a geração da arte e não são armazenadas permanentemente em nossos servidores.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" /> 2. Cookies e Publicidade (Google AdSense)
          </h3>
          <p className="text-sm leading-relaxed">
            Utilizamos cookies para melhorar a experiência do usuário e veicular anúncios personalizados através do Google AdSense.
            <br/><br/>
            <strong>Cookies DoubleClick DART:</strong> O Google, como fornecedor terceirizado, utiliza cookies para exibir anúncios em nosso site. O uso do cookie DART permite que o Google veicule anúncios para nossos usuários com base em sua visita ao nosso site e a outros sites na Internet.
            <br/><br/>
            Você pode optar por não usar o cookie DART visitando a Política de privacidade da rede de conteúdo e anúncios do Google.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" /> 3. LGPD e GDPR
          </h3>
          <p className="text-sm leading-relaxed">
            Em conformidade com a LGPD e GDPR, você tem o direito de navegar anonimamente e gerenciar suas preferências de cookies através das configurações do seu navegador.
          </p>
        </section>
      </div>
    </div>
  );
};

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-slate-300">
      <div className="text-center mb-12">
        <h2 className="font-jersey text-4xl text-white uppercase mb-4">Termos de Uso</h2>
        <div className="w-16 h-1 bg-purple-500 mx-auto rounded-full"></div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-6">
        <section>
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" /> 1. Aceitação
          </h3>
          <p className="text-sm leading-relaxed">
            Ao utilizar o FutArt, você concorda com estes termos. O serviço é fornecido "como está", utilizando inteligência artificial para gerar imagens artísticas.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" /> 2. Natureza das Imagens (Fan Art)
          </h3>
          <p className="text-sm leading-relaxed">
            Esta ferramenta destina-se à criação de "Fan Art" para uso pessoal e não comercial. 
            O FutArt não possui vínculo oficial com clubes de futebol, ligas ou marcas esportivas. 
            As imagens geradas são representações artísticas fictícias criadas por IA e não devem ser confundidas com produtos oficiais.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" /> 3. Responsabilidade do Usuário
          </h3>
          <p className="text-sm leading-relaxed">
            O usuário é responsável pelo conteúdo textual (nomes e números) inserido na ferramenta. É proibido gerar conteúdo ofensivo, discurso de ódio ou que viole direitos autorais explícitos.
          </p>
        </section>
      </div>
    </div>
  );
};