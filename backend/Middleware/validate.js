/**
 * validate.js — Lightweight input validation middleware (no extra packages)
 *
 * Usage in a router:
 *   import { validateRegister } from '../Middleware/validate.js';
 *   router.post('/register', validateRegister, RegisterUser);
 *
 * Each validator calls next() if inputs are valid, or returns a 400 JSON error.
 */

// ─── Helper ───────────────────────────────────────────────────────────────────

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^\+?[0-9]{7,15}$/;

function err(res, message, field = null) {
  return res.status(400).json({
    status: "fail",
    ...(field && { field }),
    message,
  });
}

// ─── User Validators ──────────────────────────────────────────────────────────

export const validateRegister = (req, res, next) => {
  const { name, email, password, cpassword, phone } = req.body;

  if (!name || typeof name !== "string" || name.trim().length < 2)
    return err(res, "Name must be at least 2 characters", "name");

  if (!email || !EMAIL_RE.test(email))
    return err(res, "Valid email is required", "email");

  if (!password || password.length < 6)
    return err(res, "Password must be at least 6 characters", "password");

  if (password !== cpassword)
    return err(res, "Passwords do not match", "cpassword");

  if (!phone || !PHONE_RE.test(phone))
    return err(res, "Valid phone number is required (7-15 digits)", "phone");

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !EMAIL_RE.test(email))
    return err(res, "Valid email is required", "email");

  if (!password || typeof password !== "string" || password.length === 0)
    return err(res, "Password is required", "password");

  next();
};

export const validateForgotPassword = (req, res, next) => {
  const { email } = req.body;
  if (!email || !EMAIL_RE.test(email))
    return err(res, "Valid email is required", "email");
  next();
};

export const validateResetPassword = (req, res, next) => {
  const { verifycode, password, cpassword } = req.body;

  if (!verifycode || isNaN(Number(verifycode)))
    return err(res, "Valid verification code is required", "verifycode");

  if (!password || password.length < 6)
    return err(res, "Password must be at least 6 characters", "password");

  if (password !== cpassword)
    return err(res, "Passwords do not match", "cpassword");

  next();
};

// ─── Order Validators ─────────────────────────────────────────────────────────

export const validatePlaceOrder = (req, res, next) => {
  const { shippingAddress, paymentMethod } = req.body;

  if (!shippingAddress || typeof shippingAddress !== "string" || shippingAddress.trim().length < 5)
    return err(res, "Shipping address must be at least 5 characters", "shippingAddress");

  const allowed = ["COD", "ONLINE"];
  if (paymentMethod && !allowed.includes(paymentMethod))
    return err(res, `paymentMethod must be one of: ${allowed.join(", ")}`, "paymentMethod");

  next();
};

// ─── Product Validators ───────────────────────────────────────────────────────

export const validateCreateProduct = (req, res, next) => {
  const { pname, pprice, catid, pdescription, mainStock } = req.body;

  if (!pname || typeof pname !== "string" || pname.trim().length < 2)
    return err(res, "Product name must be at least 2 characters", "pname");

  if (!pprice || isNaN(Number(pprice)) || Number(pprice) < 0)
    return err(res, "Valid product price is required", "pprice");

  if (!catid)
    return err(res, "Category ID is required", "catid");

  if (!pdescription || typeof pdescription !== "string" || pdescription.trim().length < 10)
    return err(res, "Description must be at least 10 characters", "pdescription");

  if (mainStock === undefined || isNaN(Number(mainStock)) || Number(mainStock) < 0)
    return err(res, "mainStock must be a non-negative number", "mainStock");

  if (!req.file)
    return err(res, "Product image is required", "image");

  next();
};

// ─── Category Validators ──────────────────────────────────────────────────────

export const validateCreateCategory = (req, res, next) => {
  const { name } = req.body;

  if (!name || typeof name !== "string" || name.trim().length < 2)
    return err(res, "Category name must be at least 2 characters", "name");

  next();
};

// ─── Review Validators ────────────────────────────────────────────────────────

export const validateReview = (req, res, next) => {
  const { productId, rating, comment } = req.body;

  if (!productId)
    return err(res, "productId is required", "productId");

  const r = Number(rating);
  if (!rating || isNaN(r) || r < 1 || r > 5)
    return err(res, "Rating must be between 1 and 5", "rating");

  if (!comment || typeof comment !== "string" || comment.trim().length < 3)
    return err(res, "Comment must be at least 3 characters", "comment");

  next();
};

// ─── Banner Validators ────────────────────────────────────────────────────────

export const validateCreateBanner = (req, res, next) => {
  const { bannertitle, bannerdescription } = req.body;

  if (!bannertitle || typeof bannertitle !== "string" || bannertitle.trim().length < 3)
    return err(res, "Banner title must be at least 3 characters", "bannertitle");

  if (!bannerdescription || typeof bannerdescription !== "string" || bannerdescription.trim().length < 5)
    return err(res, "Banner description must be at least 5 characters", "bannerdescription");

  if (!req.file)
    return err(res, "Banner image is required", "image");

  next();
};
