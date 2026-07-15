
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast"; // 
// import { resetPassword } from "../../redux/thunks/authThunks/AuthThunk";

// const ResetPassword = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { loading, error, fpMessage, resetToken, fpEmail } = useSelector((s) => s.auth);

//   const [pwd, setPwd] = useState("");
//   const [confirm, setConfirm] = useState("");
//   const [localErr, setLocalErr] = useState("");

//   useEffect(() => {
//     if (!resetToken) {
//       navigate("/verify-otp", { replace: true, state: { email: fpEmail } });
//     }
//   }, [resetToken, navigate, fpEmail]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLocalErr("");

//     if (pwd.length < 6) return setLocalErr("Password must be at least 6 characters");
//     if (pwd !== confirm) return setLocalErr("Passwords do not match");

//     const res = await dispatch(
//       resetPassword({
//         resetToken,
//         newPassword: pwd,
//         confirmPassword: confirm,
//       })
//     );

//     if (res?.meta?.requestStatus === "fulfilled") {
//       toast.success("Password reset successfully. Please login.");
//       setTimeout(() => navigate("/auth/login"), 800);
//     } else {
//       toast.error(typeof res?.payload === "string" ? res.payload : "Failed to reset password");
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6 mt-10 bg-white shadow-lg rounded-xl border border-gray-200">
//       <h1 className="text-3xl font-bold mb-6 text-center text-blue-700">
//         Set New Password
//       </h1>

//       <form onSubmit={handleSubmit} className="space-y-5">
//         <div>
//           <label className="block mb-1 font-medium text-gray-700">New Password</label>
//           <input
//             type="password"
//             className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             placeholder="Enter new password"
//             value={pwd}
//             onChange={(e) => setPwd(e.target.value)}
//             required
//           />
//         </div>

//         <div>
//           <label className="block mb-1 font-medium text-gray-700">Confirm Password</label>
//           <input
//             type="password"
//             className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
//             placeholder="Re-enter new password"
//             value={confirm}
//             onChange={(e) => setConfirm(e.target.value)}
//             required
//           />
//         </div>

//         <button
//           disabled={loading}
//           className="w-full bg-blue-600 hover:bg-blue-700 transition text-white py-3 rounded-lg font-semibold disabled:opacity-60"
//         >
//           {loading ? "Resetting..." : "Reset Password"}
//         </button>

//         {/* Inline messages */}
//         {localErr && <p className="text-red-600 text-sm text-center">{localErr}</p>}
//         {error && <p className="text-red-600 text-sm text-center">{error}</p>}
//         {fpMessage && <p className="text-green-600 text-sm text-center">{fpMessage}</p>}
//       </form>
//     </div>
//   );
// };

// export default ResetPassword;




import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { resetPassword } from "../../redux/thunks/authThunks/AuthThunk";

const ResetPassword = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { loading, error, fpMessage, resetToken, fpEmail } = useSelector((s) => s.auth);

  const [pwd, setPwd] = useState("");
  const [confirm, setConfirm] = useState("");
  const [localErr, setLocalErr] = useState("");

  useEffect(() => {
    if (!resetToken) {
      // Prefer email from route state if present, else from slice
      const email = location?.state?.email || fpEmail || "";
      navigate("/verify-otp", { replace: true, state: { email } });
    }
  }, [resetToken, navigate, fpEmail, location?.state?.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalErr("");

    // (You enforce the full policy on server; here’s minimal UX guard)
    if (pwd.length < 6) return setLocalErr("Password must be at least 6 characters");
    if (pwd !== confirm) return setLocalErr("Passwords do not match");

    const res = await dispatch(
      resetPassword({
        resetToken,
        newPassword: pwd,
        confirmPassword: confirm,
      })
    );

    if (res?.meta?.requestStatus === "fulfilled") {
      const msg =
        typeof res.payload === "string"
          ? res.payload
          : "Password reset successfully. Please login.";
      toast.success(msg);
      setTimeout(() => navigate("/login"), 800);
    } else {
      const msg =
        typeof res?.payload === "string" ? res.payload : error || "Failed to reset password";
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 px-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-xl rounded-3xl p-8 border border-white/40">
        <h1 className="text-3xl font-extrabold text-center text-gray-900 mb-2">
          Set New Password
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          <div>
            <label className="block mb-1 font-semibold text-gray-700">New Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Enter new password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-gray-700">Confirm Password</label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              placeholder="Re-enter new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          <button
            disabled={loading}
            className="w-full rounded-xl py-3 font-semibold text-white transition-all duration-200 shadow-md
              disabled:bg-gray-300 disabled:text-gray-600 disabled:cursor-not-allowed
              bg-blue-600 hover:bg-blue-700 hover:shadow-lg"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          {localErr && <p className="text-red-600 text-sm text-center">{localErr}</p>}
          {error && <p className="text-red-600 text-sm text-center">{error}</p>}
          {fpMessage && <p className="text-green-600 text-sm text-center">{fpMessage}</p>}
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
``
