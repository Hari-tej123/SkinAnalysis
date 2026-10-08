import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  Sparkles, 
  Calendar, 
  ArrowUpRight, 
  ArrowDownRight, 
  Award, 
  Activity, 
  CheckCircle2, 
  AlertCircle, 
  Scan, 
  ChevronRight, 
  ChevronDown,
  Layers,
  Clock
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
import { getProgress } from '../api';

export default function Progress() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeLines, setActiveLines] = useState({
    healthScore: true,
    acne: true,
    oily: false,
    dry: false,
    pores: false,
    pigment: false
  });
  const [expandedCheckinId, setExpandedCheckinId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    setLoading(true);
    try {
      const res = await getProgress();
      setData(res);
    } catch (err) {
      console.error('Progress fetch error:', err);
      setError('Could not load weekly progress records.');
    } finally {
      setLoading(false);
    }
  };

  const toggleLine = (key) => {
    setActiveLines(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const checkins = data?.checkins || [];

  // Chart data formatting
  const chartData = checkins.map((c) => {
    const s = c.scores || {};
    return {
      name: c.week_label,
      "Skin Health Score": c.skin_health_score,
      "Acne": s.acne || 0,
      "Oily Skin": s.oily_skin || 0,
      "Dry Skin": s.dry_skin || 0,
      "Open Pores": s.open_pores || 0,
      "Pigmentation": s.pigmentation || 0
    };
  });

  const earliestCheckin = checkins.length > 0 ? checkins[0] : null;
  const latestCheckin = checkins.length > 0 ? checkins[checkins.length - 1] : null;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-semibold mb-2 border border-brand-200">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Weekly Longitudinal Analytics</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Skin Progress & Recovery Hub
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Track your barrier health score, weekly check-in trends, and before-and-after improvements.
          </p>
        </div>

        <Link
          to="/upload?checkin=true"
          className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-md shadow-brand-500/20 transition-all hover:-translate-y-0.5"
        >
          <Scan className="w-4 h-4" />
          Log Weekly Check-in
        </Link>
      </div>

      {/* Weekly Check-in Banner Prompt */}
      <div className="bg-gradient-to-r from-brand-600 to-teal-600 text-white rounded-2xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5 text-center sm:text-left">
          <div className="w-12 h-12 rounded-xl bg-white/15 backdrop-blur-md flex items-center justify-center text-white flex-shrink-0">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-base sm:text-lg">Time for your weekly skin diagnostic!</h3>
            <p className="text-xs sm:text-sm text-brand-100">
              Maintain consistent weekly logs to visualize active ingredient efficacy and barrier recovery.
            </p>
          </div>
        </div>
        <Link
          to="/upload?checkin=true"
          className="bg-white text-brand-700 hover:bg-brand-50 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all hover:scale-105 flex-shrink-0"
        >
          Check In Now →
        </Link>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="bg-white rounded-2xl p-16 text-center shadow-card border border-slate-100 space-y-3">
          <div className="w-8 h-8 border-3 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500 font-medium">Computing longitudinal progress analytics...</p>
        </div>
      ) : checkins.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center shadow-card border border-slate-100 space-y-4 max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center mx-auto">
            <Activity className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-lg">No Weekly Check-ins Yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Complete your first weekly check-in scan to unlock your personalized Skin Health Score and progress charts.
            </p>
          </div>
          <div>
            <Link
              to="/upload?checkin=true"
              className="inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-600 text-white px-6 py-3 rounded-xl font-bold text-xs shadow-md shadow-brand-500/20"
            >
              <Scan className="w-4 h-4" />
              Log Your First Week
            </Link>
          </div>
        </div>
      ) : (
        <>
          {/* Top 4 Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Current Score */}
            <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Current Skin Health</p>
              <div className="text-3xl sm:text-4xl font-extrabold text-brand-600 tracking-tight">
                {data.current_score}<span className="text-xl text-slate-400 font-bold">/100</span>
              </div>
              <p className="text-xs text-slate-500 pt-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-brand-500" />
                Latest assessment score
              </p>
            </div>

            {/* Card 2: Total Improvement */}
            <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Improvement</p>
              <div className="flex items-center gap-1 text-3xl sm:text-4xl font-extrabold tracking-tight">
                <span className={data.total_improvement >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                  {data.total_improvement >= 0 ? `+${data.total_improvement}` : data.total_improvement}
                </span>
                <span className="text-base text-slate-400 font-medium">pts</span>
              </div>
              <p className="text-xs text-slate-500 pt-1 flex items-center gap-1">
                {data.total_improvement >= 0 ? (
                  <ArrowUpRight className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <ArrowDownRight className="w-3.5 h-3.5 text-rose-600" />
                )}
                <span>Since baseline week</span>
              </p>
            </div>

            {/* Card 3: Weeks Tracked */}
            <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Weeks Logged</p>
              <div className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {data.weeks_tracked} <span className="text-xl text-slate-400 font-bold">wks</span>
              </div>
              <p className="text-xs text-slate-500 pt-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Active adherence history</span>
              </p>
            </div>

            {/* Card 4: Best Condition Trend */}
            <div className="bg-white rounded-2xl p-5 shadow-card border border-slate-100 space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Status Highlight</p>
              <div className="text-lg sm:text-xl font-extrabold text-slate-900 tracking-tight truncate pt-1">
                {data.best_condition}
              </div>
              <p className="text-xs text-emerald-600 pt-1 font-semibold flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>Optimal response trajectory</span>
              </p>
            </div>
          </div>

          {/* Main Progress Chart */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Progress Trajectory Curve</h2>
                <p className="text-xs text-slate-500">Longitudinal recovery metrics across weekly intervals.</p>
              </div>

              {/* Line Toggles */}
              <div className="flex flex-wrap gap-2 text-xs">
                <button
                  onClick={() => toggleLine('healthScore')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all border ${
                    activeLines.healthScore
                      ? 'bg-brand-500 text-white border-brand-500 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Skin Health Score
                </button>
                <button
                  onClick={() => toggleLine('acne')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all border ${
                    activeLines.acne
                      ? 'bg-rose-500 text-white border-rose-500 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Acne
                </button>
                <button
                  onClick={() => toggleLine('oily')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all border ${
                    activeLines.oily
                      ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Oily
                </button>
                <button
                  onClick={() => toggleLine('pores')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all border ${
                    activeLines.pores
                      ? 'bg-teal-500 text-white border-teal-500 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Pores
                </button>
                <button
                  onClick={() => toggleLine('pigment')}
                  className={`px-3 py-1.5 rounded-lg font-bold transition-all border ${
                    activeLines.pigment
                      ? 'bg-purple-500 text-white border-purple-500 shadow-xs'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}
                >
                  Pigmentation
                </button>
              </div>
            </div>

            <div className="h-72 sm:h-96 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 20, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} />
                  <YAxis stroke="#94a3b8" fontSize={12} domain={[0, 100]} />
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
                  {activeLines.healthScore && (
                    <Line
                      type="monotone"
                      dataKey="Skin Health Score"
                      stroke="#10b981"
                      strokeWidth={3.5}
                      dot={{ r: 5, fill: '#10b981' }}
                    />
                  )}
                  {activeLines.acne && (
                    <Line type="monotone" dataKey="Acne" stroke="#f43f5e" strokeWidth={2} dot={{ r: 3 }} />
                  )}
                  {activeLines.oily && (
                    <Line type="monotone" dataKey="Oily Skin" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
                  )}
                  {activeLines.dry && (
                    <Line type="monotone" dataKey="Dry Skin" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} />
                  )}
                  {activeLines.pores && (
                    <Line type="monotone" dataKey="Open Pores" stroke="#14b8a6" strokeWidth={2} dot={{ r: 3 }} />
                  )}
                  {activeLines.pigment && (
                    <Line type="monotone" dataKey="Pigmentation" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Before & After Comparison Panel */}
          {earliestCheckin && latestCheckin && (
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Before & After Diagnostic Comparison</h2>
                  <p className="text-xs text-slate-500">Comparing your initial baseline against your latest check-in.</p>
                </div>
                <span className="text-xs font-bold text-brand-700 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
                  {data.weeks_tracked} Weeks Progression
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Left: Baseline */}
                <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Baseline Scan</span>
                      <h3 className="font-bold text-slate-900 text-base">{earliestCheckin.week_label}</h3>
                    </div>
                    <span className="text-lg font-extrabold text-slate-700">
                      {earliestCheckin.skin_health_score} <span className="text-xs text-slate-400 font-normal">pts</span>
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {Object.entries(earliestCheckin.scores || {}).map(([cond, score]) => (
                      <div key={cond} className="flex justify-between items-center text-slate-600">
                        <span className="capitalize">{cond.replace('_', ' ')}</span>
                        <span className="font-bold text-slate-800">{score}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right: Latest */}
                <div className="bg-emerald-50/40 border border-emerald-200 rounded-2xl p-5 space-y-4">
                  <div className="flex justify-between items-center pb-2 border-b border-emerald-200">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Latest Scan</span>
                      <h3 className="font-bold text-slate-900 text-base">{latestCheckin.week_label}</h3>
                    </div>
                    <span className="text-lg font-extrabold text-brand-600">
                      {latestCheckin.skin_health_score} <span className="text-xs text-brand-400 font-normal">pts</span>
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    {Object.entries(latestCheckin.scores || {}).map(([cond, score]) => {
                      const initial = earliestCheckin.scores?.[cond] || 0;
                      const diff = roundDiff(initial, score, cond);
                      return (
                        <div key={cond} className="flex justify-between items-center text-slate-600">
                          <span className="capitalize">{cond.replace('_', ' ')}</span>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-slate-900">{score}%</span>
                            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${diff.bg}`}>
                              {diff.text}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Progress Timeline */}
          <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-card border border-slate-100 space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Check-in Timeline History</h2>
            <div className="space-y-3">
              {[...checkins].reverse().map((c) => {
                const isExpanded = expandedCheckinId === c.id;
                return (
                  <div
                    key={c.id}
                    className="border border-slate-200 rounded-xl overflow-hidden hover:border-brand-300 transition-colors"
                  >
                    <div
                      onClick={() => setExpandedCheckinId(isExpanded ? null : c.id)}
                      className="p-4 flex items-center justify-between cursor-pointer bg-white hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold text-xs shadow-2xs">
                          {c.week_label}
                        </div>
                        <div>
                          <p className="font-bold text-slate-900 text-sm capitalize">
                            {c.primary_condition.replace('_', ' ')} • {c.severity}
                          </p>
                          <p className="text-xs text-slate-400">
                            {c.date ? new Date(c.date).toLocaleDateString() : 'Weekly assessment'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-sm font-extrabold text-brand-600">
                          {c.skin_health_score} pts
                        </span>
                        {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="p-4 bg-slate-50/70 border-t border-slate-100 grid sm:grid-cols-3 gap-2 text-xs">
                        {Object.entries(c.scores || {}).map(([cond, score]) => (
                          <div key={cond} className="bg-white p-2.5 rounded-lg border border-slate-200 flex justify-between">
                            <span className="capitalize text-slate-600">{cond.replace('_', ' ')}</span>
                            <span className="font-bold text-slate-900">{score}%</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

function roundDiff(initial, current, condition) {
  const diff = Math.round((current - initial) * 10) / 10;
  if (condition === 'normal') {
    if (diff > 0) return { text: `+${diff}%`, bg: 'bg-emerald-100 text-emerald-800' };
    if (diff < 0) return { text: `${diff}%`, bg: 'bg-rose-100 text-rose-800' };
    return { text: '0%', bg: 'bg-slate-100 text-slate-700' };
  }
  // For problem conditions, a reduction is good!
  if (diff < 0) return { text: `${diff}%`, bg: 'bg-emerald-100 text-emerald-800' };
  if (diff > 0) return { text: `+${diff}%`, bg: 'bg-rose-100 text-rose-800' };
  return { text: '0%', bg: 'bg-slate-100 text-slate-700' };
}
