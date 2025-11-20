import React, { useState, useRef, useEffect } from 'react';
import { AnalysisStatus, DEFAULT_TOPIC, SectionContent } from './types';
import { generatePart1, generatePart2, generatePart3 } from './services/geminiService';
import MarkdownRenderer from './components/MarkdownRenderer';
import StatusIndicator from './components/StatusIndicator';
import { BookOpen, Brain, PenTool, Sparkles, Printer, RefreshCw, AlertTriangle } from 'lucide-react';

const App: React.FC = () => {
  const [topic, setTopic] = useState(DEFAULT_TOPIC);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [content, setContent] = useState<SectionContent>({ part1: '', part2: '', part3: '' });
  const [error, setError] = useState<string | null>(null);
  
  const contentEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    contentEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (status !== AnalysisStatus.IDLE) {
        scrollToBottom();
    }
  }, [content]);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    
    setStatus(AnalysisStatus.GENERATING_PART_1);
    setContent({ part1: '', part2: '', part3: '' });
    setError(null);

    try {
      // Part 1
      const part1Result = await generatePart1(topic);
      setContent(prev => ({ ...prev, part1: part1Result }));
      
      // Part 2
      setStatus(AnalysisStatus.GENERATING_PART_2);
      const part2Result = await generatePart2(topic, part1Result);
      setContent(prev => ({ ...prev, part2: part2Result }));

      // Part 3
      setStatus(AnalysisStatus.GENERATING_PART_3);
      const part3Result = await generatePart3(topic, part2Result);
      setContent(prev => ({ ...prev, part3: part3Result }));

      setStatus(AnalysisStatus.COMPLETED);
    } catch (err) {
      setStatus(AnalysisStatus.ERROR);
      setError(err instanceof Error ? err.message : "An unknown error occurred during generation. Please check your API configuration.");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen flex bg-[#f0f2f5] font-sans print:bg-white">
      {/* Sidebar - Hidden on Print */}
      <aside className="w-80 bg-white border-r border-gray-200 flex-shrink-0 p-6 flex flex-col gap-6 h-screen sticky top-0 overflow-y-auto print:hidden shadow-sm z-10">
        <div className="flex items-center gap-3 text-accent">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Brain className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-ink tracking-tight">Math Master<br/><span className="text-sm font-normal text-gray-500">Deep Analysis</span></h1>
        </div>

        <div className="space-y-4">
            <div className="space-y-2">
                <label htmlFor="topic" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <PenTool className="w-4 h-4" /> 
                    Knowledge Point
                </label>
                <textarea 
                    id="topic"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className="w-full p-3 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-accent focus:border-transparent outline-none resize-none h-32 leading-relaxed shadow-inner bg-gray-50"
                    placeholder="Enter a math topic..."
                />
            </div>

            <button
                onClick={handleGenerate}
                disabled={status !== AnalysisStatus.IDLE && status !== AnalysisStatus.COMPLETED && status !== AnalysisStatus.ERROR}
                className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-all flex items-center justify-center gap-2 shadow-md ${
                    status !== AnalysisStatus.IDLE && status !== AnalysisStatus.COMPLETED && status !== AnalysisStatus.ERROR
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-accent hover:bg-blue-600 active:scale-[0.98]'
                }`}
            >
                {status === AnalysisStatus.IDLE || status === AnalysisStatus.COMPLETED || status === AnalysisStatus.ERROR ? (
                    <>
                        <Sparkles className="w-5 h-5" />
                        Start Analysis
                    </>
                ) : (
                    <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Generating...
                    </>
                )}
            </button>
        </div>

        <StatusIndicator status={status} />

        <div className="mt-auto pt-6 border-t border-gray-100 text-xs text-gray-400 leading-relaxed">
            <p>Powered by Gemini 2.5 Flash via Relay.</p>
            <p className="mt-1">Generates a 9-step Master Level analysis for educational research.</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 print:p-0 overflow-y-auto scroll-smooth">
        <div className="max-w-4xl mx-auto">
            
            {/* Header / Status Messages */}
            <div className="mb-8 print:hidden">
                {status === AnalysisStatus.IDLE && (
                    <div className="flex flex-col items-center justify-center py-20 text-center text-gray-400 bg-white rounded-2xl border border-dashed border-gray-300">
                        <BookOpen className="w-16 h-16 mb-4 text-gray-200" />
                        <h3 className="text-lg font-medium text-gray-600">Ready to Analyze</h3>
                        <p className="max-w-md mt-2">Enter a knowledge point on the left (e.g., "{DEFAULT_TOPIC}") and click Start.</p>
                    </div>
                )}

                {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-lg flex items-start gap-3 border border-red-100 mb-6">
                        <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                        <div>
                            <h3 className="font-medium">Analysis Failed</h3>
                            <p className="text-sm mt-1 opacity-90">{error}</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Report Content */}
            {(content.part1 || content.part2 || content.part3) && (
                <div className="bg-paper text-ink shadow-xl print:shadow-none print:border-none min-h-[29.7cm] p-12 rounded-xl border border-stone-100 relative">
                    {/* Print Button */}
                    <button 
                        onClick={handlePrint}
                        className="absolute top-8 right-8 p-2 text-gray-400 hover:text-ink hover:bg-stone-100 rounded-full transition-colors print:hidden"
                        title="Print Report"
                    >
                        <Printer className="w-6 h-6" />
                    </button>

                    {/* Report Header */}
                    <header className="border-b-4 border-double border-ink pb-6 mb-12 text-center">
                        <h1 className="text-4xl font-serif font-bold mb-4">{topic}</h1>
                        <p className="text-lg text-gray-600 font-serif italic">Master Level Educational Analysis Report</p>
                    </header>

                    <div className="space-y-12">
                        {content.part1 && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                                <MarkdownRenderer content={content.part1} />
                            </section>
                        )}
                        
                        {content.part2 && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 pt-8 border-t border-gray-100">
                                <MarkdownRenderer content={content.part2} />
                            </section>
                        )}

                        {content.part3 && (
                            <section className="animate-in fade-in slide-in-from-bottom-4 duration-700 pt-8 border-t border-gray-100">
                                <MarkdownRenderer content={content.part3} />
                            </section>
                        )}
                    </div>
                    
                    {/* Invisible element for scrolling */}
                    <div ref={contentEndRef} />

                    {/* Report Footer */}
                    <footer className="mt-20 pt-8 border-t border-stone-200 text-center text-stone-400 text-sm font-serif print:fixed print:bottom-0 print:w-full print:bg-white print:border-t-0">
                        Mathematical Education Research & Design Institute
                    </footer>
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default App;