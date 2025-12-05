import React, { useState } from 'react';
import { BannerFormData, BannerStyle, BannerStatus } from '../types';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import { FileUpload } from './ui/FileUpload';

interface BannerFormProps {
  onSubmit: (data: BannerFormData) => void;
  isGenerating: boolean;
}

export const BannerForm: React.FC<BannerFormProps> = ({ onSubmit, isGenerating }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [formData, setFormData] = useState<BannerFormData>({
    status: 'APROVADO',
    customStatusText: '',
    athleteName: '',
    birthYear: '',
    category: '',
    clubName: '',
    date: new Date().toLocaleDateString('pt-BR'),
    customMessage: '',
    style: BannerStyle.JDES_ACADEMY,
    colorStrategy: 'auto',
    manualColor: '',
    photoCount: 1,
    athletePhotoMain: null,
    athletePhotoLeft: null,
    athletePhotoRight: null,
    clubLogo: null,
    schoolLogo: null,
    clubJersey: null,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.athletePhotoMain) {
      alert("⚠️ REQUISITO V6: Foto Principal (Centro) é obrigatória.");
      return;
    }
    
    if (!formData.clubLogo && formData.colorStrategy === 'auto' && formData.status === 'APROVADO') {
        alert("⚠️ ATENÇÃO: Para usar AUTO-COLOR, você precisa enviar a Logo do Clube.");
        return;
    }

    if (formData.photoCount >= 2 && !formData.athletePhotoLeft) {
        alert("⚠️ FALTA FOTO: Selecionou 2+ fotos mas não enviou a Lateral Esquerda.");
        return;
    }

    if (formData.photoCount === 3 && !formData.athletePhotoRight) {
        alert("⚠️ FALTA FOTO: Selecionou 3 fotos mas não enviou a Lateral Direita.");
        return;
    }

    if (formData.status === 'CUSTOM' && (!formData.customStatusText || formData.customStatusText.trim() === '')) {
       alert("⚠️ TEXTO VAZIO: Digite a manchete personalizada.");
       return;
    }

    onSubmit(formData);
  };

  // Helper para gerar URL temporária para preview
  const getPreviewUrl = (file: File | null | undefined) => {
    return file ? URL.createObjectURL(file) : null;
  };

  const PreviewModal = () => {
    if (!showPreview) return null;

    const mainPhotoUrl = getPreviewUrl(formData.athletePhotoMain);
    const leftPhotoUrl = getPreviewUrl(formData.athletePhotoLeft);
    const rightPhotoUrl = getPreviewUrl(formData.athletePhotoRight);
    const clubLogoUrl = getPreviewUrl(formData.clubLogo);
    const schoolLogoUrl = getPreviewUrl(formData.schoolLogo);

    let headline = formData.status;
    if (formData.status === 'CUSTOM') headline = formData.customStatusText || 'TITULO';

    return (
      <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
        <div className="relative bg-[#0a0a0a] border border-white/20 rounded-xl shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between p-4 border-b border-white/10 bg-[#111]">
                <div>
                    <h3 className="text-white font-display font-bold text-xl tracking-wide">PRÉVIA DE LAYOUT (ESQUEMÁTICO)</h3>
                    <p className="text-xs text-yellow-500 font-mono">⚠️ Efeitos de luz, recorte e cores finais serão gerados pela IA.</p>
                </div>
                <button 
                    onClick={() => setShowPreview(false)}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
                >
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 overflow-auto p-4 flex justify-center bg-[#050505]">
                {/* 9:16 Aspect Ratio Container */}
                <div className="relative w-[320px] h-[568px] bg-gradient-to-b from-slate-800 to-black overflow-hidden shadow-2xl border border-white/5 ring-1 ring-white/10 flex-shrink-0">
                    
                    {/* Background Suggestion */}
                    <div className="absolute inset-0 opacity-30 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>

                    {/* IMAGES LAYER */}
                    <div className="absolute inset-0 flex items-end justify-center pb-20 pointer-events-none">
                        {/* Left Photo */}
                        {formData.photoCount >= 2 && leftPhotoUrl && (
                            <img src={leftPhotoUrl} className="absolute left-[-20px] bottom-10 h-[350px] w-auto object-cover opacity-60 mix-blend-luminosity grayscale contrast-125 z-0" />
                        )}
                        {/* Right Photo */}
                        {formData.photoCount === 3 && rightPhotoUrl && (
                            <img src={rightPhotoUrl} className="absolute right-[-20px] bottom-10 h-[350px] w-auto object-cover opacity-60 mix-blend-luminosity grayscale contrast-125 z-0" />
                        )}
                         {/* Main Photo */}
                         {mainPhotoUrl && (
                            <img src={mainPhotoUrl} className="relative h-[450px] w-auto object-cover z-10 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]" />
                        )}
                    </div>

                    {/* OVERLAY CONTENT */}
                    <div className="absolute inset-0 z-20 flex flex-col justify-between p-6">
                        {/* Top Logos */}
                        <div className="flex justify-between items-start">
                             {schoolLogoUrl ? <img src={schoolLogoUrl} className="w-12 h-12 object-contain drop-shadow-lg" /> : <div className="w-12 h-12 bg-white/10 rounded-full"></div>}
                             {clubLogoUrl && <img src={clubLogoUrl} className="w-14 h-14 object-contain drop-shadow-lg" />}
                        </div>

                        {/* Text Content */}
                        <div className="mt-auto space-y-1 text-center">
                            {/* Headline */}
                            <div className="relative">
                                <h1 className="font-display font-black text-5xl text-white uppercase italic leading-none tracking-tighter drop-shadow-md">
                                    {headline}
                                </h1>
                                <div className="h-1 w-20 bg-yellow-500 mx-auto mt-1 mb-2"></div>
                            </div>

                            {/* Athlete Name */}
                            {formData.athleteName && (
                                <h2 className="font-display font-bold text-3xl text-white uppercase tracking-wider drop-shadow-md leading-none">
                                    {formData.athleteName}
                                </h2>
                            )}

                             {/* Club Name - Only for APROVADO */}
                             {formData.status === 'APROVADO' && formData.clubName && (
                                <h3 className="font-display font-bold text-xl text-yellow-400 uppercase tracking-widest drop-shadow-sm">
                                    {formData.clubName}
                                </h3>
                            )}

                             {/* Footer Details */}
                             <div className="flex justify-center gap-3 text-[10px] text-gray-300 font-mono uppercase tracking-widest mt-2 border-t border-white/20 pt-2">
                                {formData.category && <span>{formData.category}</span>}
                                {formData.birthYear && <span>• {formData.birthYear}</span>}
                             </div>
                             
                             {/* Optional Phrase */}
                             {formData.customMessage && (
                                <div className="text-[10px] text-yellow-200 italic mt-1 font-serif">
                                    "{formData.customMessage}"
                                </div>
                             )}

                             {/* Signature */}
                             <div className="pt-4 opacity-50 text-[8px] uppercase tracking-[0.2em] text-white/60">
                                Desenvolvido por JDES Sports Academy
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="p-4 border-t border-white/10 bg-[#111] flex justify-end gap-3">
                 <button 
                    onClick={() => setShowPreview(false)}
                    className="px-4 py-2 text-sm text-slate-400 hover:text-white transition-colors"
                 >
                    Fechar
                 </button>
                 <button 
                    onClick={(e) => { setShowPreview(false); handleSubmit(e as any); }}
                    className="px-6 py-2 bg-yellow-600 hover:bg-yellow-500 text-black font-bold uppercase tracking-wider rounded text-sm"
                 >
                    Confirmar e Gerar
                 </button>
            </div>
        </div>
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#0f0f0f] p-6 rounded-xl border border-white/10 shadow-2xl relative overflow-hidden">
      
      {/* Decorative top accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600"></div>

      {/* Engine Status */}
      <div className="flex items-center justify-between pb-4 border-b border-white/5">
         <div className="flex items-center gap-2">
            <h3 className="text-lg font-display font-semibold text-white">Configuração JDES V6</h3>
         </div>
         <div className="flex flex-col items-end">
            <span className="text-[10px] font-mono font-bold text-green-500 uppercase tracking-wider">SYSTEM: READY</span>
            <span className="text-[9px] text-slate-500 font-mono">FACE LOCK: ALL PHOTOS</span>
         </div>
      </div>
      
      {/* Seção 1: Status */}
      <div className="space-y-4">
        <label className="text-xs font-mono text-slate-500 uppercase">01. Status do Atleta</label>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-2">
            <button
                type="button"
                onClick={() => setFormData({...formData, status: 'APROVADO'})}
                className={`py-3 px-2 rounded-lg font-display font-bold text-lg tracking-wide border transition-all ${
                    formData.status === 'APROVADO' 
                    ? 'bg-green-600 border-green-400 text-white shadow-[0_0_15px_rgba(34,197,94,0.4)]' 
                    : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
                }`}
            >
                APROVADO
            </button>
            <button
                type="button"
                onClick={() => setFormData({...formData, status: 'CONVOCADO'})}
                className={`py-3 px-2 rounded-lg font-display font-bold text-lg tracking-wide border transition-all ${
                    formData.status === 'CONVOCADO' 
                    ? 'bg-blue-600 border-blue-400 text-white shadow-[0_0_15px_rgba(59,130,246,0.4)]' 
                    : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
                }`}
            >
                CONVOCADO
            </button>
            <button
                type="button"
                onClick={() => setFormData({...formData, status: 'CUSTOM'})}
                className={`py-3 px-2 rounded-lg font-display font-bold text-lg tracking-wide border transition-all ${
                    formData.status === 'CUSTOM' 
                    ? 'bg-purple-600 border-purple-400 text-white shadow-[0_0_15px_rgba(147,51,234,0.4)]' 
                    : 'bg-slate-900 border-slate-700 text-slate-500 hover:border-slate-500'
                }`}
            >
                PERSONALIZADO
            </button>
        </div>

        {formData.status === 'CUSTOM' && (
             <div className="animate-fadeIn">
                <Input
                    label="Digite o Texto (Ex: Craque do Futuro)"
                    placeholder="SUA FRASE AQUI"
                    value={formData.customStatusText}
                    onChange={(e) => setFormData({ ...formData, customStatusText: e.target.value })}
                    className="font-display font-bold text-xl uppercase tracking-wide border-purple-500/50 focus:ring-purple-500"
                />
             </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Nome do Atleta (Opcional)"
            placeholder="NOME EM DESTAQUE"
            value={formData.athleteName}
            onChange={(e) => setFormData({ ...formData, athleteName: e.target.value })}
            className="font-display font-bold text-2xl uppercase tracking-widest border-white/20 placeholder:font-sans placeholder:text-sm placeholder:normal-case"
          />
          
          {/* Campo Clube só aparece se status for APROVADO */}
          {formData.status === 'APROVADO' && (
              <div className="animate-fadeIn">
                <Input
                    label="Clube Aprovado"
                    placeholder="EX: CRUZEIRO"
                    value={formData.clubName}
                    onChange={(e) => setFormData({ ...formData, clubName: e.target.value })}
                    className="font-display font-bold text-xl uppercase tracking-wide placeholder:font-sans placeholder:text-sm placeholder:normal-case"
                />
              </div>
          )}

          <div className="grid grid-cols-2 gap-4">
             <Input
               label="Categoria (Opc)"
               placeholder="SUB-11"
               value={formData.category}
               onChange={(e) => setFormData({ ...formData, category: e.target.value })}
               className="font-display font-bold text-xl uppercase tracking-wide placeholder:font-sans placeholder:text-sm placeholder:normal-case"
             />
             <Input
               label="Ano Nasc. (Opc)"
               placeholder="2014"
               value={formData.birthYear}
               onChange={(e) => setFormData({ ...formData, birthYear: e.target.value })}
               className="font-display font-bold text-xl uppercase tracking-wide placeholder:font-sans placeholder:text-sm placeholder:normal-case"
             />
          </div>
          <Input
              label="Frase Secundária (Opcional)"
              placeholder="Ex: O sonho continua"
              value={formData.customMessage}
              onChange={(e) => setFormData({ ...formData, customMessage: e.target.value })}
              className="italic text-yellow-500/90 border-yellow-500/20"
          />
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-center gap-2 text-[9px] text-slate-500 uppercase tracking-widest pt-2">
           <span>Assinatura: Desenvolvido por JDES Sports Academy</span>
        </div>
      </div>

      {/* Seção 2: Visual Engine */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <label className="text-xs font-mono text-slate-500 uppercase">02. Visual Engine V6</label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Select
            label="Estilo Visual"
            options={Object.values(BannerStyle)}
            value={formData.style}
            onChange={(e) => setFormData({ ...formData, style: e.target.value as BannerStyle })}
            className="h-[50px] font-bold text-yellow-500"
          />

          <div className="flex flex-col gap-2">
             <label className="text-sm font-medium text-gray-300 tracking-wide uppercase font-display">
                Lógica de Cores
             </label>
             <div className="flex bg-slate-900 p-1 rounded-lg border border-slate-800">
               <button type="button" onClick={() => setFormData({...formData, colorStrategy: 'auto'})}
                 className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${formData.colorStrategy === 'auto' ? 'bg-gradient-to-r from-blue-600 to-cyan-600 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                 AUTO (CLUBE)
               </button>
               <button type="button" onClick={() => setFormData({...formData, colorStrategy: 'manual'})}
                 className={`flex-1 py-2 text-xs font-bold rounded-md transition-all ${formData.colorStrategy === 'manual' ? 'bg-slate-700 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}>
                 MANUAL
               </button>
             </div>
             {formData.colorStrategy === 'manual' && (
                <div className="animate-fadeIn">
                    <input 
                    type="text" 
                    placeholder="Digite a cor (Ex: Dourado)"
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none mt-2"
                    value={formData.manualColor}
                    onChange={(e) => setFormData({...formData, manualColor: e.target.value})}
                    />
                </div>
             )}
          </div>
        </div>
      </div>

      {/* Seção 3: Imagens */}
      <div className="space-y-4 pt-4 border-t border-white/5">
        <div className="flex items-center justify-between">
           <label className="text-xs font-mono text-slate-500 uppercase">03. Imagens (Até 3 Fotos)</label>
           <div className="flex bg-slate-900 rounded p-1">
              {[1, 2, 3].map((num) => (
                <button 
                    key={num}
                    type="button" 
                    onClick={() => setFormData({...formData, photoCount: num as 1|2|3})}
                    className={`px-4 py-1 text-[10px] font-bold uppercase rounded transition-all ${formData.photoCount === num ? 'bg-white text-black shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>
                    {num} {num === 1 ? 'FOTO' : 'FOTOS'}
                </button>
              ))}
           </div>
        </div>
        
        {/* Layout Visual: Esquerda - Centro - Direita */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
           
           {/* 1. SLOT ESQUERDO */}
           {formData.photoCount >= 2 ? (
              <FileUpload 
                label="LATERAL ESQUERDA" 
                required 
                onChange={(f) => setFormData({...formData, athletePhotoLeft: f})} 
              />
           ) : (
             <div className="hidden md:flex border border-dashed border-slate-800 rounded-lg flex-col items-center justify-center bg-slate-900/30 opacity-40 h-48">
                <span className="text-[9px] text-slate-600 uppercase font-mono">Espaço Vazio</span>
             </div>
           )}

           {/* 2. SLOT CENTRO (PRINCIPAL) - Sempre visível */}
           <div className="order-first md:order-none col-span-2 md:col-span-1">
               <FileUpload 
                label="PRINCIPAL (CENTRO)" 
                required 
                onChange={(f) => setFormData({...formData, athletePhotoMain: f})} 
               />
           </div>

           {/* 3. SLOT DIREITO */}
           {formData.photoCount === 3 ? (
              <FileUpload 
                label="LATERAL DIREITA" 
                required 
                onChange={(f) => setFormData({...formData, athletePhotoRight: f})} 
              />
           ) : (
             <div className="hidden md:flex border border-dashed border-slate-800 rounded-lg flex-col items-center justify-center bg-slate-900/30 opacity-40 h-48">
                <span className="text-[9px] text-slate-600 uppercase font-mono">Espaço Vazio</span>
             </div>
           )}
        </div>

        {/* LOGOS */}
        <div className="grid grid-cols-2 gap-4 mt-2">
            <div className="flex flex-col gap-1">
                <FileUpload label="Logo Clube" onChange={(f) => setFormData({...formData, clubLogo: f})} />
                <span className="text-[9px] text-slate-500 leading-tight">
                    *Deve aparecer no banner.
                </span>
            </div>
            
            <FileUpload label="Logo JDES" onChange={(f) => setFormData({...formData, schoolLogo: f})} />
        </div>
      </div>

      <div className="pt-6 grid grid-cols-5 gap-3">
        <button
            type="button"
            onClick={() => setShowPreview(true)}
            disabled={isGenerating}
            className="col-span-2 py-4 rounded-lg font-display font-bold text-lg tracking-wider uppercase border border-slate-700 bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all"
        >
            PRÉ-VISUALIZAR
        </button>

        <button
          type="submit"
          disabled={isGenerating}
          className={`col-span-3 py-4 rounded-lg font-display font-bold text-xl tracking-widest uppercase transition-all relative overflow-hidden group border
            ${isGenerating 
              ? 'bg-slate-900 border-slate-800 cursor-wait text-slate-600' 
              : 'bg-yellow-600 border-yellow-500 text-black hover:bg-yellow-500 hover:shadow-[0_0_30px_rgba(234,179,9,0.4)]'
            }`}
        >
          <span className="relative z-10">{isGenerating ? 'RENDERIZANDO...' : 'CRIAR OFICIAL'}</span>
        </button>
      </div>
      
      {/* Modal Render */}
      <PreviewModal />

    </form>
  );
};