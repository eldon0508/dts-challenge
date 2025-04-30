const db = require("../database");

const index = async (req, res) => {
  const selectQuery = "SELECT * FROM tasks";
  const data = await db.query(selectQuery);
  return res.status(200).json({ data: data });
};

const store = async (req, res) => {
  try {
    const { title, description, status, dDate } = req.body;
    const insertQuery = "INSERT INTO tasks (title, description, status, due_date) VALUES ($1, $2, $3, $4)";
    await db.query(insertQuery, [title, description, status, dDate]);
    return res.status(201).json({ success: true });
  } catch (err) {
    console.error("Task insert error:", err);
    return res.status(500).json({ success: false });
  }
};

const edit = async (req, res) => {
  const selectQuery = "SELECT * FROM tasks WHERE id = $1";
  const data = await db.query(selectQuery, [req.params.id]);
  return res.status(200).json({ data: data[0] });
};

const update = async (req, res) => {
  try {
    const { title, description, status, dDate } = req.body;
    const updateQuery = "UPDATE tasks SET title = $1, description = $2, status = $3, due_date = $4 WHERE id = $5";

    await db.query(updateQuery, [title, description, status, dDate, req.params.id]);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Task update error:", err);
    return res.status(500).json({ success: false });
  }
};

const destroy = async (req, res) => {
  try {
    const destroyQuery = "DELETE FROM tasks WHERE id = $1";
    await db.query(destroyQuery, [req.params.id]);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Task destroy error:", err);
    return res.status(500).json({ success: false });
  }
};

module.exports = { index, store, edit, update, destroy };
