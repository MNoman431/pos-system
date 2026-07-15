export function validateRegister(payload = {}) {
  const { firstName, lastName, age, email, password, confirmPassword, gender, role } = payload;

  const nameRegex = /^[A-Za-zÀ-ÿ' -]+$/;
  if (!firstName || firstName.trim().length < 2 || firstName.trim().length > 50 || !nameRegex.test(firstName.trim())) {
    throw new Error("First name is invalid");
  }
  if (!lastName || lastName.trim().length < 2 || lastName.trim().length > 50 || !nameRegex.test(lastName.trim())) {
    throw new Error("Last name is invalid");
  }
  if (age !== undefined && age !== null) {
    const n = Number(age);
    if (Number.isNaN(n) || n < 0 || n > 120) throw new Error("Age is invalid");
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(String(email).toLowerCase())) {
    throw new Error("Email is invalid");
  }
  if (!password || password.length < 6) throw new Error("Password must be at least 6 characters");
  if (password !== confirmPassword) throw new Error("Passwords do not match");
  if (!["male", "female"].includes(gender)) throw new Error("Gender must be male or female");
  if (role && !["isUser", "isAdmin"].includes(role)) throw new Error("Invalid role");

  return true;
}

export function validateLogin(payload = {}) {
  const { email, password } = payload;
  if (!email || !password) throw new Error("Email and password required");
  return true;
}
// for vendor module
export function validateVendor(payload = {}) {
  const { name, phone, email } = payload;

  if (!name || !name.trim()) {
    throw new Error("Vendor name is required");
  }

  if (phone) {
    const phoneRegex = /^(\+92|0)?3\d{9}$/;
    if (!phoneRegex.test(phone)) {
      throw new Error("Invalid phone number format");
    }
  }

  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error("Invalid email");
    }
  }

  return true;
}

// ================= PURCHASE VALIDATION =================
export function validatePurchase(payload = {}) {
  const { vendor, items, discountType = "fixed", discountValue = 0 } = payload;

  if (!vendor) throw new Error("Vendor is required");
  if (!items || !Array.isArray(items) || items.length === 0)
    throw new Error("At least one item is required");

  const allowedDiscountTypes = ["fixed", "percent"];
  if (!allowedDiscountTypes.includes(discountType))
    throw new Error("Invalid discount type");

  const discountNum = Number(discountValue);
  if (Number.isNaN(discountNum) || discountNum < 0)
    throw new Error("Invalid discount value");

  items.forEach((item, index) => {
    if (!item.itemCode) throw new Error(`Item at index ${index} missing itemCode`);
    if (!item.qty || Number(item.qty) <= 0)
      throw new Error(`Item at index ${index} has invalid quantity`);
  });

  return true;
}