import express from "express";
import {
  createCheckoutSession,
  getAllPurchasedCOurse,
  getCourseDetailWithPurchaseStatus,
  stripeWebhook,
} from "../Controller/coursePurchase.controller.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";

const router = express.Router();

router
  .route("/checkout/create-checkout-session")
  .post(isAuthenticated, createCheckoutSession);
router
  .route("/webhook")
  .post(express.raw({ type: "application/json" }), stripeWebhook);
router
  .route("/course/:courseId/detail-with-status")
  .get(isAuthenticated, getCourseDetailWithPurchaseStatus);

router.route("/").get(isAuthenticated,getAllPurchasedCOurse);

export default router;
