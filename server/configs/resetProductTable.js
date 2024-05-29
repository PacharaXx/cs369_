const sql = require("mssql");
const dotenv = require("dotenv");
dotenv.config();
const config = {
  user: process.env.user,
  password: process.env.password,
  server: process.env.server,
  database: process.env.database,
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

async function resetData() {
  try {
    await sql.connect(config);

    const request = new sql.Request();

    try {
      await request.query("DELETE FROM Users");
      await request.query("DBCC CHECKIDENT ('Users', RESEED, 0)");
    } catch (error) {
      console.error("Error resetting data:", error);
    }

    try {
      await request.query("DELETE FROM Orders");
      await request.query("DBCC CHECKIDENT ('Orders', RESEED, 0)");
    } catch (error) {
      console.error("Error resetting data:", error);
    }

    try {
      // delete from Products table
      await request.query("DELETE FROM Products");
      // reset identity seed
      await request.query("DBCC CHECKIDENT ('Products', RESEED, 0)");
    } catch (error) {
      console.error("Error resetting data:", error);
    }

    try {
      // delete from Materials table
      await request.query("DELETE FROM Materials");
      // reset identity seed
      await request.query("DBCC CHECKIDENT ('Materials', RESEED, 0)");
    } catch (error) {
      console.error("Error resetting data:", error);
    }

    console.log("Data reset and inserted successfully");
  } catch (error) {
    console.error("Error resetting data:", error);
  } finally {
    sql.close();
  }
}

resetData();
