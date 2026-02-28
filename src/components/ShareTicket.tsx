import { StartupData } from "./ResultsCard";

export function ShareTicket({ data, id }: { data: StartupData, id: string }) {
    const isHighScoring = data.vibeScore > 50;
    const isUnicorn = data.vibeScore > 75;

    // A sleek, vertical gradient card designed for Twitter/Instagram stories
    return (
        <div
            id={id}
            className="w-[480px] min-h-[700px] bg-[#09090b] text-white flex flex-col relative overflow-hidden font-sans border-8 border-[#18181b]"
            style={{
                fontFamily: 'system-ui, -apple-system, sans-serif'
            }}
        >
            {/* Custom SVG Grid Background for a "Tech" Vibe */}
            <div className="absolute inset-0 z-0 opacity-[0.15] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#f4f4f5 1px, transparent 1px), linear-gradient(90deg, #f4f4f5 1px, transparent 1px)', backgroundSize: '24px 24px' }} />

            {/* Ambient Background Glows */}
            <div className={`absolute top-[-20%] right-[-20%] w-[400px] h-[400px] bg-gradient-to-br ${isUnicorn ? 'from-indigo-500/30' : isHighScoring ? 'from-emerald-500/30' : 'from-rose-500/30'} blur-[100px] rounded-full mix-blend-screen pointer-events-none z-0`} />
            <div className={`absolute bottom-[-10%] left-[-20%] w-[300px] h-[300px] bg-gradient-to-br ${isUnicorn ? 'from-indigo-600/20' : isHighScoring ? 'from-teal-600/20' : 'from-rose-600/20'} blur-[80px] rounded-full mix-blend-screen pointer-events-none z-0`} />

            {/* Content Wrapper */}
            <div className="relative z-10 flex flex-col flex-grow p-10 h-full">

                {/* Header (Top Left Logo) */}
                <div className="flex items-center gap-3 mb-10">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-black font-black text-sm bg-gradient-to-br ${isUnicorn ? 'from-indigo-400 to-indigo-600' : isHighScoring ? 'from-emerald-400 to-emerald-600' : 'from-rose-400 to-rose-600'} shadow-lg`}>
                        V
                    </div>
                    <div>
                        <div className="font-bold tracking-[0.15em] text-sm leading-none mb-1">VALIDATOR</div>
                        <div className="text-[9px] font-mono tracking-[0.2em] text-white/50 uppercase leading-none">AI Truth Engine</div>
                    </div>
                </div>

                {/* Vibe Score Hero */}
                <div className="flex flex-col mb-10 w-full">
                    <div className="flex items-end gap-4 mb-2">
                        <div className="text-[120px] font-black leading-[0.85] tracking-tighter text-white drop-shadow-2xl">
                            {data.vibeScore}
                        </div>
                    </div>
                    <div className={`inline-flex items-center self-start px-3 py-1.5 rounded border ${isUnicorn ? 'border-indigo-500/50 bg-indigo-500/10 text-indigo-300' : isHighScoring ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-300' : 'border-rose-500/50 bg-rose-500/10 text-rose-300'} text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-sm`}>
                        {data.vibeLabel}
                    </div>
                </div>

                {/* Main Content Cards */}
                <div className="flex-grow space-y-5 mb-10 w-full">
                    {/* Roast Card */}
                    <div className="bg-[#18181b]/80 backdrop-blur-md border border-white/10 p-5 rounded-2xl relative shadow-2xl overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-rose-400 to-rose-600" />
                        <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-rose-400 font-bold">The Brutal Roast</h3>
                        </div>
                        <p className="text-[13px] font-medium text-white/90 leading-relaxed max-h-[100px] overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>
                            &quot;{data.roast}&quot;
                        </p>
                    </div>

                    {/* Hype Card */}
                    <div className="bg-[#18181b]/80 backdrop-blur-md border border-white/10 p-5 rounded-2xl relative shadow-2xl overflow-hidden">
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-emerald-600" />
                        <div className="flex items-center gap-2 mb-3">
                            <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-emerald-400 font-bold">The Best Case</h3>
                        </div>
                        <p className="text-[13px] font-medium text-white/90 leading-relaxed max-h-[100px] overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 4, WebkitBoxOrient: 'vertical' }}>
                            &quot;{data.hype}&quot;
                        </p>
                    </div>
                </div>

                {/* Footer Footer */}
                <div className="mt-auto pt-6 border-t border-white/10 w-full flex items-end justify-between">
                    <div className="flex-1 pr-6">
                        <div className="text-[9px] font-mono text-white/40 uppercase tracking-[0.15em] mb-1.5">Ideal Target</div>
                        <p className="text-[11px] text-white/70 font-medium leading-relaxed max-h-[40px] overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                            {data.icp}
                        </p>
                    </div>
                    <div className="text-right shrink-0">
                        <div className="text-[9px] uppercase tracking-[0.15em] font-mono text-white/30 mb-1">Generated At</div>
                        <div className="text-[10px] font-bold text-white/50">{new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
