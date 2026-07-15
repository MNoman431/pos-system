
import { useEffect, useState } from "react";

export function usePasswordStrength(password = "") {
  const [score, setScore] = useState(0);      // 0..100
  const [label, setLabel] = useState("");     // empty until user types

  useEffect(() => {
    if (!password) {
      setScore(0);
      setLabel("");         // no label when empty
      return;
    }

    const rules = [
      password.length >= 8,
      /[A-Z]/.test(password),
      /[a-z]/.test(password),
      /\d/.test(password),
      /[^A-Za-z0-9]/.test(password),
    ];

    const passed = rules.filter(Boolean).length;         // 0..5
    const raw = Math.round((passed / 5) * 100);          // 0,20,40,60,80,100 (if all 5 passed)

    // Map to label first
    let lbl = "Weak";
    if (raw >= 80) lbl = "Strong";
    else if (raw >= 60) lbl = "Medium";

    // Force full bar on "Strong"
    const finalScore = lbl === "Strong" ? 100 : raw;

    setScore(finalScore);
    setLabel(lbl);
  }, [password]);

  return { score, label };
}
