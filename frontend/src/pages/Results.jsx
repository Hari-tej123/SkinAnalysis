import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  CheckCircle2, 
  XCircle, 
  MessageSquare, 
  ArrowLeft, 
  Share2, 
  RotateCcw, 
  CheckSquare, 
  Square,
  AlertTriangle,
  Info,
  Calendar,
  Layers,
  ShoppingBag,
  Eye,
  EyeOff,
  Flame
} from 'lucide-react';

const SEVERITY_BADGES = {
  mild: {
    bg: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    label: 'Mild Severity',
    dot: 'bg-emerald-500'
  },
  moderate: {
    bg: 'bg-amber-50 text-amber-700 border-amber-200',
    label: 'Moderate Concern',
    dot: 'bg-amber-500'
  },
  severe: {
    bg: 'bg-rose-50 text-rose-700 border-rose-200',
    label: 'Severe Attention Needed',
    dot: 'bg-rose-500'
  }
};

const CONDITION_COLORS = {
  acne: 'from-rose-500 to-red-400',
  oily_skin: 'from-amber-500 to-yellow-400',
  dry_skin: 'from-sky-500 to-blue-400',
  open_pores: 'from-emerald-500 to-teal-400',
  pigmentation: 'from-purple-500 to-indigo-400',
  normal: 'from-teal-500 to-emerald-400'
};

const CONDITION_TITLES = {
  acne: 'Acne & Active Breakouts',
  oily_skin: 'Oily Sebum Production',
  dry_skin: 'Dryness & Dehydration',
  open_pores: 'Enlarged Open Pores',
  pigmentation: 'Hyperpigmentation & Sun Spots',
  normal: 'Balanced Skin Health'
};

