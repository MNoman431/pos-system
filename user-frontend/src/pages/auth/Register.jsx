import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import toast from "react-hot-toast";
import { registerUser } from "../../redux/thunks/authThunks/AuthThunk";
import { clearAuthError } from "../../redux/slices/authSlices/AuthSlice";
import { usePasswordStrength } from "../../hooks/usePasswordStrength";
import TextInput from "../../components/ui/inputs/TextInput";
import SelectInput from "../../components/ui/inputs/SelectInput";
import PasswordInput from "../../components/ui/inputs/PasswordInput";
import Button from "../../components/ui/buttons/Button";

const registerSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .min(2, "At least 2 characters")
    .max(50, "Max 50")
    .required("First name is required"),
  lastName: Yup.string()
    .trim()
    .min(2, "At least 2 characters")
    .max(50, "Max 50")
    .required("Last name is required"),
  age: Yup.number()
    .typeError("Age must be a number")
    .integer("Age must be an integer")
    .positive("Age must be positive")
    .min(1, "Minimum age is 1")
    .max(120, "Maximum age is 120")
    .nullable(),
  email: Yup.string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string()
    .min(8, "Minimum 8 characters")
    .required("Password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords do not match")
    .required("Confirm your password"),
  gender: Yup.mixed()
    .oneOf(["male", "female"], "Select a valid gender")
    .required("Gender is required"),
});

// Compact input styles
// const inputBase =
//   "w-full border rounded-lg px-3 py-2.5 shadow-sm bg-white focus:outline-none focus:ring-2 transition text-[15px]";
// // const inputNormal = `${inputBase} border-gray-300 focus:ring-blue-500`;
// // const inputError = `${inputBase} border-red-400 focus:ring-red-500`;

