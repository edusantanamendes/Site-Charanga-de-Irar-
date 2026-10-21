import { Router } from "express";
import multer from "multer";
import { publicController } from "../controllers/public.js";
import { authController } from "../controllers/auth.js";
import { adminController } from "../controllers/admin.js";
import { limiter, requireSession } from "../middlewares/security.js";

export function apiRoutes(db, config, mailer) {
  const router = Router();
  const pub = publicController(db, mailer);
  const auth = authController(db, config, mailer);
  const admin = adminController(db, config, mailer);
  const session = requireSession(db, config);
  router.get("/health", async (req, res) => {
    await db.$queryRaw`SELECT 1`;
    res.json({ status: "ok" });
  });
  router.get("/public/site", pub.site);
  router.get("/public/events", pub.events);
  router.get("/public/events/:slug", pub.event);
  router.get("/public/musicians", pub.musicians);
  router.get("/public/gallery", pub.gallery);
  router.post("/public/contact", limiter(5, 60 * 60 * 1000), pub.contact);
  router.post("/auth/login", limiter(15), auth.login);
  router.post("/auth/recover", limiter(5), auth.recover);
  router.post("/auth/reset", limiter(10), auth.reset);
  router.get("/auth/session", session, auth.session);
  router.post("/auth/logout", session, auth.logout);
  router.use("/admin", session);
  router.get("/admin/dashboard", admin.dashboard);
  router.get("/admin/settings", admin.settings);
  router.put("/admin/settings", admin.updateSettings);
  router.post(
    "/admin/upload",
    limiter(40),
    multer({
      storage: multer.memoryStorage(),
      limits: { fileSize: 8 * 1024 * 1024, files: 1, fields: 0 },
    }).single("image"),
    admin.upload,
  );
  router.post("/admin/messages/:id/retry", admin.retry);
  router.get("/admin/:resource", admin.list);
  router.get("/admin/:resource/:id", admin.get);
  router.post("/admin/:resource", admin.save);
  router.put("/admin/:resource/:id", admin.save);
  router.delete("/admin/:resource/:id", admin.remove);
  return router;
}
