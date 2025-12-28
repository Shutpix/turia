const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors"); 

dotenv.config();

const app = express();

app.use(cors());             
app.use(express.json());

app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/employees", require("./routes/employee.routes"));
app.use("/api/attendance", require("./routes/attendance.routes"));
app.use("/api/settings", require("./routes/settings.routes"));
app.use("/api/admin/attendance", require("./routes/adminAttendance.routes"));

const PORT = process.env.PORT || 5000;

const bcrypt = require("bcrypt");
console.log(bcrypt.hashSync("admin123", 10));

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
