"use client";

import { useState } from "react";
import { User, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/auth-context";
import { validateLoginForm } from "@/lib/services/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const validation = validateLoginForm(email, password);
    if (!validation.valid) {
      setFieldErrors(validation.errors);
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "حدث خطأ في تسجيل الدخول");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Left side - illustration */}
      <div className="hidden w-1/2 flex-col items-center justify-center bg-gradient-to-br from-[#e8f8f5] via-[#f0faf8] to-[#f8fdfb] lg:flex">
        <div className="flex max-w-md flex-col items-center px-8 text-center">
          <div className="mb-8 flex h-64 w-80 items-center justify-center">
            <svg viewBox="0 0 320 240" className="h-full w-full" aria-hidden="true">
              <rect x="60" y="20" width="200" height="140" rx="8" fill="#ffffff" stroke="#c8e6c9" strokeWidth="2" />
              <rect x="60" y="20" width="200" height="110" rx="8" fill="#ffffff" />
              <polyline points="80,100 110,90 140,95 170,70 200,60 230,55" fill="none" stroke="#4db6ac" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="80" y1="50" x2="240" y2="50" stroke="#e0e0e0" strokeWidth="0.5" />
              <line x1="80" y1="70" x2="240" y2="70" stroke="#e0e0e0" strokeWidth="0.5" />
              <line x1="80" y1="90" x2="240" y2="90" stroke="#e0e0e0" strokeWidth="0.5" />
              <line x1="80" y1="110" x2="240" y2="110" stroke="#e0e0e0" strokeWidth="0.5" />
              <circle cx="210" cy="50" r="12" fill="none" stroke="#e0e0e0" strokeWidth="4" />
              <circle cx="210" cy="50" r="12" fill="none" stroke="#4db6ac" strokeWidth="4" strokeDasharray="50 75" />
              <circle cx="210" cy="80" r="12" fill="none" stroke="#e0e0e0" strokeWidth="4" />
              <circle cx="210" cy="80" r="12" fill="none" stroke="#80cbc4" strokeWidth="4" strokeDasharray="40 75" />
              <rect x="140" y="160" width="40" height="8" rx="2" fill="#e0e0e0" />
              <ellipse cx="160" cy="172" rx="30" ry="4" fill="#e0e0e0" />
              <rect x="40" y="160" width="80" height="60" rx="4" fill="#ffffff" stroke="#c8e6c9" strokeWidth="1.5" transform="rotate(-8, 80, 190)" />
              <line x1="55" y1="178" x2="105" y2="172" stroke="#4db6ac" strokeWidth="1.5" />
              <line x1="57" y1="188" x2="107" y2="182" stroke="#e0e0e0" strokeWidth="1" />
              <line x1="59" y1="198" x2="100" y2="192" stroke="#e0e0e0" strokeWidth="1" />
              <polyline points="60,182 65,187 75,175" fill="none" stroke="#4db6ac" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <ellipse cx="240" cy="200" rx="15" ry="20" fill="#e0e0e0" stroke="#bdbdbd" strokeWidth="1" />
              <line x1="240" y1="185" x2="240" y2="195" stroke="#bdbdbd" strokeWidth="1" />
            </svg>
          </div>
          <h2 className="mb-3 text-2xl font-bold text-foreground">
            بوابة الموظفين و المسؤلين
          </h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            النظام الوطني الموحد لرصد السجلات الصحية للأطفال وتحسين جودة
            الرعاية الأولية في كافة المحافظات
          </p>
        </div>
      </div>

      {/* Right side - form */}
      <div className="flex w-full flex-col items-center justify-center bg-card px-6 lg:w-1/2">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="mb-2 text-4xl font-bold text-foreground">
              {"أهلًا بيك 👋"}
            </h1>
            <p className="text-muted-foreground">
              يرجي تسجيل الدخول للوصول الي السجلات الرسمية
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <User className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  placeholder="ادخل البريد الإلكتروني"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  className={`w-full rounded-lg border py-3 ps-11 pe-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 ${
                    fieldErrors.email
                      ? "border-destructive bg-destructive/5 focus:border-destructive focus:ring-destructive"
                      : "border-border bg-secondary focus:border-primary focus:ring-primary"
                  }`}
                />
              </div>
              {fieldErrors.email && (
                <p className="mt-1 text-xs text-destructive">{fieldErrors.email}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-foreground">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock className="absolute start-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="ادخل كلمة المرور"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setFieldErrors((prev) => ({ ...prev, password: undefined }));
                  }}
                  className={`w-full rounded-lg border py-3 ps-11 pe-11 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-1 ${
                    fieldErrors.password
                      ? "border-destructive bg-destructive/5 focus:border-destructive focus:ring-destructive"
                      : "border-border bg-secondary focus:border-primary focus:ring-primary"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute end-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {fieldErrors.password && (
                <p className="mt-1 text-xs text-destructive">{fieldErrors.password}</p>
              )}
            </div>

            {error && (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3">
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-l from-[#4db6ac] to-[#80cbc4] py-3.5 text-base font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                  {"جارٍ تسجيل الدخول..."}
                </span>
              ) : (
                "تسجيل الدخول"
              )}
            </button>
          </form>

          <p className="mt-8 text-center text-xs text-muted-foreground">
            {"جميع الحقوق محفوظة © 2024"}
          </p>
        </div>
      </div>
    </div>
  );
}
