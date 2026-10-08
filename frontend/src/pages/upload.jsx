import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { 
  Upload as UploadIcon, 
  Sparkles, 
  Image as ImageIcon, 
  AlertCircle, 
  CheckCircle2, 
  Sun, 
  Smile, 
  Glasses, 
  RefreshCw,
  ArrowRight
} from 'lucide-react';
import { analyzeSkin } from '../api';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
    setError('');
    if (rejectedFiles && rejectedFiles.length > 0) {
      const rej = rejectedFiles[0];
      if (rej.size > 10 * 1024 * 1024) {
        setError('Image is too large. Maximum allowed file size is 10MB.');
      } else {
        setError('Invalid file format. Please upload a JPEG, PNG, or WEBP photo.');
      }
      return;
    }

    if (!acceptedFiles.length) return;
    const selected = acceptedFiles[0];
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
    setUploadProgress(0);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp']
    },
    maxFiles: 1,
    maxSize: 10 * 1024 * 1024
  });

  const handleAnalyze = async () => {
    if (!file || loading) return;
    setLoading(true);
    setError('');
    setUploadProgress(15);

    try {
      // Simulate progress progression for better UX feedback
      const progressTimer = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressTimer);
            return 90;
          }
          return prev + 15;
        });
      }, 300);

      const result = await analyzeSkin(file, (percent) => {
        if (percent > 0) setUploadProgress(Math.min(95, percent));
      });

      clearInterval(progressTimer);
      setUploadProgress(100);

      // Save analysis payload to sessionStorage
      sessionStorage.setItem('skinResult', JSON.stringify(result));

      // Small delay to let user see 100% completion before navigating
      setTimeout(() => {
        navigate('/results');
      }, 400);

    } catch (err) {
      console.error('Analysis error:', err);
      setError(
        err.response?.data?.detail ||
        err.message ||
        'Failed to complete skin analysis. Please ensure your face is clearly visible and try again.'
      );
      setUploadProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const handleReset = (e) => {
    e.stopPropagation();
    setFile(null);
    setPreview(null);
    setError('');
    setUploadProgress(0);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 lg:py-14">
      {/* Title & Header */}
      <div className="text-center max-w-xl mx-auto mb-8">
        <div className="inline-flex items-center gap-1.5 bg-brand-50 text-brand-700 px-3 py-1 rounded-full text-xs font-semibold mb-3 border border-brand-200">
          <Sparkles className="w-3.5 h-3.5" />
          <span>AI Vision Dermatology Engine</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight sm:text-4xl">
          Scan Your Skin Profile
        </h1>
        <p className="text-slate-500 text-sm sm:text-base mt-2">
          Upload a clear front-facing photo of your face for multi-condition diagnostic analysis.
        </p>
      </div>

      {/* Main Upload Card */}
      <div className="bg-white rounded-2xl shadow-card border border-slate-100 p-6 sm:p-10 mb-8">
        {/* Dropzone Container */}
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-all ${
            isDragActive
              ? 'border-brand-500 bg-brand-50/50 scale-[0.99]'
              : preview
              ? 'border-brand-300 bg-slate-50/40 hover:bg-slate-50'
              : 'border-slate-300 hover:border-brand-400 bg-slate-50/60 hover:bg-brand-50/20'
          }`}
        >
          <input {...getInputProps()} />

          {preview ? (
            <div className="space-y-4">
              <div className="relative inline-block">
                <img
                  src={preview}
                  alt="Face Preview"
                  className="max-h-72 sm:max-h-80 mx-auto rounded-xl object-cover shadow-md border-2 border-white ring-2 ring-brand-500/30"
                />
                <button
                  type="button"
                  onClick={handleReset}
                  className="absolute top-2 right-2 bg-slate-900/80 hover:bg-slate-900 text-white p-2 rounded-full shadow-lg backdrop-blur-sm transition-all"
                  title="Remove and select another photo"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-2 text-brand-700 text-sm font-semibold">
                <CheckCircle2 className="w-4 h-4 text-brand-600" />
                <span>Photo loaded: {file?.name} ({(file?.size / (1024 * 1024)).toFixed(2)} MB)</span>
              </div>
              <p className="text-xs text-slate-400">Click or drag a new image here to replace</p>
            </div>
          ) : (
            <div className="space-y-4 py-4">
              <div className="w-16 h-16 rounded-2xl bg-brand-50 text-brand-600 mx-auto flex items-center justify-center shadow-inner">
                <UploadIcon className="w-8 h-8 animate-bounce" />
              </div>

              <div>
                <p className="text-base font-semibold text-slate-800">
                  {isDragActive ? 'Drop your photo here!' : 'Drag & drop your face photo here, or browse'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Supports JPG, JPEG, PNG, or WEBP • Maximum size 10MB
                </p>
              </div>

              <button
                type="button"
                className="inline-flex items-center gap-2 bg-white border border-slate-200 text-slate-700 px-4 py-2 rounded-xl text-xs font-semibold shadow-sm hover:border-brand-500 hover:text-brand-600 transition-colors"
              >
                <ImageIcon className="w-3.5 h-3.5" />
                Browse from files
              </button>
            </div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mt-4 p-4 rounded-xl bg-rose-50 border border-rose-200 flex items-start gap-3 text-rose-700 text-sm">
            <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-rose-600" />
            <div>
              <p className="font-semibold">Analysis Notice</p>
              <p className="text-xs text-rose-600 mt-0.5">{error}</p>
            </div>
          </div>
        )}

        {/* Upload & Analysis Progress Bar */}
        {loading && (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-600">
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-3.5 h-3.5 animate-spin text-brand-600" />
                Running MediaPipe Face Detection & EfficientNet Neural Model...
              </span>
              <span className="text-brand-600">{uploadProgress}%</span>
            </div>
            <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-brand-500 to-teal-400 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          </div>
        )}

        {/* Submit Action Button */}
        <div className="mt-6">
          <button
            onClick={handleAnalyze}
            disabled={!file || loading}
            className="w-full bg-brand-500 hover:bg-brand-600 active:bg-brand-700 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-white py-4 rounded-xl font-bold text-base shadow-md shadow-brand-500/25 hover:shadow-brand-500/35 transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Analyzing Skin Biometrics...</span>
              </>
            ) : (
              <>
                <span>Analyze My Skin</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tips for Best Results */}
      <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-6">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-brand-600" />
          Tips for Maximum AI Accuracy
        </h3>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
              <Sun className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Natural Lighting</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Face towards a bright window or evenly lit room.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center flex-shrink-0">
              <Smile className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Neutral Centered Face</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Keep whole face centered without extreme angles.</p>
            </div>
          </div>

          <div className="flex items-start gap-3 bg-white p-3.5 rounded-xl border border-slate-100 shadow-sm">
            <div className="w-8 h-8 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center flex-shrink-0">
              <Glasses className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800">Clear Skin View</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Remove sunglasses, heavy makeup, or beauty filters.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}