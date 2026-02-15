"use client";

import {authClient, googleLogin} from "@/lib/auth-client";

export default function AuthModal({isOpen, onClose}) {
  if (!isOpen) return null;

  //   const handleGoogleLogin = async () => {
  //     await authClient.signIn.social(
  //       {
  //         provider: "google",
  //         callbackURL: "/",
  //       },
  //       {
  //         onRequest: () => {
  //           console.log("Redirecting to Google...");
  //         },
  //         onError: (ctx) => {
  //           alert(ctx.error.message);
  //         },
  //       },
  //     );
  //   };

  return (
    <div className="modal modal-open">
      <div className="modal-box bg-neutral-900 border border-white/10 max-w-sm text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-400"
        >
          ✕
        </button>

        <h3 className="text-2xl font-bold text-white mb-2">Sign in</h3>
        <p className="text-gray-400 text-sm mb-6">
          Track product prices and get alerts on price drops.
        </p>

        <div className="flex flex-col gap-3">
          <button
            onClick={googleLogin}
            className="btn btn-outline border-white/10 hover:bg-white hover:text-black text-white normal-case gap-3"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        <div className="modal-action justify-center">
          <p className="text-[10px] text-gray-500 uppercase tracking-widest">
            {/* Secure login by Better Auth */}
          </p>
        </div>
      </div>

      {/* Click outside to close */}
      <div
        className="modal-backdrop bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      ></div>
    </div>
  );
}
