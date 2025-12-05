'use client';

import React, { useState } from 'react';
import BannerForm from '@/components/BannerForm';
import { BannerFormData } from '@/types';
import { generateBanner } from '@/services/geminiService';

export default function Home() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (data: BannerFormData) => {
    setIsGenerating(true);
    setResultImage(null);
    setError(null);

    try {
      const imageUrl = await generateBanner(data);
      setResultImage(imageUrl);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao gerar o banner.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-blue-500 selection:text-white font-sans">
      {/* Navbar */}
      <nav className="border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-600 to-yellow-400 flex items-center justify-center font-bold text-lg text-black shadow-lg shadow-yellow-500/20">
              J
            </div>
            <span className="font-display font-bold text-xl tracking-wider">
              JDES ACADEMY <span className="text-yellow-500 text-sm align-top">V6</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              ENGINE V6 ONLINE
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Section */}
          <div className="lg:col-span-7 xl:col-span-7">
            <div className="mb-6 border-l-4 border-yellow-500 pl-4">
              <h1 className="text-3xl font-display font-bold text-white mb-1">Banner Engine V6</h1>
              <p className="text-slate-400 text-sm">
                Sistema oficial JDES Academy: Face Lock Absoluto + Status Inteligente.
              </p>
            </div>
            <BannerForm onSubmit={handleGenerate} isGenerating={isGenerating} />
          </div>

          {/* Result Section */}
          <div className="lg:col-span-5 xl:col-span-5 space-y-6">
            <div className="sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-display font-bold text-white flex items-center gap-2">
                  Banner Gerado
                </h2>
                {resultImage && (
                  <span className="text-xs font-mono text-green-400 border border-green-500/30 px-2 py-0.5 rounded bg-green-500/10">
                    RENDER_SUCCESS
                  </span>
                )}
              </div>

              <div className="flex justify-center">
                <div className="relative w-full max-w-[480px] aspect-[9/16] bg-[#0a0a0a] rounded-xl border border-white/10 overflow-hidden shadow-2xl flex items-center justify-center group">
                  {/* Grid Background */}
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        'linear-gradient(#333 1px, transparent 1px), linear-gradient(90deg, #333 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }}
                  ></div>

                  {isGenerating ? (
                    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center p-8 text-center space-y-6">
                      <div className="relative w-20 h-20">
                        <div className="absolute inset-0 border-2 border-yellow-500/30 rounded-full animate-ping"></div>
                        <div className="absolute inset-0 border-2 border-t-yellow-500 rounded-full animate-spin"></div>
                      </div>
                      <div className="space-y-2">
                        <h3 className="text-lg font-bold text-white font-display tracking-wider">
                          PROCESSANDO V6...
                        </h3>
                        <div className="flex flex-col gap-1 text-xs font-mono text-yellow-400/80">
                          <span>&gt; Analisando Status...</span>
                          <span>&gt; Recortando (Face Lock Ativo)...</span>
                          <span>&gt; Aplicando Estilo...</span>
                          <span>&gt; Finalizando Composição...</span>
                        </div>
                      </div>
                    </div>
                  ) : resultImage ? (
                    <>
                      <img
                        src={resultImage}
                        alt="Banner Gerado"
                        className="w-full h-full object-contain"
                        style={{ imageRendering: 'high-quality' }}
                      />
                      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-8 z-20">
                        <a
                          href={resultImage}
                          download={`JDES-V6-${Date.now()}.png`}
                          className="bg-yellow-600 hover:bg-yellow-500 text-black px-8 py-3 rounded-lg font-bold shadow-lg transform transition hover:-translate-y-1 font-display tracking-wide flex items-center gap-2"
                        >
                          <svg
                            className="w-5 h-5"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          BAIXAR BANNER (HD)
                        </a>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-8 space-y-4 opacity-40 z-10">
                      <div className="w-16 h-16 border-2 border-dashed border-slate-600 rounded-lg mx-auto flex items-center justify-center">
                        <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                      <p className="text-slate-400 font-mono text-xs">AGUARDANDO DADOS...</p>
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="mt-4 p-4 bg-red-900/20 border border-red-500/50 rounded-lg text-red-200 text-sm flex items-start gap-3">
                  <span className="text-xl">⚠️</span>
                  <div>
                    <strong className="block font-mono text-xs uppercase mb-1">Erro do Sistema</strong>
                    {error}
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
