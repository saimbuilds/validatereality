"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { TerminalSquare, ArrowRight, Mic, MicOff, Upload, FileText } from "lucide-react";
import { ResultsCard, StartupData } from "@/components/ResultsCard";
import { useToast } from "@/hooks/use-toast";

export default function Home() {
  const [idea, setIdea] = useState("");
  const [url, setUrl] = useState("");
  const [status, setStatus] = useState<"idle" | "processing" | "results">("idle");
  const [step, setStep] = useState(0);
  const [resultsData, setResultsData] = useState<StartupData | null>(null);

  const [isRecording, setIsRecording] = useState(false);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const { toast } = useToast();

  const processingSteps = [
    { text: "Reading your idea...", delay: 0 },
    { text: "Looking for people who already built this...", delay: 2000 },
    { text: "Checking if anyone actually wants this...", delay: 4000 },
    { text: "Writing up your feedback...", delay: 6000 },
    { text: "Building your launch plan...", delay: 8000 },
  ];

  const handleValidate = async () => {
    if (!idea && !url) return;
    setStatus("processing");
    setStep(0);
    setResultsData(null);

    // Simulate Fake Processing Steps for UI
    const intervals = processingSteps.map((s, i) => {
      return setTimeout(() => {
        setStep(i);
      }, s.delay);
    });

    try {
      const formData = new FormData();
      if (idea) formData.append("idea", idea);
      if (url) formData.append("url", url);
      if (pdfFile) formData.append("pdf", pdfFile);

      const res = await fetch("/api/validate", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Validation failed");

      const data = await res.json();
      setResultsData(data);
      setStatus("results");
    } catch (error) {
      console.error(error);
      setStatus("idle");
    } finally {
      intervals.forEach(clearTimeout);
    }
  };

  const toggleRecording = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      toast({
        title: "Voice not supported",
        description: "Your browser doesn't support the web speech API.",
        variant: "destructive"
      });
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      // Recognition stops automatically in most implementations when we don't call it again,
      // but to be safe, we'll just handle state. The actual instance handles the stop.
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onstart = () => setIsRecording(true);

    recognition.onresult = (event) => {
      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        currentTranscript += event.results[i][0].transcript;
      }
      setIdea(prev => {
        // Very basic deduplication/append logic for hackathon
        const newText = prev ? prev + " " + currentTranscript : currentTranscript;
        return newText.replace(/\s+/g, ' ');
      });
    };

    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognition.start();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "application/pdf") {
      setPdfFile(file);
      toast({
        title: "PDF Attached",
        description: `Ready to analyze ${file.name}`,
      });
    } else {
      toast({
        title: "Invalid file",
        description: "Please upload a valid PDF.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#000000] text-foreground selection:bg-white/30 selection:text-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">

      {/* Custom Tech Grid Background */}
      <div className="absolute inset-0 z-0 opacity-[0.10] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

      {/* Ambient Background Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-indigo-500/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none z-0" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-gradient-to-br from-rose-500/20 blur-[150px] rounded-full mix-blend-screen pointer-events-none z-0" />

      <AnimatePresence mode="wait">

        {status === "idle" && (
          <motion.div
            key="idle"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: "circOut" }}
            className="w-full max-w-3xl flex flex-col items-center gap-8 relative z-10"
          >
            <div className="text-center space-y-4">
              <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-white drop-shadow-2xl mb-2 py-2">
                Is your startup idea actually good?
              </h1>
              <p className="text-lg sm:text-xl text-white/60 w-full max-w-2xl mx-auto text-balance font-medium leading-relaxed">
                Stop wasting time building things nobody wants. Just type in your idea, upload a pitch deck, or drop a competitor&apos;s link. We&apos;ll search the internet to tell you who else is doing it, if there&apos;s real demand, and exactly what you need to do next.
              </p>
            </div>

            <div className="w-full p-[1px] rounded-[24px] bg-gradient-to-b from-white/20 to-white/5 relative group transition-all duration-500 hover:from-white/30 hover:to-white/10 shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-[24px]" />
              <div className="p-6 sm:p-8 bg-[#0a0a0a] rounded-[23px] relative flex flex-col">
                <Textarea
                  placeholder="Describe your startup idea... (e.g. A marketplace for renting out your dog's toys)"
                  className="min-h-[140px] text-lg bg-transparent border-none resize-none focus-visible:ring-0 px-0"
                  value={idea}
                  onChange={(e) => setIdea(e.target.value)}
                />

                {/* Embedded Actions */}
                <div className="flex flex-wrap items-center gap-2 mt-4">
                  <Button
                    size="icon"
                    variant={isRecording ? "destructive" : "secondary"}
                    className={`rounded-full shadow-lg ${isRecording ? 'animate-pulse' : ''}`}
                    onClick={toggleRecording}
                  >
                    {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                  </Button>
                  <div className="relative">
                    <Input
                      type="file"
                      accept=".pdf"
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      onChange={handleFileChange}
                    />
                    <Button size="icon" variant="secondary" className="rounded-full shadow-lg pointer-events-none">
                      <Upload className="w-4 h-4" />
                    </Button>
                  </div>
                  {pdfFile && (
                    <Badge variant="secondary" className="ml-2 h-10 flex items-center gap-2 px-3">
                      <FileText className="w-3 h-3" />
                      <span className="max-w-[100px] truncate">{pdfFile.name}</span>
                    </Badge>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row gap-4 justify-between items-center border-t border-border/50 pt-6 mt-6">
                  <Input
                    type="url"
                    placeholder="Or paste a competitor URL..."
                    className="bg-transparent border-dashed w-full sm:max-w-[350px]"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                  />

                  <Button
                    size="lg"
                    onClick={handleValidate}
                    disabled={!idea && !url}
                    className="w-full sm:w-auto font-bold tracking-wide transition-all duration-300 hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]"
                  >
                    Validate Reality
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {status === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -20 }}
            className="w-full max-w-lg flex flex-col items-center gap-8 relative"
          >
            <div className="absolute -inset-20 bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

            <div className="w-full space-y-4">
              <div className="flex justify-between text-sm font-mono text-muted-foreground mb-2">
                <span>SYSTEM.VALIDATE</span>
                <span>{step + 1} / {processingSteps.length}</span>
              </div>
              <Progress value={((step + 1) / processingSteps.length) * 100} className="h-2" />
            </div>

            <div className="w-full space-y-4 font-mono text-sm">
              {processingSteps.map((s, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{
                    opacity: index <= step ? 1 : 0.3,
                    x: index <= step ? 0 : -10,
                    color: index === step ? "#ffffff" : index < step ? "#666666" : "#333333"
                  }}
                  className="flex items-center gap-3"
                >
                  {index < step ? (
                    <TerminalSquare className="w-4 h-4 text-green-500" />
                  ) : index === step ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-4 h-4 rounded-sm border-2 border-primary border-t-transparent"
                    />
                  ) : (
                    <div className="w-4 h-4 rounded-sm border-2 border-muted" />
                  )}
                  {s.text}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {status === "results" && resultsData && (
          <div className="w-full max-w-5xl">
            <ResultsCard data={resultsData} />
            <div className="flex justify-center mt-12 mb-8">
              <Button
                onClick={() => {
                  setStatus("idle");
                  setIdea("");
                  setUrl("");
                }}
                variant="outline"
                className="rounded-full px-8 border-primary/20 hover:bg-primary/10"
              >
                Burn another idea
              </Button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
