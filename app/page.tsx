'use client';

export default function Home() {
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans">
      <nav className="border-b border-white/5 bg-[#0a0a0a]/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-600 to-yellow-400 flex items-center justify-center font-bold text-lg text-black">
              J
            </div>
            <span className="font-bold text-xl tracking-wider">
              JDES ACADEMY <span className="text-yellow-500 text-sm">V6</span>
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
              ENGINE V6 ONLINE
            </span>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6 border-l-4 border-yellow-500 pl-4">
          <h1 className="text-4xl font-bold text-white mb-2">Banner Engine V6</h1>
          <p className="text-slate-400 text-sm">Sistema oficial JDES Academy - Gerador de Banners Inteligente</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-8 space-y-6">
              <h2 className="text-2xl font-bold text-white">Criar Banner</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Nome do Jogador</label>
                  <input type="text" placeholder="Ex: João Silva" className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-yellow-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Categoria</label>
                  <select className="w-full px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-yellow-500">
                    <option>U7</option>
                    <option>U9</option>
                    <option>U11</option>
                    <option>U13</option>
                    <option>U15</option>
                  </select>
                </div>
                <button className="w-full bg-yellow-600 hover:bg-yellow-500 text-black font-bold py-3 rounded-lg transition">
                  Gerar Banner
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="bg-[#0a0a0a] border border-white/10 rounded-lg p-8">
              <h2 className="text-xl font-bold text-white mb-4">Preview</h2>
              <div className="aspect-[9/16] bg-gradient-to-br from-slate-900 to-black rounded-lg border border-slate-700 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-6xl font-bold text-yellow-500 mb-4">J</div>
                  <p className="text-slate-400">Seu banner aparecerá aqui</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
