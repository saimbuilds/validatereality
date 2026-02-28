"use client";

import { motion, Variants } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowUpRight, MessageSquare, Download, Loader2 } from "lucide-react";
import { ShareTicket } from "./ShareTicket";
import { useState } from "react";
import html2canvas from "html2canvas";

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.15,
            delayChildren: 0.1
        }
    }
};

const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30, filter: "blur(4px)" },
    show: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        transition: {
            type: "spring",
            stiffness: 100,
            damping: 20
        }
    }
};

export interface StartupData {
    vibeScore: number;
    vibeLabel: string;
    roast: string;
    hype: string;
    demandScale: number;
    supplyScale: number;
    icp: string;
    monetization: string;
    mvpPlan: string[];
    competitors: { name: string; url: string; weakness: string }[];
    marketEvidence: { title: string; url: string; source: string }[];
    gtm?: {
        hidingSpot: string;
        communities: string[];
        coldDm: string;
        launchChecklist: string[];
    };
    roadmap?: {
        week1: string[];
        week2: string[];
        week3: string[];
        week4: string;
    };
    [key: string]: unknown;
}

export function ResultsCard({ data }: { data: StartupData }) {
    const score = data.vibeScore;
    const isHighScoring = score > 50;
    const isUnicorn = score > 75;
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            const element = document.getElementById("share-ticket");
            if (element) {
                // html2canvas needs the element to be visible in the DOM flow to render it properly.
                // We briefly reset its fixed positioning, capture, then restore it.
                element.style.position = 'relative';
                element.style.left = '0';
                element.style.top = '0';

                const canvas = await html2canvas(element, {
                    scale: 2, // higher resolution
                    useCORS: true,
                    backgroundColor: "#050505",
                });

                // Restore offscreen positioning
                element.style.position = 'fixed';
                element.style.left = '-10000px';
                element.style.top = '-10000px';

                const image = canvas.toDataURL("image/png");
                const link = document.createElement("a");
                link.href = image;
                link.download = `startup-vibe-score-${score}.png`;
                link.click();
            }
        } catch (error) {
            console.error("Failed to generate receipt:", error);
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="w-full max-w-5xl mx-auto pb-20 relative"
        >
            {/* Hidden Share Ticket for html2canvas */}
            <div style={{ position: 'fixed', left: '-10000px', top: '-10000px' }}>
                <ShareTicket data={data} id="share-ticket" />
            </div>

            {/* Header: Vibe Score */}
            <motion.div variants={itemVariants} className="flex flex-col items-center justify-center py-10 sm:py-16 text-center space-y-6 relative px-4">
                <div className="flex flex-col sm:flex-row justify-between items-center w-full max-w-2xl gap-4 sm:gap-0">
                    <Badge
                        variant="outline"
                        className="tracking-widest uppercase text-[10px] sm:text-xs px-4 py-1.5 font-medium border-white/10 bg-white/5 backdrop-blur-md text-muted-foreground"
                    >
                        Truth Engine Analysis complete
                    </Badge>

                    <button
                        onClick={handleDownload}
                        disabled={isDownloading}
                        className="flex items-center gap-2 text-[10px] sm:text-xs font-bold uppercase tracking-widest px-6 py-2.5 rounded-full bg-white text-black hover:bg-gray-200 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all disabled:opacity-50 disabled:cursor-not-allowed z-50 w-full sm:w-auto justify-center"
                    >
                        {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                        {isDownloading ? "Generating..." : "Save Analysis"}
                    </button>
                </div>

                <div className="relative">
                    <h2 className="text-[120px] leading-none sm:text-[180px] font-black tracking-tighter title-gradient text-transparent bg-clip-text bg-gradient-to-b from-white via-white/80 to-black/20 z-10 relative">
                        {score}
                    </h2>
                </div>

                <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/5 border border-white/10">
                    <div className={`w-2 h-2 rounded-full ${isUnicorn ? 'bg-indigo-400' : isHighScoring ? 'bg-emerald-400' : 'bg-rose-400'} animate-pulse`} />
                    <span className="text-sm font-medium tracking-wide text-white/80">
                        {data.vibeLabel}
                    </span>
                </div>
            </motion.div>

            {/* TABBED INTERFACE */}
            <motion.div variants={itemVariants} className="mt-8 px-2 sm:px-0">
                <Tabs defaultValue="reality" className="w-full">
                    <div className="flex justify-center mb-8 px-2">
                        <TabsList className="bg-white/5 border border-white/10 p-1 rounded-2xl flex-wrap sm:flex-nowrap h-auto justify-center gap-1 sm:gap-0">
                            <TabsTrigger value="reality" className="rounded-xl px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-medium data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all w-full sm:w-auto">
                                01. Reality Check
                            </TabsTrigger>
                            <TabsTrigger value="evidence" className="rounded-xl px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-medium data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all w-full sm:w-auto">
                                02. Market Evidence
                            </TabsTrigger>
                            <TabsTrigger value="execution" className="rounded-xl px-4 py-2 sm:px-6 sm:py-2.5 text-xs sm:text-sm font-medium data-[state=active]:bg-white/10 data-[state=active]:text-white transition-all w-full sm:w-auto">
                                03. Execution Playbook
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    {/* TAB 1: REALITY CHECK */}
                    <TabsContent value="reality" className="mt-0 outline-none">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/10 rounded-3xl overflow-hidden border border-white/5 shadow-2xl">

                            {/* The Roast */}
                            <div className="bg-[#050505] p-8 sm:p-12 flex flex-col justify-between relative group hover:bg-[#0a0a0a] transition-colors">
                                <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-9xl leading-none pointer-events-none text-rose-500">
                                    &ldquo;
                                </div>
                                <div className="z-10 mb-8 flex items-center gap-4">
                                    <span className="font-mono text-[10px] text-white/30 tracking-widest">[ 01 ]</span>
                                    <h3 className="text-[11px] font-mono uppercase tracking-[0.3em] text-rose-500">The Brutal Roast</h3>
                                </div>
                                <p className="z-10 text-lg sm:text-xl font-medium text-white/80 leading-relaxed text-balance">
                                    {data.roast}
                                </p>
                            </div>

                            {/* The Hype */}
                            <div className="bg-[#050505] p-8 sm:p-12 flex flex-col justify-between relative group hover:bg-[#0a0a0a] transition-colors">
                                <div className="absolute top-0 right-0 p-8 opacity-5 font-black text-9xl leading-none pointer-events-none text-emerald-500">
                                    &ldquo;
                                </div>
                                <div className="z-10 mb-8 flex items-center gap-4">
                                    <span className="font-mono text-[10px] text-white/30 tracking-widest">[ 02 ]</span>
                                    <h3 className="text-[11px] font-mono uppercase tracking-[0.3em] text-emerald-500">The Best Case</h3>
                                </div>
                                <p className="z-10 text-lg sm:text-xl font-medium text-white/80 leading-relaxed text-balance">
                                    {data.hype}
                                </p>
                            </div>

                            {/* Market Mechanics: Demand vs Supply Bars */}
                            <div className="bg-[#050505] p-8 sm:p-12 md:col-span-2 group hover:bg-[#0a0a0a] transition-colors relative overflow-hidden">
                                <div className="z-10 mb-8 flex items-center gap-4">
                                    <span className="font-mono text-[10px] text-white/30 tracking-widest">[ 03 ]</span>
                                    <h3 className="text-[11px] font-mono uppercase tracking-[0.3em] text-white">Market Mechanics</h3>
                                </div>
                                <div className="space-y-8">
                                    {/* Demand Bar */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                                            <span className="text-white/60">Consumer Demand</span>
                                            <span className="text-emerald-400 font-bold">{data.demandScale}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${data.demandScale}%` }}
                                                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
                                                className="h-full bg-gradient-to-r from-emerald-900 via-emerald-500 to-emerald-300"
                                            />
                                        </div>
                                    </div>

                                    {/* Supply/Competition Bar */}
                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center text-[10px] font-mono uppercase tracking-widest">
                                            <span className="text-white/60">Existing Supply (Competition)</span>
                                            <span className="text-rose-400 font-bold">{data.supplyScale}%</span>
                                        </div>
                                        <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                            <motion.div
                                                initial={{ width: 0 }}
                                                animate={{ width: `${data.supplyScale}%` }}
                                                transition={{ duration: 1, delay: 0.7, ease: "easeOut" }}
                                                className="h-full bg-gradient-to-r from-rose-900 via-rose-500 to-rose-300"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* ICP & Monetization */}
                            <div className="bg-[#050505] md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/10">
                                <div className="bg-[#050505] p-8 sm:p-12 flex flex-col gap-6 group hover:bg-[#0a0a0a] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono text-[10px] text-white/30 tracking-widest">[ 04 ]</span>
                                        <h3 className="text-[11px] font-mono uppercase tracking-[0.3em] text-indigo-400">Target ICP</h3>
                                    </div>
                                    <p className="text-white/60 leading-relaxed text-sm">{data.icp}</p>
                                </div>
                                <div className="bg-[#050505] p-8 sm:p-12 flex flex-col gap-6 group hover:bg-[#0a0a0a] transition-colors">
                                    <div className="flex items-center gap-4">
                                        <span className="font-mono text-[10px] text-white/30 tracking-widest">[ 05 ]</span>
                                        <h3 className="text-[11px] font-mono uppercase tracking-[0.3em] text-amber-500">Monetization</h3>
                                    </div>
                                    <p className="text-white/60 leading-relaxed text-sm">{data.monetization}</p>
                                </div>
                            </div>

                        </div>
                    </TabsContent>

                    {/* TAB 2: EXECUTION PLAYBOOK */}
                    <TabsContent value="execution" className="mt-0 outline-none">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

                            {/* GTM SECTION - Left Column */}
                            <div className="lg:col-span-5 flex flex-col gap-6">
                                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 sm:p-10 h-full shadow-inner">
                                    <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-amber-500 mb-8 border-b border-white/10 pb-4">Your First 100 Users</h2>

                                    {data.gtm && (
                                        <div className="space-y-8">
                                            {/* Where they hide */}
                                            <div>
                                                <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-3">Where they are hiding</h3>
                                                <p className="text-sm text-white/80 leading-relaxed font-medium">{data.gtm.hidingSpot}</p>
                                            </div>

                                            {/* Communities */}
                                            <div>
                                                <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-3">Top Subreddits & Forums</h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {data.gtm.communities.map((comm: string, i: number) => (
                                                        <span key={i} className="bg-white/5 border border-white/10 text-white/70 text-xs font-medium rounded p-2">
                                                            {comm}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Cold DM */}
                                            <div>
                                                <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-3">Cold DM Template</h3>
                                                <div className="p-5 rounded-xl bg-white/[0.02] border border-white/[0.05] relative group">
                                                    <p className="text-sm text-white/70 font-mono leading-relaxed whitespace-pre-wrap">{data.gtm.coldDm}</p>
                                                </div>
                                            </div>

                                            {/* Launch Checklist */}
                                            <div>
                                                <h3 className="text-[10px] font-mono uppercase tracking-[0.2em] text-white/40 mb-4">Launch Checklist</h3>
                                                <div className="space-y-3">
                                                    {data.gtm.launchChecklist.map((step: string, i: number) => (
                                                        <div key={i} className="flex gap-4 items-start">
                                                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/50 mt-1.5 flex-shrink-0" />
                                                            <span className="text-sm text-white/80 font-medium">{step}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* ROADMAP SECTION - Right Column */}
                            <div className="lg:col-span-7 flex flex-col gap-6">
                                <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 sm:p-10 h-full shadow-inner">
                                    <h2 className="text-xs font-mono uppercase tracking-[0.2em] text-indigo-400 mb-8 border-b border-white/10 pb-4">Your Next 30 Days</h2>

                                    {data.roadmap && (
                                        <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[15px] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-px before:bg-white/10">

                                            {/* Week 1 */}
                                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-[#0a0a0a] text-white/50 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-mono text-xs">W1</div>
                                                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] md:group-odd:pr-6 md:group-even:pl-6">
                                                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                                                        <h3 className="font-semibold text-white/90 mb-3 text-sm uppercase tracking-wider text-rose-400">Validate</h3>
                                                        <ul className="space-y-2">
                                                            {data.roadmap.week1.map((item: string, i: number) => (
                                                                <li key={i} className="text-[13px] font-medium text-white/70 flex gap-2"><span className="text-white/30">-</span> {item}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Week 2 */}
                                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-[#0a0a0a] text-white/50 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-mono text-xs">W2</div>
                                                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] md:group-odd:pr-6 md:group-even:pl-6">
                                                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                                                        <h3 className="font-semibold text-white/90 mb-3 text-sm uppercase tracking-wider text-amber-400">Build MVP</h3>
                                                        <ul className="space-y-2">
                                                            {data.roadmap.week2.map((item: string, i: number) => (
                                                                <li key={i} className="text-[13px] font-medium text-white/70 flex gap-2"><span className="text-white/30">-</span> {item}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Week 3 */}
                                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-[#0a0a0a] text-white/50 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-mono text-xs">W3</div>
                                                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] md:group-odd:pr-6 md:group-even:pl-6">
                                                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                                                        <h3 className="font-semibold text-white/90 mb-3 text-sm uppercase tracking-wider text-emerald-400">First Users</h3>
                                                        <ul className="space-y-2">
                                                            {data.roadmap.week3.map((item: string, i: number) => (
                                                                <li key={i} className="text-[13px] font-medium text-white/70 flex gap-2"><span className="text-white/30">-</span> {item}</li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Week 4 */}
                                            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                                <div className="flex items-center justify-center w-8 h-8 rounded-full border border-white/20 bg-[#0a0a0a] text-white/50 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 font-mono text-xs">W4</div>
                                                <div className="w-[calc(100%-3rem)] md:w-[calc(50%-2rem)] md:group-odd:pr-6 md:group-even:pl-6">
                                                    <div className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
                                                        <h3 className="font-semibold text-white/90 mb-3 text-sm uppercase tracking-wider text-indigo-400">Charge Money</h3>
                                                        <p className="text-[13px] font-medium text-white/70 leading-relaxed">{data.roadmap.week4}</p>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    {/* TAB 3: MARKET EVIDENCE */}
                    <TabsContent value="evidence" className="mt-0 outline-none space-y-6">
                        {/* Competitors */}
                        <div className="bg-[#0a0a0a] p-8 sm:p-10 border border-white/10 rounded-3xl">
                            <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground mb-8">Live Competitors</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {data.competitors.map((comp, i: number) => (
                                    <a
                                        key={i}
                                        href={comp.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="group block relative p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.08] transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <h4 className="font-semibold text-white/90 group-hover:text-white transition-colors">{comp.name}</h4>
                                            <ArrowUpRight className="w-4 h-4 text-white/20 group-hover:text-white/60 transition-colors shrink-0" />
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">Lack: {comp.weakness}</p>
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Web Evidence */}
                        <div className="bg-[#0a0a0a] p-8 sm:p-10 border border-white/10 rounded-3xl">
                            <div className="flex items-center gap-3 text-muted-foreground mb-8">
                                <MessageSquare className="w-5 h-5 text-blue-500" />
                                <h3 className="text-xs font-mono uppercase tracking-widest">Market Validation (Web / Articles)</h3>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {data.marketEvidence?.map((post, i: number) => (
                                    <a
                                        key={i}
                                        href={post.url}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="flex gap-4 p-5 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] transition-colors border border-transparent hover:border-white/5"
                                    >
                                        <div className="flex-shrink-0">
                                            <div className="flex flex-col items-center justify-center bg-white/5 rounded-lg px-3 py-2 border border-white/5">
                                                <ArrowUpRight className="w-3 h-3 text-white/40 mb-1" />
                                                <span className="text-[10px] font-mono font-bold text-white/80 uppercase tracking-wider">{post.source || "WEB"}</span>
                                            </div>
                                        </div>
                                        <span className="text-white/80 hover:text-white transition-colors line-clamp-3 leading-relaxed text-sm mt-1">
                                            {post.title}
                                        </span>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                </Tabs>
            </motion.div>
        </motion.div>
    );
}
