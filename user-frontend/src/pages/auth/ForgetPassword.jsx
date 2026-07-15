
// import { useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast"; 
// import { requestOtp } from "../../redux/thunks/authThunks/AuthThunk";

// export default function ForgetPassword() {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { loading, fpMessage, error } = useSelector((s) => s.auth);
//   const [email, setEmail] = useState("");

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!email) return;

//     const res = await dispatch(requestOtp(email));
//     if (res?.meta?.requestStatus === "fulfilled") {
//       // optional toast
//       toast.success("If this email exists, an OTP has been sent.");
//       navigate("/verify-otp", { state: { email } });
//     } else {
//       // optional toast for error fallback
//       toast.error(typeof res?.payload === "string" ? res.payload : "Failed to send OTP");
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
//       <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl p-8 border border-white/40">

//         <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
//           Forgot Password?
//         </h1>

//         <p className="text-center text-gray-600 mb-8 text-sm">
//           Don’t worry! Enter your email and we'll send an OTP to reset your password.
//         </p>

//         <form onSubmit={handleSubmit} className="space-y-5">
//           <input
//             type="email"
//             className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//             placeholder="you@example.com"
//             value={email}
//             onChange={(e) => setEmail(e.target.value.trim())}
//             required
//           />

//           <button
//             disabled={loading}
//             className={`w-full py-3 rounded-xl font-semibold text-white shadow-md transition-all duration-200 ${
//               loading
//                 ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
//             }`}
//           >
//             {loading ? "Sending..." : "Send OTP"}
//           </button>

//           {/* Inline messages (keep) */}
//           {fpMessage && (
//             <p className="text-green-600 text-sm text-center font-medium">
//               {fpMessage}
//             </p>
//           )}
//           {error && (
//             <p className="text-red-600 text-sm text-center font-medium">
//               {error}
//             </p>
//           )}
//         </form>
//       </div>
//     </div>
//   );
// }
// ``





import { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { requestOtp } from "../../redux/thunks/authThunks/AuthThunk";

export default function ForgetPassword() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { loading, fpMessage, error } = useSelector((s) => s.auth);
  const [email, setEmail] = useState("");
  const [cooldown, setCooldown] = useState(0); // optional cooldown seconds

  // Simple email validation (front-end only)
  const emailValid = useMemo(() => {
    if (!email) return false;
    // very light check; backend is source of truth
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }, [email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = email.trim().toLowerCase();
    if (!trimmed || !emailValid || loading || cooldown > 0) return;

    const res = await dispatch(requestOtp(trimmed));

    if (res?.meta?.requestStatus === "fulfilled") {
      // Back-end success message (e.g., "OTP has been sent to your email.")
      const msg =
        typeof res.payload === "string"
          ? res.payload
          : fpMessage || "OTP has been sent to your email.";
      toast.success(msg);
      // optional: start a 60s cooldown to prevent spam
      startCooldown(60);
      navigate("/verify-otp", { state: { email: trimmed } });
    } else {
      // Back-end error (e.g., 404 "This email is not registered")
      const msg =
        typeof res?.payload === "string"
          ? res.payload
          : error || "Failed to send OTP";
      toast.error(msg);
    }
  };

  // Optional cooldown (resend protection)
  const startCooldown = (sec) => {
    setCooldown(sec);
    const iv = setInterval(() => {
      setCooldown((s) => {
        if (s <= 1) {
          clearInterval(iv);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl p-8 border border-white/40">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
          Forgot Password?
        </h1>

        <p className="text-center text-gray-600 mb-8 text-sm">
          Don’t worry! Enter your email and we'll send an OTP to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // no trim here
            required
            autoComplete="email"
            aria-invalid={!emailValid && email.length > 0 ? "true" : "false"}
          />

          <button
            type="submit"
            disabled={loading || !emailValid || cooldown > 0}
            className={`w-full py-3 rounded-xl font-semibold text-white shadow-md transition-all duration-200 ${
              loading || !emailValid || cooldown > 0
                ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
            }`}
          >
            {loading
              ? "Sending..."
              : cooldown > 0
              ? `Wait ${cooldown}s`
              : "Send OTP"}
          </button>
          
<div className="flex items-center justify-between text-sm mt-4">
  <button
    type="button"
    onClick={() => navigate("/login")}
    className="text-gray-600 hover:text-gray-800 underline"
  >
    ← Back to Login
  </button>

  <button
    type="button"
    onClick={() => navigate("/register")}
    className="text-blue-600 hover:text-blue-800 underline font-medium"
  >
    Create new account →
  </button>
</div>


          {/* Inline messages (keep) */}
          {fpMessage && (
            <p className="text-green-600 text-sm text-center font-medium">
              {fpMessage}
            </p>
          )}
          {error && (
            <p className="text-red-600 text-sm text-center font-medium">
              {error}
            </p>
          )}
        </form>

        {/* Optional: a subtle helper below form */}
        <p className="text-center text-xs text-gray-500 mt-4">
          Make sure you enter the email you used to register your account.
        </p>
      </div>
    </div>
  );
}
``
