import React from 'react';
import { Mail, Shield, Zap, Info, MessageSquare, Lock, FileText, Globe, Cookie } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="text-center space-y-4 mb-12">
        <h2 className="font-jersey text-4xl lg:text-6xl text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200 uppercase">
          Sobre a FutArt
        </h2>
        <p className="text-slate-400 max-w-2xl mx-auto">
          A plataforma líder em geração de Fan Art esportiva personalizada com Inteligência Artificial.
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
            Nosso objetivo é fornecer uma ferramenta acessível, rápida e divertida.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <div className="w-12 h-12 bg-purple-500/20 rounded-xl flex items-center justify-center mb-6">
            <Info className="w-6 h-6 text-purple-400" />
          </div>
          <h3 className="text-xl font-bold text-white mb-3">Tecnologia de Ponta</h3>
          <p className="text-slate-400 leading-relaxed">
            Utilizamos o modelo <strong>Gemini 2.5 Flash</strong> do Google, uma das IAs generativas mais avançadas do mundo. 
            Nosso sistema proprietário de "Prompt Engineering" traduz suas preferências (time, nome, número) em instruções artísticas otimizadas, garantindo fidelidade visual e estilo consistente.
          </p>
        </div>
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur-sm text-center">
         <p className="text-sm text-slate-500">
            FutArt é um projeto independente desenvolvido por entusiastas de tecnologia e futebol. 
            Não possuímos afiliação oficial com a FIFA, CBF ou clubes mencionados.
         </p>
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
          Estamos aqui para ouvir você.
        </p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-12 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[80px] rounded-full pointer-events-none"></div>

        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
            <div className="w-20 h-20 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full flex items-center justify-center border border-white/10 shadow-lg">
                <Mail className="w-8 h-8 text-emerald-400" />
            </div>

            <div className="space-y-4">
                <h3 className="text-xl font-bold text-white">Canais de Atendimento</h3>
                <p className="text-slate-400 text-sm max-w-lg mx-auto">
                    Se você encontrou um erro, tem sugestões de melhoria ou deseja discutir parcerias comerciais, entre em contato.
                    Respondemos geralmente em até 24 horas úteis.
                </p>
            </div>

            <a 
              href="mailto:contato@futart.app" 
              className="inline-flex items-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-black font-bold py-4 px-8 rounded-xl transition-all hover:scale-105 shadow-[0_0_20px_rgba(16,185,129,0.3)]"
            >
                <MessageSquare className="w-5 h-5" />
                Enviar E-mail
            </a>
            
            <p className="text-xs text-slate-600 mt-4">
                Para questões relacionadas a dados e privacidade, mencione "DPO" no assunto.
            </p>
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
        <p className="text-sm text-slate-500 mt-4">Última atualização: Outubro 2023</p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-8">
        <section>
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-emerald-400" /> 1. Introdução
          </h3>
          <p className="text-sm leading-relaxed">
            A sua privacidade é extremamente importante para nós. Esta política descreve como o FutArt coleta, usa e protege suas informações ao utilizar nosso website. 
            Ao acessar o FutArt, você concorda com a coleta e uso de informações de acordo com esta política.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-400" /> 2. Coleta de Dados e Uso
          </h3>
          <p className="text-sm leading-relaxed mb-2">
            <strong>Dados Fornecidos pelo Usuário:</strong> Não exigimos criação de conta. Coletamos apenas os dados inseridos no formulário de geração (Nome, Número, Clube) temporariamente para processar a requisição de imagem.
          </p>
          <p className="text-sm leading-relaxed mb-2">
            <strong>Upload de Imagens:</strong> Se você fizer upload de um logotipo, este arquivo é enviado para a API do Google Gemini para processamento e não é armazenado permanentemente em nossos servidores.
          </p>
          <p className="text-sm leading-relaxed">
            <strong>Logs de Acesso:</strong> Como a maioria dos sites, coletamos logs padrão que podem incluir seu endereço IP, tipo de navegador e páginas visitadas para fins de segurança e análise de tráfego.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Cookie className="w-5 h-5 text-emerald-400" /> 3. Cookies e Publicidade (Google AdSense)
          </h3>
          <p className="text-sm leading-relaxed mb-3">
            Utilizamos cookies para melhorar a funcionalidade do site e veicular anúncios. O FutArt exibe anúncios fornecidos pelo Google AdSense.
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
             <li>Terceiros, incluindo o Google, usam cookies para veicular anúncios com base em visitas anteriores do usuário ao seu website ou a outros websites.</li>
             <li>Com o uso de cookies de publicidade, o Google e seus parceiros podem veicular anúncios aos usuários com base nas visitas feitas aos seus sites e/ou a outros sites na Internet.</li>
             <li>Os usuários podem optar por desativar a publicidade personalizada acessando as <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">Configurações de Anúncios</a>.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Lock className="w-5 h-5 text-emerald-400" /> 4. GDPR e LGPD
          </h3>
          <p className="text-sm leading-relaxed">
            Respeitamos seus direitos sob o Regulamento Geral de Proteção de Dados (GDPR) e a Lei Geral de Proteção de Dados (LGPD). 
            Você tem o direito de solicitar o acesso, correção ou exclusão de quaisquer dados pessoais que possamos ter (embora, por padrão, não retenhamos dados pessoais identificáveis).
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

      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 space-y-8">
        <section>
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-400" /> 1. Aceitação dos Termos
          </h3>
          <p className="text-sm leading-relaxed">
            Ao acessar e usar o FutArt, você aceita e concorda em estar vinculado aos termos e disposições deste contrato. 
            Se você não concordar em cumprir estes termos, por favor, não use nosso serviço.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Info className="w-5 h-5 text-purple-400" /> 2. Descrição do Serviço e "Fan Art"
          </h3>
          <p className="text-sm leading-relaxed mb-2">
            O FutArt é uma ferramenta baseada em IA que permite aos usuários gerar imagens digitais ("Wallpapers"). 
          </p>
          <p className="text-sm leading-relaxed border-l-2 border-purple-500 pl-4 bg-purple-500/5 p-2 rounded-r-lg">
            <strong>AVISO LEGAL IMPORTANTE:</strong> Todas as imagens geradas são classificadas como "Fan Art". 
            O FutArt não é afiliado, endossado ou patrocinado por nenhum clube de futebol ou entidade esportiva. 
            As representações de uniformes e cores são interpretações artísticas da IA e não produtos oficiais.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Shield className="w-5 h-5 text-purple-400" /> 3. Uso Aceitável
          </h3>
          <p className="text-sm leading-relaxed mb-2">
            Você concorda em usar o serviço apenas para fins legais e pessoais. É estritamente proibido:
          </p>
          <ul className="list-disc pl-5 space-y-2 text-sm text-slate-400">
             <li>Usar as imagens geradas para fins comerciais (venda de produtos, estampas, etc.) sem autorização dos detentores dos direitos das marcas representadas.</li>
             <li>Gerar conteúdo que seja ilegal, ofensivo, difamatório, ou que promova discurso de ódio.</li>
             <li>Tentar fazer engenharia reversa ou sobrecarregar nossa infraestrutura.</li>
          </ul>
        </section>
        
        <section>
          <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
            <Zap className="w-5 h-5 text-purple-400" /> 4. Limitação de Responsabilidade
          </h3>
          <p className="text-sm leading-relaxed">
            O serviço é fornecido "como está". Não garantimos que a geração de imagens será ininterrupta ou livre de erros. 
            A qualidade da imagem depende da interpretação da IA e dos inputs do usuário.
          </p>
        </section>
      </div>
    </div>
  );
};