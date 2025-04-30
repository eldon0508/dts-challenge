var express = require("express");
var router = express.Router();
var taskController = require("../controllers/taskController");

router.get("/", taskController.index);
router.post("/store", taskController.store);
router.get("/:id/edit", taskController.edit);
router.put("/:id/update", taskController.update);
router.delete("/:id/destroy", taskController.destroy);

module.exports = router;
