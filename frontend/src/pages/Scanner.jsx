import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Upload as UploadIcon, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  HelpCircle, 
  FileText, 
  Bot, 
  RefreshCw, 
  ShieldAlert, 
  ArrowRight,
  Sun,
  Eye,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { scanProduct } from '../api';

export default function Scanner() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [showUnrecognized, setShowUnrecognized] = useState(false);
  const navigate = useNavigate();

  const onDrop = useCallback((accepted, rejected) => {
    setError('');
    if (rejected && rejected.length > 0) {
      setError('Please upload a valid image (JPEG, PNG, WEBP) under 10MB.');
      return;
    }
    if (!accepted.length) return;
    const f = accepted[0];
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024
  });

  const handleScan = async () => {
    if (!file || loading) return;
    setLoading(true);
    setLoadingStep(1);
    setError('');

    try {
      // Step 1: OCR Reading
      const stepTimer = setTimeout(() => {
        setLoadingStep(2);
      }, 900);

      const skinResult = JSON.parse(sessionStorage.getItem('skinResult') || 'null');
      const analysisId = skinResult?.analysis_id || null;

      const data = await scanProduct(file, analysisId);
      clearTimeout(stepTimer);
      setResult(data);
    } catch (err) {
      console.error('Scan error:', err);
      setError(err.response?.data?.detail || 'Could not process ingredient label. Please ensure text is legible and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAskAI = () => {
    if (!result) return;
    const contextPrompt = `I just scanned a skincare product label containing: ${result.extracted_ingredients.slice(0, 10).join(', ')}. The clinical scanner verdict is: "${result.analysis?.verdict_text}". Can you explain if this product is safe to use with my current skin routine?`;
    sessionStorage.setItem('pendingChatQuery', contextPrompt);
    navigate('/chat');
  };

  const handleReset = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError('');
  };

  const analysis = result?.analysis;
  const verdict = analysis?.verdict;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 lg:py-14 space-y-8">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-semibold mb-1 border border-brand-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>OCR Optical Ingredient Intelligence</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          Skincare Product Label Scanner
        </h1>
        <p className="text-slate-500 text-sm">
          Snap or upload a photo of any ingredient list to detect pore-cloggers, irritants, and skin-compatibility.
        </p>
      </div>

      {/* Upload Zone */}
      {!result && (
        <div className="bg-white rounded-2xl p-6 sm:p-10 shadow-card border border-slate-100 space-y-6">
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-brand-500 bg-brand-50/50'
                : preview
                ? 'border-brand-300 bg-slate-50/50'
                : 'border-slate-300 hover:border-brand-400 bg-slate-50/70 hover:bg-brand-50/20'
            }`}
          >
            <input {...getInputProps()} />

            {preview ? (
              <div className="space-y-4">
                <img
                  src={preview}
                  alt="Label Preview"
                  className="max-h-72 mx-auto rounded-xl object-cover shadow-md border-2 border-white ring-2 ring-brand-500/20"
                />
                <p className="text-xs text-brand-700 font-semibold flex items-center justify-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-brand-600" />
                  <span>Label photo ready: {file?.name}</span>
                </p>
                <p className="text-xs text-slate-400">Click or drop a different photo to change</p>
              </div>
            ) : (
              <div className="space-y-3 py-4">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 mx-auto flex items-center justify-center shadow-inner">
                  <FileText className="w-7 h-7 animate-pulse" />
                </div>
                <div>
                  <p className="text-sm sm:text-base font-semibold text-slate-800">
                    {isDragActive ? 'Drop your label photo here' : 'Drag & drop skincare ingredient label photo here, or browse'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Ensure the "Ingredients / INCI" list is flat, clearly lit, and in focus.
                  </p>
                </div>
              </div>
            )}
          </div>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* 2-Step Loading Indicator */}
          {loading && (
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                <span className="flex items-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-brand-600" />
                  {loadingStep === 1 ? 'Step 1 of 2: Extracting OCR Text...' : 'Step 2 of 2: Analyzing Actives & Comedogenic Ratings...'}
                </span>
                <span className="text-brand-600">{loadingStep === 1 ? '50%' : '90%'}</span>
              </div>
              <div className="h-2 w-full bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full transition-all duration-500"
                  style={{ width: loadingStep === 1 ? '50%' : '90%' }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3">
            {preview && (
              <button
                type="button"
                onClick={handleReset}
                className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-xs font-bold transition-colors"
              >
                Reset
              </button>
            )}
            <button
              onClick={handleScan}
              disabled={!file || loading}
              className="flex-1 bg-brand-500 hover:bg-brand-600 disabled:bg-slate-200 disabled:text-slate-400 text-white py-3.5 rounded-xl font-bold text-sm shadow-md shadow-brand-500/20 transition-all flex items-center justify-center gap-2"
            >
              {loading ? 'Analyzing Ingredients...' : 'Scan Product Formulation'}
            </button>
          </div>

          {/* Tips for Best OCR */}
          <div className="pt-2 grid sm:grid-cols-3 gap-3 text-xs text-slate-500">
            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Sun className="w-4 h-4 text-amber-500 flex-shrink-0" />
              <span>Good even lighting (no flash reflection)</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Eye className="w-4 h-4 text-sky-500 flex-shrink-0" />
              <span>Close-up crop of ingredient text only</span>
            </div>
            <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100">
              <Layers className="w-4 h-4 text-brand-500 flex-shrink-0" />
              <span>Flatten curved bottles or boxes</span>
            </div>
          </div>
        </div>
      )}

      {/* Analysis Results View */}
      {result && analysis && (
        <div className="space-y-6">
          {/* Action Bar */}
          <div className="flex items-center justify-between">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 px-3.5 py-2 rounded-xl shadow-2xs"
            >
              ← Scan Another Product
            </button>
            <button
              onClick={handleAskAI}
              className="inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl font-bold text-xs shadow-sm transition-all"
            >
              <Bot className="w-4 h-4 text-brand-400" />
              Ask AI About This Product
            </button>
          </div>

          {/* A. Full Width Verdict Banner */}
          <div
            className={`rounded-2xl p-6 border shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              verdict === 'good'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                : verdict === 'caution'
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-rose-50 border-rose-200 text-rose-900'
            }`}
          >
            <div className="flex items-start gap-3.5">
              {verdict === 'good' ? (
                <CheckCircle2 className="w-7 h-7 text-emerald-600 flex-shrink-0 mt-0.5" />
              ) : verdict === 'caution' ? (
                <AlertTriangle className="w-7 h-7 text-amber-600 flex-shrink-0 mt-0.5" />
              ) : (
                <XCircle className="w-7 h-7 text-rose-600 flex-shrink-0 mt-0.5" />
              )}
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider opacity-80">
                  Formulation Verdict
                </span>
                <h2 className="text-xl font-extrabold tracking-tight">
                  {verdict === 'good'
                    ? 'Compatible with Your Skin Profile'
                    : verdict === 'caution'
                    ? 'Use with Caution'
                    : 'Potential Flare-up Risk (Avoid)'}
                </h2>
                <p className="text-xs sm:text-sm mt-1 opacity-90 leading-relaxed">
                  {analysis.verdict_text}
                </p>
              </div>
            </div>

            <span
              className={`text-xs font-bold px-3 py-1.5 rounded-full uppercase tracking-wider flex-shrink-0 ${
                verdict === 'good'
                  ? 'bg-emerald-200/80 text-emerald-900'
                  : verdict === 'caution'
                  ? 'bg-amber-200/80 text-amber-900'
                  : 'bg-rose-200/80 text-rose-900'
              }`}
            >
              {verdict} match
            </span>
          </div>

          {/* B. Stats Row (3 Metric Cards) */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Detected</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                {analysis.total_ingredients_found}
              </p>
              <p className="text-[11px] text-slate-500">Extracted ingredients</p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Verified</span>
              <p className="text-2xl sm:text-3xl font-extrabold text-brand-600 mt-1">
                {analysis.total_matched}
              </p>
              <p className="text-[11px] text-slate-500">Database matched</p>
            </div>

            <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Flagged</span>
              <p className={`text-2xl sm:text-3xl font-extrabold mt-1 ${analysis.bad_ingredients.length > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                {analysis.bad_ingredients.length + analysis.comedogenic_flags.length}
              </p>
              <p className="text-[11px] text-slate-500">Concerns identified</p>
            </div>
          </div>

          {/* C. Three Columns of Ingredient Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Column 1: Good For You */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-emerald-200 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Good for You ({analysis.good_ingredients.length})</span>
              </div>

              {analysis.good_ingredients.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl">No active condition matches.</p>
              ) : (
                analysis.good_ingredients.map((ing, i) => (
                  <div key={i} className="bg-emerald-50/60 border border-emerald-200 rounded-xl p-3.5 space-y-1.5 shadow-2xs">
                    <p className="font-bold text-slate-900 text-xs sm:text-sm">{ing.name}</p>
                    <p className="text-xs text-slate-600">{ing.benefit}</p>
                    <span className="inline-block text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      {ing.why}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Column 2: Avoid / Conflicts */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-rose-200 text-rose-800 font-bold text-sm">
                <XCircle className="w-4 h-4 text-rose-600" />
                <span>Avoid / Caution ({analysis.bad_ingredients.length})</span>
              </div>

              {analysis.bad_ingredients.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl">Zero conflicting ingredients detected!</p>
              ) : (
                analysis.bad_ingredients.map((ing, i) => (
                  <div key={i} className="bg-rose-50/60 border border-rose-200 rounded-xl p-3.5 space-y-1.5 shadow-2xs">
                    <p className="font-bold text-slate-900 text-xs sm:text-sm">{ing.name}</p>
                    <p className="text-xs text-rose-700 font-medium">{ing.concern}</p>
                    <span className="inline-block text-[10px] font-bold text-rose-800 bg-rose-100 px-2 py-0.5 rounded-md">
                      {ing.why}
                    </span>
                  </div>
                ))
              )}
            </div>

            {/* Column 3: Neutral Base */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-200 text-slate-700 font-bold text-sm">
                <HelpCircle className="w-4 h-4 text-slate-400" />
                <span>Neutral Base ({analysis.neutral_ingredients.length})</span>
              </div>

              {analysis.neutral_ingredients.length === 0 ? (
                <p className="text-xs text-slate-400 italic p-3 bg-slate-50 rounded-xl">None identified.</p>
              ) : (
                analysis.neutral_ingredients.map((ing, i) => (
                  <div key={i} className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-1 shadow-2xs">
                    <p className="font-bold text-slate-800 text-xs">{ing.name}</p>
                    <p className="text-[11px] text-slate-500">{ing.benefit}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* D. Comedogenic Alert Section */}
          {analysis.comedogenic_flags?.length > 0 && (
            <div className="bg-amber-50/60 border border-amber-200 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                <ShieldAlert className="w-5 h-5 text-amber-600" />
                <span>Pore-Clogging (Comedogenic) Ingredients Detected</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-amber-200/80 text-amber-800">
                      <th className="pb-2 font-bold">Ingredient Name</th>
                      <th className="pb-2 font-bold">Comedogenic Score</th>
                      <th className="pb-2 font-bold">Clinical Concern</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-amber-100">
                    {analysis.comedogenic_flags.map((item, idx) => (
                      <tr key={idx} className="text-slate-800">
                        <td className="py-2.5 font-bold">{item.name}</td>
                        <td className="py-2.5">
                          <span className="font-bold text-rose-600">{item.rating}/5</span>
                          <span className="text-amber-500 ml-1">{'★'.repeat(item.rating)}</span>
                        </td>
                        <td className="py-2.5 text-slate-600">{item.concern}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* E. Unrecognized Ingredients Collapsible */}
          {analysis.unrecognized?.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <button
                onClick={() => setShowUnrecognized(!showUnrecognized)}
                className="w-full p-4 flex items-center justify-between text-xs font-bold text-slate-600 hover:bg-slate-50 transition-colors"
              >
                <span>{analysis.unrecognized.length} unrecognized cosmetic ingredients / stabilizers</span>
                {showUnrecognized ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </button>

              {showUnrecognized && (
                <div className="p-4 bg-slate-50 border-t border-slate-100 flex flex-wrap gap-1.5">
                  {analysis.unrecognized.map((item, idx) => (
                    <span key={idx} className="bg-white border border-slate-200 text-slate-600 text-xs px-2.5 py-1 rounded-md">
                      {item}
                    </span>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* F. Bottom AI Consultation CTA */}
          <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center text-white font-bold flex-shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base">Want advice on how to incorporate this?</h3>
                <p className="text-xs text-slate-400">Dr. Nova AI can guide your morning/night integration.</p>
              </div>
            </div>

            <button
              onClick={handleAskAI}
              className="bg-brand-500 hover:bg-brand-400 text-white px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm transition-all hover:scale-105 flex-shrink-0"
            >
              Ask Dr. Nova Now →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
