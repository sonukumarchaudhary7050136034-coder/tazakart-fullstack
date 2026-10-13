"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (cfg: {
            client_id: string;
            callback: (res: { credential: string }) => void;
          }) => void;
          renderButton: (el: HTMLElement, opts: Record<string, unknown>) => void;
        };
      };
    };
  }
}

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [devOtp, setDevOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  const googleBtnRef = useRef<HTMLDivElement>(null);

  const finishLogin = useCallback(
    (token: string, userEmail: string, name?: string) => {
      localStorage.setItem("userToken", token);
      login({ name: name || userEmail.split("@")[0], email: userEmail });
      router.push(localStorage.getItem("selectedAddressId") ? "/checkout" : "/checkout/address");
    },
    [login, router]
  );

  // Google Sign-In
  const handleGoogleCredential = useCallback(
    async (credential: string) => {
      setError("");
      setLoading(true);
      try {
        const res = await api.googleLogin(credential);
        localStorage.setItem("userToken", res.access_token);
        const me = (await api.getMe()) as { name: string; email: string };
        finishLogin(res.access_token, me.email, me.name);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Google login failed");
      } finally {
        setLoading(false);
      }
    },
    [finishLogin]
  );

  useEffect(() => {
    api.getAuthConfig().then((c) => setGoogleClientId(c.google_enabled ? c.google_client_id : null)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!googleClientId) return;
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.onload = () => {
      if (!window.google || !googleBtnRef.current) return;
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: (res) => handleGoogleCredential(res.credential),
      });
      window.google.accounts.id.renderButton(googleBtnRef.current, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        width: 320,
      });
    };
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, [googleClientId, handleGoogleCredential]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const sendOtp = async () => {
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email.trim())) {
      setError("Please enter a valid email address");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.sendEmailOtp(email.trim());
      setDevOtp(res.dev_otp || "");
      setOtp("");
      setStep("otp");
      setCooldown(30);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (otp.length !== 6) {
      setError("Enter the 6-digit code");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await api.verifyEmailOtp(email.trim(), otp);
      finishLogin(res.access_token, email.trim().toLowerCase());
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--color-bg)" }}>
      <div className="w-full max-w-sm bg-white rounded-2xl border p-8" style={{ borderColor: "var(--color-line)" }}>
        <Link href="/" className="flex items-center gap-1 justify-center mb-6">
          <span className="text-2xl font-black" style={{ color: "var(--color-primary)" }}>Taza</span>
          <span className="text-2xl font-black" style={{ color: "var(--color-accent)" }}>Kart</span>
        </Link>

        {step === "email" ? (
          <>
            <h1 className="text-lg font-bold mb-1">Login or Sign up</h1>
            <p className="text-sm mb-5" style={{ color: "var(--color-muted)" }}>
              We&apos;ll email you a 6-digit code
            </p>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendOtp()}
              placeholder="Enter your email"
              className="w-full border rounded-lg px-3 py-3 outline-none text-sm mb-2"
              style={{ borderColor: "var(--color-line)" }}
            />
            {error && <p className="text-xs text-red-600 mb-2">{error}</p>}
            <button
              onClick={sendOtp}
              disabled={loading}
              className="w-full mt-2 py-3 rounded-lg text-white font-bold disabled:opacity-60"
              style={{ background: "var(--color-primary)" }}
            >
              {loading ? "Sending..." : "Send OTP"}
            </button>

            {googleClientId && (
              <>
                <div className="flex items-center gap-3 my-5">
                  <div className="flex-1 h-px" style={{ background: "var(--color-line)" }} />
                  <span className="text-xs" style={{ color: "var(--color-muted)" }}>or</span>
                  <div className="flex-1 h-px" style={{ background: "var(--color-line)" }} />
                </div>
                <div ref={googleBtnRef} className="flex justify-center" />
              </>
            )}
          </>
        ) : (
          <>
            <h1 className="text-lg font-bold mb-1">Verify your email</h1>
            <p className="text-sm mb-2" style={{ color: "var(--color-muted)" }}>
              Code sent to {email}{" "}
              <button onClick={() => { setStep("email"); setError(""); }} className="font-semibold" style={{ color: "var(--color-primary)" }}>
                Change
              </button>
            </p>
            {devOtp && (
              <p className="text-xs mb-3 px-3 py-2 rounded-lg" style={{ background: "var(--color-bg)", color: "var(--color-primary-dark)" }}>
                Dev mode (SMTP not set) — your OTP is <b>{devOtp}</b>
              </p>
            )}
            <input
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
              onKeyDown={(e) => e.key === "Enter" && verifyOtp()}
              placeholder="Enter 6-digit code"
              maxLength={6}
              inputMode="numeric"
              className="w-full border rounded-lg px-3 py-3 outline-none text-sm tracking-[0.4em] text-center"
              style={{ borderColor: "var(--color-line)" }}
            />
            {error && <p className="text-xs text-red-600 mt-2">{error}</p>}
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full mt-4 py-3 rounded-lg text-white font-bold disabled:opacity-60"
              style={{ background: "var(--color-primary)" }}
            >
              {loading ? "Verifying..." : "Verify & Continue"}
            </button>
            <button
              onClick={sendOtp}
              disabled={cooldown > 0 || loading}
              className="w-full mt-3 text-sm font-semibold disabled:opacity-50"
              style={{ color: "var(--color-primary)" }}
            >
              {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
