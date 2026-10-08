import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Scan, 
  ShieldCheck, 
  Bot, 
  ArrowRight, 
  CheckCircle2, 
  Activity, 
  Layers, 
  Droplets,
  Sun,
  Moon,
  Sparkle,
  Award
} from 'lucide-react';

export default function Home() {
  const conditions = [
    { label: 'Acne & Breakouts', color: 'bg-rose-50 text-rose-700 border-rose-200' },
    { label: 'Oily & Sebum Balance', color: 'bg-amber-50 text-amber-700 border-amber-200' },
    { label: 'Dryness & Barrier', color: 'bg-sky-50 text-sky-700 border-sky-200' },
    { label: 'Enlarged Open Pores', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
    { label: 'Hyperpigmentation', color: 'bg-purple-50 text-purple-700 border-purple-200' },
    { label: 'Balanced & Normal', color: 'bg-teal-50 text-teal-700 border-teal-200' },
  ];

  const features = [
    {
      icon: Activity,
      title: 'Clinical AI Vision Detection',
      desc: 'Powered by EfficientNet-B0 and MediaPipe face tracking to classify 6 skin conditions and determine accurate severity levels.',
      badge: 'Deep Learning'
    },
    {
      icon: Layers,
      title: 'Precision AM & PM Routines',
      desc: 'Get science-backed ingredient formulations with exact morning and nighttime regimens tailored to your specific skin type.',
      badge: 'Dermatologist Formulated'
    },
    {
      icon: Bot,
      title: 'Dr. Nova Skincare AI Chat',
      desc: 'Ask questions anytime. Our Gemini-powered assistant uses your real skin analysis context to guide product choices and safe actives.',
      badge: '24/7 AI Guidance'
    }
  ];

  const steps = [
    {
      step: '01',
      title: 'Upload Face Photo',
      desc: 'Take or upload a clear, well-lit photo of your face with our secure drag-and-drop tool.'
    },
    {
      step: '02',
      title: 'Deep AI Diagnostic',
      desc: 'Our neural network automatically crops the face and scores all conditions with confidence percentages.'
    },
    {
      step: '03',
      title: 'Get Routine & Consult',
      desc: 'Receive your morning & night regimen, active ingredients to use and avoid, and chat with AI.'
    }
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28">
        {/* Subtle Background Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-200/40 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute top-10 right-10 w-[300px] h-[300px] bg-sky-200/30 rounded-full blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Copy & Actions */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 bg-brand-50 border border-brand-200/80 px-3.5 py-1.5 rounded-full text-xs font-semibold text-brand-700 shadow-sm">
                <Sparkle className="w-3.5 h-3.5 text-brand-600 fill-brand-500" />
                <span>Next-Gen Dermatology AI • 94.2% Diagnostic Accuracy</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.12]">
                Unlock Healthier Skin with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-teal-500">
                  Precision AI Analysis
                </span>
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 font-normal leading-relaxed">
                Scan your face to detect acne, oiliness, dryness, open pores, and pigmentation. Get customized AM/PM regimens and 24/7 AI dermatologist guidance.
              </p>

              {/* CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  to="/upload"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white px-8 py-4 rounded-xl font-semibold text-base shadow-lg shadow-brand-500/30 hover:shadow-brand-500/40 hover:-translate-y-0.5 transition-all"
                >
                  <Scan className="w-5 h-5" />
                  Start Free Skin Scan
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <Link
                  to="/chat"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-6 py-4 rounded-xl font-semibold text-base shadow-sm hover:border-slate-300 transition-all"
                >
                  <Bot className="w-5 h-5 text-brand-500" />
                  Ask AI Assistant
                </Link>
              </div>

              {/* Trust Badges */}
              <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-brand-600" />
                  <span>100% Private & Encrypted</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  <span>Instant 6-Condition Breakdown</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-brand-600" />
                  <span>No Account Required</span>
                </div>
              </div>
            </div>

            {/* Right Column: Sample Analysis Card Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-white rounded-2xl p-6 shadow-card border border-slate-100 hover:shadow-card-hover transition-shadow">
                
                {/* Header preview */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-500 to-emerald-300 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      89%
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">Skin Health Report</h3>
                      <p className="text-xs text-slate-500">Combination / Oily-Leaning</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700">
                    Mild Severity
                  </span>
                </div>

                {/* Score bars sample */}
                <div className="py-4 space-y-3">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">Oily Skin Sebum</span>
                      <span className="text-brand-600 font-bold">78.4%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full w-[78%]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">Open Pores</span>
                      <span className="text-brand-600 font-bold">64.2%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-teal-500 rounded-full w-[64%]" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span className="text-slate-700">Acne Sensitivity</span>
                      <span className="text-slate-500 font-bold">22.1%</span>
                    </div>
                    <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-rose-400 rounded-full w-[22%]" />
                    </div>
                  </div>
                </div>

                {/* AM/PM preview */}
                <div className="grid grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="bg-amber-50/70 border border-amber-100 p-3 rounded-xl">
                    <div className="flex items-center gap-1.5 font-bold text-amber-800 mb-1">
                      <Sun className="w-3.5 h-3.5 text-amber-600" />
                      Morning Step
                    </div>
                    <p className="text-slate-600 text-[11px] line-clamp-2">
                      Niacinamide + Matte SPF 50
                    </p>
                  </div>

                  <div className="bg-sky-50/70 border border-sky-100 p-3 rounded-xl">
                    <div className="flex items-center gap-1.5 font-bold text-sky-800 mb-1">
                      <Moon className="w-3.5 h-3.5 text-sky-600" />
                      Night Step
                    </div>
                    <p className="text-slate-600 text-[11px] line-clamp-2">
                      BHA Salicylic Gel + Hydrator
                    </p>
                  </div>
                </div>

                {/* Live Pill */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    Live ML Diagnostics Ready
                  </span>
                  <span className="font-semibold text-brand-600">Sample Preview</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Conditions Section */}
      <section className="py-12 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-8">
            <h2 className="text-xs uppercase tracking-widest font-bold text-brand-600 mb-2">
              Comprehensive Coverage
            </h2>
            <p className="text-2xl font-bold text-slate-900">
              Detects and Analyzes 6 Core Skin Conditions
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {conditions.map((c, i) => (
              <div
                key={i}
                className={`border rounded-xl p-3.5 text-center font-semibold text-xs transition-all hover:scale-105 shadow-sm ${c.color}`}
              >
                {c.label}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-[#f8fafc]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest font-bold text-brand-600 mb-2">
              Engineered for Results
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              Everything You Need for Clinical Skincare Clarity
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="bg-white rounded-2xl p-8 border border-slate-100 shadow-card hover:shadow-card-hover transition-all group hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center group-hover:bg-brand-500 group-hover:text-white transition-colors shadow-sm">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full">
                      {feat.badge}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {feat.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs uppercase tracking-widest font-bold text-brand-600 mb-2">
              Simple 3-Step Process
            </h2>
            <p className="text-3xl font-extrabold text-slate-900 sm:text-4xl">
              From Photo to Personalized Plan in Seconds
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 relative">
            {steps.map((st, i) => (
              <div
                key={i}
                className="relative bg-slate-50/70 border border-slate-200/70 rounded-2xl p-8 hover:bg-white hover:border-brand-300 transition-all hover:shadow-card"
              >
                <span className="text-4xl font-extrabold text-brand-200 block mb-4">
                  {st.step}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  {st.title}
                </h3>
                <p className="text-slate-600 text-sm leading-relaxed">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>

          {/* CTA Banner */}
          <div className="mt-16 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 text-white rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-xl">
            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <h3 className="text-2xl sm:text-3xl font-bold">
                Ready to understand your skin's true profile?
              </h3>
              <p className="text-slate-300 text-sm sm:text-base">
                Take your scan now for instant condition scores, targeted active ingredients, and personalized morning & evening routines.
              </p>
              <div>
                <Link
                  to="/upload"
                  className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-400 text-white px-8 py-4 rounded-xl font-bold text-base shadow-lg shadow-brand-500/25 transition-all hover:scale-105"
                >
                  <Scan className="w-5 h-5" />
                  Analyze My Skin Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="text-white font-bold text-lg">
              Derm<span className="text-brand-400">AI</span>
            </span>
          </div>

          <p className="text-xs text-slate-500 text-center max-w-md">
            Medical Disclaimer: DermAI is an educational and cosmetic recommendation tool and does not provide medical diagnosis. Always consult a licensed board-certified dermatologist for clinical skin conditions.
          </p>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} DermAI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
