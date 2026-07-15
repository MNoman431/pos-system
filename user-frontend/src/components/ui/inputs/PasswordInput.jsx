import React from "react";
import { Field, ErrorMessage } from "formik";

const inputBase =
  "w-full border rounded-lg px-3.5 py-2.5 shadow-sm bg-white text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 transition text-[15px]";
const inputNormal = `${inputBase} border-slate-300 focus:border-indigo-500 focus:ring-indigo-500/30`;
const inputError = `${inputBase} border-red-400 focus:border-red-500 focus:ring-red-500/30`;
const PasswordInput = ({
  label,
  name,
  value, // default removed
  onChangeValue,
  score = 0,
  labelStrength = "",
  placeholder,
  showStrengthMeter = true,
}) => (
  <div>
    <label className="block text-[13px] font-semibold mb-1 text-slate-700 leading-none">
      {label}
    </label>
    <Field name={name}>
      {({ field, form }) => (
        <input
          {...field}
          type="password"
          value={value !== undefined ? value : field.value} // ✅ use Formik value if prop not passed
          onChange={(e) => {
            field.onChange(e);
            onChangeValue && onChangeValue(e.target.value);
          }}
          placeholder={placeholder}
          className={form.touched[name] && form.errors[name] ? inputError : inputNormal}
        />
      )}
    </Field>

    {showStrengthMeter && value?.length > 0 && (
      <div className="mt-1" aria-live="polite">
        <div className="h-1 bg-gray-200 rounded">
          <div
            className="h-1 rounded transition-all"
            style={{
              width: `${score}%`,
              background: score >= 80 ? "#16a34a" : score >= 60 ? "#f59e0b" : "#ef4444",
            }}
          />
        </div>
        <small
          className="text-[10px] font-medium"
          style={{
            color: score >= 80 ? "#16a34a" : score >= 60 ? "#f59e0b" : "#ef4444",
          }}
        >
          {labelStrength}
        </small>
      </div>
    )}

    <ErrorMessage
      name={name}
      component="div"
      className="mt-1 text-xs text-red-600"
    />
  </div>
);

PasswordInput.whyDidYouRender = true;

export default PasswordInput;
