import express from "express";
import AuditTrail from '../../models/Admin&Miscellaneous/audit_trail';

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const entry = await AuditTrail.create(req.body);
    res.status(201).json(entry);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.get("/", async (_req, res) => {
  try {
    const entries = await AuditTrail.find()
    res.json(entries);
  } catch (error) {
    res.status(500).json({ error });
  }
});



router.put("/:id", async (req, res) => {
  try {
    const updated = await AuditTrail.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      return res.status(404).json({ error: "Audit entry not found" });
    }
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await AuditTrail.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Audit entry not found" });
    }
    res.json({ message: "Audit entry deleted" });
  } catch (error) {
    res.status(500).json({ error });
  }
});

export default router;