const Register = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { loading, error } = useSelector((s) => s.auth);

  const [pwd, setPwd] = useState("");
  const { score, label } = usePasswordStrength(pwd);

  useEffect(() => {
    dispatch(clearAuthError());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex">
      {/* Brand panel */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-900 p-12 text-white">
        <span className="text-2xl font-extrabold tracking-tight">
          Fancy<span className="text-indigo-400">POS</span>
        </span>
        <div>
          <h2 className="text-4xl font-bold leading-tight max-w-md">
            Set up your team in minutes.
          </h2>
          <p className="mt-4 text-slate-300 max-w-sm">
            Create an account to start managing inventory, sales, and staff roles from one dashboard.
          </p>
        </div>
        <p className="text-sm text-slate-500">&copy; {new Date().getFullYear()} FancyPOS</p>
      </div>

      {/* Form panel */}
      <div className="flex flex-1 items-center justify-center bg-slate-50 px-3 py-8">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-sm border border-slate-200 p-6 sm:p-8 text-[15px]">
        {/* Heading (compact) */}
        <h1 className="text-3xl font-extrabold text-center mb-1 text-slate-900 tracking-tight leading-tight">
          Create Account
        </h1>
        <p className="text-center text-slate-500 mb-5 text-[13px] leading-snug">
          Join <span className="font-semibold text-indigo-600">FancyPOS</span> today
        </p>

        {/* Hidden fake fields (autocomplete hardening) */}
        <form className="hidden" autoComplete="off">
          <input type="text" name="fake-username" autoComplete="username" />
          <input
            type="password"
            name="fake-password"
            autoComplete="new-password"
          />
        </form>

        <Formik
          key={location.pathname}
          initialValues={{
            firstName: "",
            lastName: "",
            age: "",
            email: "",
            password: "",
            confirmPassword: "",
            gender: "",
          }}
          validationSchema={registerSchema}
          onSubmit={async (values, { setSubmitting, resetForm }) => {
            const age =
              typeof values.age === "string" && /^\d+$/.test(values.age)
                ? Number(values.age)
                : undefined;

            const payload = {
              firstName: values.firstName.trim(),
              lastName: values.lastName.trim(),
              age,
              email: values.email.trim().toLowerCase(),
              password: values.password,
              confirmPassword: values.confirmPassword,
              gender: values.gender,
            };

            const res = await dispatch(registerUser(payload));
            setSubmitting(false);

            if (registerUser.fulfilled.match(res)) {
              resetForm();
              toast.success(
                <span className="text-sm">
                  Registered successfully →{" "}
                  <Link
                    to="/login"
                    className="font-semibold text-blue-700 underline"
                  >
                    Login
                  </Link>
                </span>,
              );
            } else {
              toast.error(res.payload || "Registration failed");
            }
          }}
        >
          {({  isSubmitting }) => (
            // Inside Formik:
            <Form className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <TextInput
                  label="First Name"
                  name="firstName"
                  // placeholder="Muhammad"
                />
                <TextInput
                  label="Last Name"
                  name="lastName"
                  // placeholder="Rehan"
                />
                <TextInput
                  label="Age"
                  name="age"
                  type="text"
                  inputMode="numeric"
                />
                <SelectInput
                  label="Gender"
                  name="gender"
                  options={["male", "female"]}
                />
                <TextInput
                  label="Email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  className="md:col-span-2"
                />
                <PasswordInput
                  label="Password"
                  name="password"
                  placeholder="••••••••"
                  value={pwd}
                  onChangeValue={setPwd}
                  score={score}
                  labelStrength={label}
                />
                <TextInput
                  label="Confirm Password"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter password"
                />
              </div>

              <Button type="submit" isLoading={loading || isSubmitting} color="blue">
                Create Account
              </Button>
               <p className="text-center text-xs text-slate-600">
                 Already have an account?{" "}
                 <Link to="/login" className="font-semibold text-indigo-600 hover:underline">
                   Login
                 </Link>
            </p>
            </Form>
          )}
        </Formik>
      </div>
      </div>
    </div>
  );
};

export default Register;

// import React, { useEffect, useState } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import { useDispatch, useSelector } from "react-redux";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import toast from "react-hot-toast";
// import { registerUser } from "../../redux/thunks/authThunks/AuthThunk";
// import { clearAuthError } from "../../redux/slices/authSlices/AuthSlice";

// /* =========================
//    Validation Schema
// ========================= */
// const registerSchema = Yup.object({
//   firstName: Yup.string()
//     .trim()
//     .min(2, "First name is too short")
//     .max(50, "First name is too long")
//     .matches(/^[A-Za-zÀ-ÿ' -]+$/, "Only letters and spaces allowed")
//     .required("First name is required"),
//   lastName: Yup.string()
//     .trim()
//     .min(2, "Last name is too short")
//     .max(50, "Last name is too long")
//     .matches(/^[A-Za-zÀ-ÿ' -]+$/, "Only letters and spaces allowed")
//     .required("Last name is required"),
//   age: Yup.number()
//     .typeError("Age must be a number")
//     .min(0, "Age cannot be negative")
//     .max(120, "Age seems invalid")
//     .nullable()
//     .optional(),
//   email: Yup.string().trim().email("Invalid email").required("Email is required"),
//   password: Yup.string().min(6, "At least 6 characters").required("Password is required"),
//   confirmPassword: Yup.string()
//     .oneOf([Yup.ref("password"), null], "Passwords do not match")
//     .required("Confirm your password"),
//   gender: Yup.mixed().oneOf(["male", "female"], "Select gender").required("Gender is required"),
// });

// /* =========================
//    Password Strength Helper
// ========================= */
// const getPasswordStrength = (pwd) => {
//   const rules = [
//     pwd.length >= 8,
//     /[A-Z]/.test(pwd),
//     /[a-z]/.test(pwd),
//     /\d/.test(pwd),
//     /[^A-Za-z0-9]/.test(pwd),
//   ];
//   const passed = rules.filter(Boolean).length;
//   const score = Math.round((passed / 5) * 100);
//   let label = "Weak";
//   if (score >= 80) label = "Strong";
//   else if (score >= 60) label = "Medium";
//   return { score, label };
// };

// const Register = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate(); // 👈 needed for toast button
//   const location = useLocation();
//   const { loading, error } = useSelector((s) => s.auth);

//   const [pwd, setPwd] = useState("");
//   const { score, label } = getPasswordStrength(pwd);

//   useEffect(() => {
//     dispatch(clearAuthError());
//   }, [dispatch]);

//   useEffect(() => {
//     if (error) toast.error(error);
//   }, [error]);

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-3">
//       <div className="w-full max-w-lg bg-white rounded-xl shadow-md p-6 md:p-7">
//         <div className="mb-4">
//           <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900">
//             Create Account
//           </h1>
//         </div>

//         {/* Hidden fake fields to discourage autofill */}
//         <form className="hidden" autoComplete="off">
//           <input type="text" name="fake-username" autoComplete="username" />
//           <input type="password" name="fake-password" autoComplete="new-password" />
//         </form>

//         <Formik
//           key={location.pathname}
//           initialValues={{
//             firstName: "",
//             lastName: "",
//             age: "",
//             email: "",
//             password: "",
//             confirmPassword: "",
//             gender: "",
//           }}
//           validationSchema={registerSchema}
//           onSubmit={async (values, { setSubmitting, resetForm }) => {
//             const payload = {
//               firstName: values.firstName.trim(),
//               lastName: values.lastName.trim(),
//               age: values.age === "" ? undefined : Number(values.age),
//               email: values.email.trim().toLowerCase(),
//               password: values.password,
//               confirmPassword: values.confirmPassword,
//               gender: values.gender,
//             };

//             const res = await dispatch(registerUser(payload));
//             setSubmitting(false);

//             if (registerUser.fulfilled.match(res)) {
//               resetForm();

//               // ✅ Toast with "Go to Login" clickable button
//               toast.custom(
//                 (t) => (
//                   <div
//                     className={`max-w-sm w-full rounded-lg shadow-md border p-4 bg-white ${
//                       t.visible ? "animate-enter" : "animate-leave"
//                     }`}
//                   >
//                     <p className="text-sm text-gray-800">
//                       <span className="font-semibold">Registered successfully.</span>{" "}
//                       Please login to continue.
//                     </p>

//                     <div className="mt-3 flex items-center gap-2">
//                       <button
//                         onClick={() => {
//                           toast.dismiss(t.id);
//                           navigate("/login");
//                         }}
//                         className="px-3 py-1.5 rounded-md text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 transition"
//                       >
//                         Go to Login
//                       </button>

//                       <button
//                         onClick={() => toast.dismiss(t.id)}
//                         className="px-3 py-1.5 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-100 transition"
//                       >
//                         Dismiss
//                       </button>
//                     </div>
//                   </div>
//                 ),
//                 { duration: 5000, position: "top-right" }
//               );
//             } else if (registerUser.rejected.match(res)) {
//               toast.error(res.payload || "Registration failed");
//             }
//           }}
//         >
//           {({ isSubmitting, handleSubmit }) => (
//             <Form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
//               <div className="grid grid-cols-1 md:grid-cols-2 md:gap-4 gap-3">
//                 {/* First Name */}
//                 <div>
//                   <label className="block text-xs font-medium mb-1 text-gray-700" htmlFor="firstName">
//                     First Name <span className="text-red-500">*</span>
//                   </label>
//                   <Field
//                     id="firstName"
//                     name="firstName"
//                     type="text"
//                     placeholder="Muhammad"
//                     autoComplete="given-name"
//                     className="w-full h-10 text-sm border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   />
//                   <ErrorMessage name="firstName" component="div" className="mt-1 text-xs text-red-600" />
//                 </div>

//                 {/* Last Name */}
//                 <div>
//                   <label className="block text-xs font-medium mb-1 text-gray-700" htmlFor="lastName">
//                     Last Name <span className="text-red-500">*</span>
//                   </label>
//                   <Field
//                     id="lastName"
//                     name="lastName"
//                     type="text"
//                     placeholder="Rehan"
//                     autoComplete="family-name"
//                     className="w-full h-10 text-sm border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   />
//                   <ErrorMessage name="lastName" component="div" className="mt-1 text-xs text-red-600" />
//                 </div>

//                 {/* Age (optional) */}
//                 <div>
//                   <label className="block text-xs font-medium mb-1 text-gray-700" htmlFor="age">
//                     Age (optional)
//                   </label>
//                   <Field
//                     id="age"
//                     name="age"
//                     type="number"
//                     inputMode="numeric"
//                     min="0"
//                     max="120"
//                     placeholder="22"
//                     className="w-full h-10 text-sm border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   />
//                   <ErrorMessage name="age" component="div" className="mt-1 text-xs text-red-600" />
//                 </div>

//                 {/* Gender */}
//                 <div>
//                   <label className="block text-xs font-medium mb-1 text-gray-700" htmlFor="gender">
//                     Gender <span className="text-red-500">*</span>
//                   </label>
//                   <Field
//                     as="select"
//                     id="gender"
//                     name="gender"
//                     className="w-full h-10 text-sm border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   >
//                     <option value="">Select gender</option>
//                     <option value="male">Male</option>
//                     <option value="female">Female</option>
//                   </Field>
//                   <ErrorMessage name="gender" component="div" className="mt-1 text-xs text-red-600" />
//                 </div>

//                 {/* Email */}
//                 <div className="md:col-span-2">
//                   <label className="block text-xs font-medium mb-1 text-gray-700" htmlFor="email">
//                     Email Address <span className="text-red-500">*</span>
//                   </label>
//                   <Field
//                     id="email"
//                     name="email"
//                     type="email"
//                     placeholder="you@example.com"
//                     autoComplete="email"
//                     className="w-full h-10 text-sm border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   />
//                   <ErrorMessage name="email" component="div" className="mt-1 text-xs text-red-600" />
//                 </div>

//                 {/* Password */}
//                 <div>
//                   <label className="block text-xs font-medium mb-1 text-gray-700" htmlFor="password">
//                     Password <span className="text-red-500">*</span>
//                   </label>

//                   <Field name="password">
//                     {({ field }) => (
//                       <input
//                         id="password"
//                         type="password"
//                         placeholder="••••••••"
//                         autoComplete="new-password"
//                         className="w-full h-10 text-sm border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                         {...field}
//                         onChange={(e) => {
//                           field.onChange(e);
//                           setPwd(e.target.value);
//                         }}
//                       />
//                     )}
//                   </Field>

//                   {/* Compact strength bar */}
//                   <div className="mt-1">
//                     <div className="h-1.5 bg-gray-200 rounded">
//                       <div
//                         className="h-1.5 rounded transition-all"
//                         style={{
//                           width: `${score}%`,
//                           background: score >= 80 ? "#16a34a" : score >= 60 ? "#f59e0b" : "#ef4444",
//                         }}
//                       />
//                     </div>
//                     <small
//                       className="text-[10px] font-medium"
//                       style={{
//                         color: score >= 80 ? "#16a34a" : score >= 60 ? "#f59e0b" : "#ef4444",
//                       }}
//                     >
//                       {label}
//                     </small>
//                   </div>

//                   <ErrorMessage name="password" component="div" className="mt-1 text-xs text-red-600" />
//                 </div>

//                 {/* Confirm Password */}
//                 <div>
//                   <label className="block text-xs font-medium mb-1 text-gray-700" htmlFor="confirmPassword">
//                     Confirm Password <span className="text-red-500">*</span>
//                   </label>
//                   <Field
//                     id="confirmPassword"
//                     name="confirmPassword"
//                     type="password"
//                     placeholder="Re-enter password"
//                     autoComplete="new-password"
//                     className="w-full h-10 text-sm border border-gray-300 rounded-lg px-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
//                   />
//                   <ErrorMessage name="confirmPassword" component="div" className="mt-1 text-xs text-red-600" />
//                 </div>
//               </div>

//               {/* Submit */}
//               <button
//                 type="submit"
//                 disabled={loading || isSubmitting}
//                 className={`w-full h-10 rounded-lg text-sm font-semibold text-white transition-all duration-200 ${
//                   loading || isSubmitting
//                     ? "bg-gray-300 text-gray-600 cursor-not-allowed"
//                     : "bg-blue-600 hover:bg-blue-700 shadow-sm"
//                 }`}
//               >
//                 {loading || isSubmitting ? "Creating..." : "Create Account"}
//               </button>

//               {/* Login link (tight spacing) */}
//               <p className="text-center text-xs text-gray-600">
//                 Already have an account?{" "}
//                 <Link to="/login" className="font-semibold text-blue-600 hover:underline">
//                   Login
//                 </Link>
//               </p>
//             </Form>
//           )}
//         </Formik>
//       </div>
//     </div>
//   );
// };

// export default Register;
