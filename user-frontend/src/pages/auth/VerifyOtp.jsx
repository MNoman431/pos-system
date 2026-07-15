
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast"; // 
// import { verifyOtp, requestOtp } from "../../redux/thunks/authThunks/AuthThunk";

// const VerifyOtp = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const { loading, error, fpMessage } = useSelector((s) => s.auth);

//   const [email, setEmail] = useState("");
//   const [otp, setOtp] = useState("");

//   useEffect(() => {
//     if (location?.state?.email) setEmail(location.state.email);
//   }, [location?.state?.email]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!email || !otp) return;

//     const res = await dispatch(verifyOtp({ email, otp }));
//     if (res?.meta?.requestStatus === "fulfilled") {
//       toast.success("OTP verified");
//       navigate("/reset-password", { state: { email } });
//     } else {
//       toast.error(typeof res?.payload === "string" ? res.payload : "Invalid or expired OTP");
//     }
//   };

//   const handleResend = async () => {
//     if (!email) return;
//     const res = await dispatch(requestOtp(email));
//     if (res?.meta?.requestStatus === "fulfilled") {
//       toast.success("OTP resent (if the email exists).");
//     } else {
//       toast.error(typeof res?.payload === "string" ? res.payload : "Failed to resend OTP");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl border border-gray-200">
//       <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
//         Verify OTP
//       </h1>

//       <form onSubmit={handleSubmit} className="space-y-5">
//         <div>
//           <label className="block mb-1 font-medium text-gray-700">
//             Email Address
//           </label>
//           <input
//             type="email"
//             className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             placeholder="Enter your email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value.trim())}
//             required
//           />
//         </div>

//         <div>
//           <label className="block mb-1 font-medium text-gray-700">
//             6-Digit OTP
//           </label>
//           <input
//             type="text"
//             inputMode="numeric"
//             className="w-full border border-gray-300 p-3 rounded-lg tracking-widest text-center text-xl font-semibold focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             placeholder="••••••"
//             value={otp}
//             onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
//             required
//           />
//         </div>

//         <button
//           disabled={loading}
//           className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold disabled:opacity-60"
//         >
//           {loading ? "Verifying..." : "Verify OTP"}
//         </button>

//         <div className="flex items-center justify-between text-sm mt-2">
//           <button
//             type="button"
//             onClick={handleResend}
//             className="text-blue-600 hover:text-blue-800 underline"
//             disabled={loading || !email}
//           >
//             Resend OTP
//           </button>

//           <button
//             type="button"
//             onClick={() => navigate("/forgot-password")}
//             className="text-gray-600 hover:text-gray-800 underline"
//           >
//             Change Email
//           </button>
//         </div>

//         {/* Inline messages */}
//         {fpMessage && <p className="text-green-600 text-sm mt-2 text-center">{fpMessage}</p>}
//         {error && <p className="text-red-600 text-sm mt-2 text-center">{error}</p>}
//       </form>
//     </div>
//   );
// };

// export default VerifyOtp;
// ``

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { verifyOtp, requestOtp } from "../../redux/thunks/authThunks/AuthThunk";

const VerifyOtp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, fpMessage } = useSelector((s) => s.auth);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [cooldown, setCooldown] = useState(0);

  useEffect(() => {
    if (location?.state?.email) setEmail(location.state.email);
  }, [location?.state?.email]);

  const otpValid = useMemo(() => otp.length === 6, [otp]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const normalized = email.trim().toLowerCase();
    if (!normalized || !otpValid || loading) return;

    const res = await dispatch(verifyOtp({ email: normalized, otp }));

    if (res?.meta?.requestStatus === "fulfilled") {
      const msg = typeof res.payload === "string" ? res.payload : "OTP verified";
      toast.success(msg);
      navigate("/reset-password", { state: { email: normalized } });
    } else {
      const msg =
        typeof res?.payload === "string"
          ? res.payload // e.g., "Invalid OTP" / "OTP expired..."
          : error || "Invalid or expired OTP";
      toast.error(msg);
    }
  };

  const handleResend = async () => {
    const normalized = email.trim().toLowerCase();
    if (!normalized || loading || cooldown > 0) return;

    const res = await dispatch(requestOtp(normalized));
    if (res?.meta?.requestStatus === "fulfilled") {
      const msg =
        typeof res.payload === "string"
          ? res.payload
          : fpMessage || "OTP has been sent to your email.";
      toast.success(msg);
      startCooldown(60); // optional
    } else {
      const msg =
        typeof res?.payload === "string" ? res.payload : error || "Failed to resend OTP";
      toast.error(msg);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl border border-gray-200">
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
        Verify OTP
      </h1>

      <form onSubmit={handleSubmit} className="space-y-5" noValidate>
        <div>
          <label className="block mb-1 font-medium text-gray-700">
            Email Address
          </label>
          <input
            type="email"
            className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)} // no trim here
            required
            autoComplete="email"
          />
        </div>

        <div>
          <label className="block mb-1 font-medium text-gray-700">
            6-Digit OTP
          </label>
          <input
            type="text"
            inputMode="numeric"
            className="w-full border border-gray-300 p-3 rounded-lg tracking-widest text-center text-xl font-semibold focus:ring-2 focus:ring-blue-400 focus:outline-none"
            placeholder="••••••"
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            required
            aria-invalid={!otpValid && otp.length > 0 ? "true" : "false"}
          />
        </div>

        <button
          disabled={loading || !otpValid}
          className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold disabled:opacity-60"
        >
          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="flex items-center justify-between text-sm mt-2">
          <button
            type="button"
            onClick={handleResend}
            className="text-blue-600 hover:text-blue-800 underline disabled:opacity-60"
            disabled={loading || !email || cooldown > 0}
          >
            {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend OTP"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/forgot-password")}
            className="text-gray-600 hover:text-gray-800 underline"
          >
            Change Email
          </button>
        </div>

        {fpMessage && (
          <p className="text-green-600 text-sm mt-2 text-center">{fpMessage}</p>
        )}
        {error && (
          <p className="text-red-600 text-sm mt-2 text-center">{error}</p>
        )}
      </form>
    </div>
  );
};

export default VerifyOtp;