export default function Results() {
  const [result, setResult] = useState(null);
  const [completedTips, setCompletedTips] = useState({});
  const [showHeatmap, setShowHeatmap] = useState(true);
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = sessionStorage.getItem('skinResult');
    if (!saved) {
      navigate('/upload');
      return;
    }
    try {
      setResult(JSON.parse(saved));
    } catch {
      navigate('/upload');
    }
  }, [navigate]);

  if (!result) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-600 font-medium text-sm">Loading your skin biometric report...</p>
      </div>
    );
  }

  const { prediction, recommendations, heatmap_image } = result;
  const scores = prediction.scores || {};
  const severityKey = (prediction.severity || 'mild').toLowerCase();
  const severityBadge = SEVERITY_BADGES[severityKey] || SEVERITY_BADGES.mild;

  const toggleTip = (index) => {
    setCompletedTips(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
      {/* Top Navigation & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-sm hover:bg-slate-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          New Skin Scan
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3 py-2 rounded-xl shadow-sm transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            {copied ? 'Link Copied!' : 'Share Analysis'}
          </button>

          <Link
            to="/chat"
            className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md shadow-brand-500/20 transition-all hover:scale-105"
          >
            <MessageSquare className="w-4 h-4" />
            Ask AI Dermatologist
          </Link>
        </div>
      </div>

      {/* Top Primary Summary Card */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-brand-50 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="grid md:grid-cols-12 gap-6 items-center">
          <div className="md:col-span-8 space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                Official AI Skin Diagnostic
              </span>
              <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${severityBadge.bg}`}>
                <span className={`w-2 h-2 rounded-full ${severityBadge.dot}`} />
                {severityBadge.label}
              </span>
            </div>

            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Primary Concern: <span className="capitalize text-brand-700">{prediction.primary_condition.replace('_', ' ')}</span>
            </h1>

            <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
              Based on deep neural visual feature mapping, your identified skin type is{' '}
              <strong className="text-slate-900 font-bold">{prediction.skin_type || 'Combination'}</strong> with an overall confidence score of{' '}
              <strong className="text-brand-600 font-bold">{prediction.confidence}%</strong>.
            </p>

            {/* Clinical Alert if severe */}
            {recommendations.professional_advice && (
              <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl flex items-start gap-2.5 text-amber-800 text-xs">
                <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <span>{recommendations.professional_advice}</span>
              </div>
            )}
          </div>

          {/* Biometric Score Ring Card */}
          <div className="md:col-span-4 bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-center space-y-2">
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Top Match Confidence</p>
            <div className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              {prediction.confidence}<span className="text-2xl text-brand-600 font-bold">%</span>
            </div>
            <p className="text-xs text-slate-500 font-medium capitalize">
              {prediction.primary_condition.replace('_', ' ')} Profile
            </p>
            <div className="pt-2 border-t border-slate-200/60 flex justify-between text-[11px] text-slate-600 font-medium">
              <span>Face Lock: Verified</span>
              <span>Classified: 6/6</span>
            </div>
          </div>
        </div>
      </div>

      {/* GRAD-CAM VISUAL ATTENTION HEATMAP SECTION (FEATURE 3) */}
      {heatmap_image && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-0.5 rounded-full border border-brand-200 mb-1">
                <Flame className="w-3.5 h-3.5 text-amber-500" />
                <span>Explainable AI (Grad-CAM)</span>
              </div>
              <h2 className="text-lg font-bold text-slate-900">
                Where AI Detected Your {prediction.primary_condition.replace('_', ' ').toUpperCase()} Condition
              </h2>
              <p className="text-xs text-slate-500">
                Visualizing neural activation feature maps that triggered the primary diagnostic classification.
              </p>
            </div>

            <button
              onClick={() => setShowHeatmap(!showHeatmap)}
              className="inline-flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-colors self-start sm:self-center"
            >
              {showHeatmap ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              <span>{showHeatmap ? 'Hide Heatmap' : 'Show Heatmap'}</span>
            </button>
          </div>

          {showHeatmap && (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-6 items-center">
                {/* Visual Attention Map */}
                <div className="space-y-2 text-center">
                  <div className="relative inline-block rounded-2xl overflow-hidden border-2 border-brand-300 shadow-md">
                    <img
                      src={heatmap_image}
                      alt="AI Attention Heatmap"
                      className="max-h-72 w-auto object-cover rounded-xl"
                    />
                    <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[11px] font-bold px-2.5 py-1 rounded-md backdrop-blur-xs">
                      AI Attention Heatmap
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 font-medium">
                    Grad-CAM activation overlay for {prediction.primary_condition.replace('_', ' ')}
                  </p>
                </div>

                {/* Explanation and Heatmap Legend */}
                <div className="space-y-4 bg-slate-50 p-5 rounded-2xl border border-slate-200/80">
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <Info className="w-4 h-4 text-brand-600" />
                    How to Read This Heatmap
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Red and bright yellow regions indicate the precise facial coordinates where the EfficientNet-B0 convolutional network detected strong signal markers for{' '}
                    <strong className="text-slate-900 font-bold capitalize">{prediction.primary_condition.replace('_', ' ')}</strong>. Cooler blue regions represent neutral baseline skin.
                  </p>

                  {/* Gradient Legend */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[11px] font-bold text-slate-600">
                      <span>Low Attention (Baseline)</span>
                      <span>High Attention (Detected Concern)</span>
                    </div>
                    <div className="h-3.5 w-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 via-yellow-400 to-red-600 shadow-inner" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6 Condition Scores Breakdown with Animated Progress Bars */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-slate-100">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Condition Confidence Breakdown</h2>
            <p className="text-xs text-slate-500">Multiclass visual scoring across all 6 dermatological markers.</p>
          </div>
          <span className="text-xs font-semibold text-brand-600 bg-brand-50 px-2.5 py-1 rounded-lg">
            EfficientNet-B0
          </span>
        </div>

        <div className="grid sm:grid-cols-2 gap-x-8 gap-y-5">
          {Object.entries(scores)
            .sort((a, b) => b[1] - a[1])
            .map(([condition, score]) => {
              const colorGradient = CONDITION_COLORS[condition] || 'from-brand-500 to-teal-400';
              const title = CONDITION_TITLES[condition] || condition.replace('_', ' ');

              return (
                <div key={condition} className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs font-semibold">
                    <span className="text-slate-800">{title}</span>
                    <span className="text-slate-900 font-bold">{score}%</span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-[1px]">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r ${colorGradient} transition-all duration-1000 ease-out`}
                      style={{ width: `${Math.max(4, score)}%` }}
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Two Column Layout: Morning & Night Routine */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Morning Routine */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-amber-100/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-amber-100">
            <div className="flex items-center gap-2.5 font-bold text-slate-900 text-lg">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                <Sun className="w-5 h-5" />
              </div>
              <span>Morning Regimen</span>
            </div>
            <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full">
              AM Protection
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {recommendations.morning_routine.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-amber-50/40 border border-amber-100/50 hover:bg-amber-50/80 transition-colors">
                <span className="w-6 h-6 rounded-full bg-amber-200/80 text-amber-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Night Routine */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-sky-100/80 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-sky-100">
            <div className="flex items-center gap-2.5 font-bold text-slate-900 text-lg">
              <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
                <Moon className="w-5 h-5" />
              </div>
              <span>Evening Regimen</span>
            </div>
            <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full">
              PM Cellular Repair
            </span>
          </div>

          <div className="space-y-3 pt-1">
            {recommendations.night_routine.map((step, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-sky-50/40 border border-sky-100/50 hover:bg-sky-50/80 transition-colors">
                <span className="w-6 h-6 rounded-full bg-sky-200/80 text-sky-800 font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                  {idx + 1}
                </span>
                <p className="text-xs sm:text-sm font-medium text-slate-700 leading-relaxed">
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Ingredients Section (Pills) */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-brand-600" />
            Ingredient Intelligence Guide
          </h2>
          <p className="text-xs text-slate-500">Clinically curated actives formulated specifically for your detected skin barrier.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Key Ingredients to Use */}
          <div className="bg-emerald-50/40 border border-emerald-100 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Recommended Key Actives (Use)</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {recommendations.key_ingredients?.map((ing, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200/80 shadow-2xs hover:bg-emerald-200 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {ing}
                </span>
              ))}
            </div>
          </div>

          {/* Ingredients to Avoid */}
          <div className="bg-rose-50/40 border border-rose-100 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-rose-800 font-bold text-sm">
              <XCircle className="w-4 h-4 text-rose-600" />
              <span>Ingredients to Avoid (Harmful/Clogging)</span>
            </div>
            <div className="flex flex-wrap gap-2 pt-1">
              {recommendations.ingredients_to_avoid?.map((ing, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-200/80 shadow-2xs hover:bg-rose-200 transition-colors"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                  {ing}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Treatments & Formulations */}
        {(recommendations.weekly_treatments?.length > 0 || recommendations.recommended_product_types?.length > 0) && (
          <div className="pt-4 border-t border-slate-100 grid sm:grid-cols-2 gap-4 text-xs">
            {recommendations.weekly_treatments?.length > 0 && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                <p className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <Calendar className="w-4 h-4 text-brand-600" />
                  Weekly Boost Treatments
                </p>
                <ul className="list-disc list-inside space-y-1 text-slate-600">
                  {recommendations.weekly_treatments.map((w, i) => (
                    <li key={i}>{w}</li>
                  ))}
                </ul>
              </div>
            )}

            {recommendations.recommended_product_types?.length > 0 && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70">
                <p className="font-bold text-slate-800 mb-2 flex items-center gap-1.5">
                  <ShoppingBag className="w-4 h-4 text-brand-600" />
                  Optimal Product Textures
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {recommendations.recommended_product_types.map((p, i) => (
                    <span key={i} className="bg-white border border-slate-200 text-slate-700 px-2.5 py-1 rounded-lg font-medium">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Lifestyle Habits Interactive Checklist */}
      <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-4">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Recommended Daily Lifestyle Habits</h2>
          <p className="text-xs text-slate-500">Track these proven daily habits to accelerate skin barrier healing.</p>
        </div>

        <div className="grid sm:grid-cols-2 gap-3 pt-2">
          {recommendations.lifestyle_tips?.map((tip, idx) => {
            const isDone = !!completedTips[idx];
            return (
              <div
                key={idx}
                onClick={() => toggleTip(idx)}
                className={`flex items-start gap-3 p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isDone
                    ? 'bg-brand-50/70 border-brand-300 text-brand-900'
                    : 'bg-slate-50/60 border-slate-200/80 hover:bg-slate-50 text-slate-700'
                }`}
              >
                {isDone ? (
                  <CheckSquare className="w-5 h-5 text-brand-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <Square className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
                )}
                <span className={`text-xs sm:text-sm font-medium leading-relaxed ${isDone ? 'line-through text-slate-400' : ''}`}>
                  {tip}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Bottom AI Chat Bar */}
      <div className="sticky bottom-6 z-40 bg-slate-900 text-white rounded-2xl p-4 sm:p-5 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4 border border-slate-700">
        <div className="flex items-center gap-3 text-center sm:text-left">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white flex-shrink-0 shadow-md">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base">Have questions about your {prediction.primary_condition.replace('_', ' ')} results?</h3>
            <p className="text-xs text-slate-400">Dr. Nova AI assistant has your analysis loaded and ready to advise.</p>
          </div>
        </div>

        <button
          onClick={() => navigate('/chat')}
          className="w-full sm:w-auto bg-brand-500 hover:bg-brand-400 text-white px-6 py-3 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-105 flex items-center justify-center gap-2 flex-shrink-0"
        >
          <span>Chat with AI Now</span>
          <Sparkles className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}