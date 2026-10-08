import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  History as HistoryIcon, 
  Sparkles, 
  Calendar, 
  ChevronRight, 
  ChevronDown, 
  TrendingUp, 
  Trash2, 
  Scan, 
  AlertCircle,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';
import { getHistory, deleteAnalysis } from '../api';

const SEVERITY_BADGES = {
  mild: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  moderate: 'bg-amber-50 text-amber-700 border-amber-200',
  severe: 'bg-rose-50 text-rose-700 border-rose-200'
};

export default function History() {
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const data = await getHistory(0, 30);
      setHistoryList(data || []);
      setError('');
    } catch (err) {
      console.error('History fetch error:', err);
      setError('Could not load past scan records. Backend might still be starting.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!window.confirm('Delete this skin analysis record?')) return;
    try {
      await deleteAnalysis(id);
      setHistoryList(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      console.error('Delete error:', err);
      alert('Failed to delete analysis record.');
    }
  };

  const handleOpenReport = (item) => {
    const payload = {
      analysis_id: item.id,
      prediction: {
        primary_condition: item.primary_condition,
        severity: item.severity,
        skin_type: item.skin_type,
        confidence: item.confidence,
        scores: item.scores
      },
      recommendations: item.recommendations
    };
    sessionStorage.setItem('skinResult', JSON.stringify(payload));
    navigate('/results');
  };

  // Prepare chart dataset (chronological order)
  const chartData = [...historyList]
    .reverse()
    .map((item, idx) => {
      const d = item.created_at ? new Date(item.created_at) : new Date();
      const dateLabel = `${d.getMonth() + 1}/${d.getDate()}`;
      const scores = item.scores || {};
      return {
        name: `#${item.id} (${dateLabel})`,
        Acne: scores.acne || 0,
        Oily: scores.oily_skin || 0,
        Dry: scores.dry_skin || 0,
        Pores: scores.open_pores || 0,
        Pigment: scores.pigmentation || 0,
        Normal: scores.normal || 0
      };
    });

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-semibold mb-2 border border-brand-200">
            <HistoryIcon className="w-3.5 h-3.5" />
            <span>Progress Tracking</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Skin Diagnostic History
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track condition score trends, past routines, and barrier improvements over time.
          </p>
        </div>

        <Link
          to="/upload"
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-brand-500/20 transition-all hover:-translate-y-0.5"
        >
          <Scan className="w-4 h-4" />
          New Skin Scan
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Recharts Analytics Line Chart */}
      {chartData.length > 1 && (
        <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-600" />
                Condition Progress Trends Over Time
              </h2>
              <p className="text-xs text-slate-500">Track how your skin metrics evolve across diagnostic scans.</p>
            </div>
            <span className="text-xs font-semibold bg-brand-50 text-brand-700 px-2.5 py-1 rounded-lg">
              {chartData.length} Scans Tracked
            </span>
          </div>

          <div className="h-64 sm:h-80 w-full pt-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} />
                <YAxis stroke="#94a3b8" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#ffffff',
                    borderRadius: '12px',
                    boxShadow: '0 10px 25px rgba(0,0,0,0.08)',
                    border: '1px solid #e2e8f0',
                    fontSize: '12px'
                  }}
                />
                <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                <Line type="monotone" dataKey="Acne" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Oily" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Dry" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Pores" stroke="#10b981" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Pigment" stroke="#8b5cf6" strokeWidth={2.5} dot={{ r: 3 }} />
                <Line type="monotone" dataKey="Normal" stroke="#14b8a6" strokeWidth={2.5} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* History Items List */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Recorded Skin Analyses</h2>

        {loading ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-card border border-slate-100 space-y-3">
            <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-slate-500 font-medium">Fetching previous analysis history...</p>
          </div>
        ) : historyList.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center shadow-card border border-slate-100 space-y-4 max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
              <HistoryIcon className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-lg">No Previous Scans Found</h3>
              <p className="text-xs text-slate-500 mt-1">
                Upload your first face photo to start tracking skin conditions and personalized routines.
              </p>
            </div>
            <div>
              <Link
                to="/upload"
                className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-brand-500/20"
              >
                <Scan className="w-4 h-4" />
                Upload First Scan
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            {historyList.map((item) => {
              const isExpanded = expandedId === item.id;
              const d = item.created_at ? new Date(item.created_at) : new Date();
              const dateStr = d.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });
              const severityKey = (item.severity || 'mild').toLowerCase();
              const badgeClass = SEVERITY_BADGES[severityKey] || SEVERITY_BADGES.mild;

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover transition-all overflow-hidden"
                >
                  {/* Item Row Header */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : item.id)}
                    className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 cursor-pointer hover:bg-slate-50/60 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-extrabold text-sm shadow-2xs">
                        #{item.id}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-bold text-slate-900 text-base capitalize">
                            {item.primary_condition?.replace('_', ' ')}
                          </h3>
                          <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${badgeClass}`}>
                            {item.severity}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            {dateStr}
                          </span>
                          <span>•</span>
                          <span>Type: <strong className="text-slate-700">{item.skin_type || 'Normal'}</strong></span>
                          <span>•</span>
                          <span className="text-brand-600 font-bold">{item.confidence}% Match</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end sm:self-center">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleOpenReport(item);
                        }}
                        className="text-xs font-bold text-brand-600 hover:text-brand-700 bg-brand-50 hover:bg-brand-100 border border-brand-200 px-3.5 py-1.5 rounded-xl transition-colors"
                      >
                        Full Report
                      </button>

                      <button
                        onClick={(e) => handleDelete(e, item.id)}
                        className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-rose-50 transition-colors"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="text-slate-400 pl-1">
                        {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details Accordion */}
                  {isExpanded && (
                    <div className="p-5 bg-slate-50/70 border-t border-slate-100 space-y-4">
                      {/* Score Breakdown Bars */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                          Score Breakdown
                        </h4>
                        <div className="grid sm:grid-cols-3 gap-3 text-xs">
                          {Object.entries(item.scores || {}).map(([cond, sc]) => (
                            <div key={cond} className="bg-white p-3 rounded-xl border border-slate-200/70 space-y-1">
                              <div className="flex justify-between font-semibold">
                                <span className="capitalize text-slate-700">{cond.replace('_', ' ')}</span>
                                <span className="text-brand-600 font-bold">{sc}%</span>
                              </div>
                              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div className="h-full bg-brand-500 rounded-full" style={{ width: `${sc}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Key Ingredients */}
                      {item.recommendations?.key_ingredients && (
                        <div>
                          <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                            Target Active Ingredients
                          </h4>
                          <div className="flex flex-wrap gap-1.5">
                            {item.recommendations.key_ingredients.map((ing, i) => (
                              <span key={i} className="text-xs bg-white text-emerald-800 border border-emerald-200 px-2.5 py-1 rounded-md font-medium">
                                {ing}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
