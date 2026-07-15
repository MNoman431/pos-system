import React from "react";
import { Field, ErrorMessage } from "formik";

const inputBase =
  "w-full border rounded-lg px-3.5 py-2.5 shadow-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition text-[15px]";
const inputNormal = `${inputBase} border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/30`;
const inputError = `${inputBase} border-red-400 focus:border-red-500 focus:ring-red-500/30`;


const TextInput = React.memo(({ label, name, type = "text", placeholder, className = "", ...props }) => {
  return (
    <div className={className}>
      <label className="block text-[13px] font-semibold mb-1 text-slate-700 leading-none">
        {label}
      </label>
      <Field name={name}>
        {({ field, form }) => (
          <input
            {...field}
            {...props}
            type={type}
            placeholder={placeholder}
            className={
              form.touched[name] && form.errors[name] ? inputError : inputNormal
            }
          />
        )}
      </Field>
      <ErrorMessage
        name={name}
        component="div"
        className="mt-0.5 text-xs text-red-600 leading-none line-clamp-1"
      />
    </div>
  );
});
TextInput.whyDidYouRender = true;
export default TextInput;
