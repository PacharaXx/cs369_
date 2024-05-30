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

    // Delete from ProductMaterials table first
    try {
      await request.query("DELETE FROM ProductMaterials");
      console.log("Deleted data from ProductMaterials");
    } catch (error) {
      console.error("Error deleting from ProductMaterials:", error);
    }

    // Delete from ProductDetails table next
    try {
      await request.query("DELETE FROM ProductDetails");
      console.log("Deleted data from ProductDetails");
    } catch (error) {
      console.error("Error deleting from ProductDetails:", error);
    }

    // Reset identity seeds after deleting data from related tables
    try {
      await request.query("DBCC CHECKIDENT ('ProductMaterials', RESEED, 0)");
      console.log("Identity seed reset for ProductMaterials");
    } catch (error) {
      console.error(
        "Error resetting identity seed for ProductMaterials:",
        error
      );
    }

    try {
      await request.query("DBCC CHECKIDENT ('ProductDetails', RESEED, 0)");
      console.log("Identity seed reset for ProductDetails");
    } catch (error) {
      console.error("Error resetting identity seed for ProductDetails:", error);
    }

    // Finally, delete data from Products and Materials tables
    try {
      await request.query("DELETE FROM Products");
      console.log("Deleted data from Products");
    } catch (error) {
      console.error("Error deleting from Products:", error);
    }

    try {
      await request.query("DELETE FROM Materials");
      console.log("Deleted data from Materials");
    } catch (error) {
      console.error("Error deleting from Materials:", error);
    }

    console.log("Data reset and identity seeds reset successfully");
  } catch (error) {
    console.error("Error resetting data:", error);
  }
  // No need to close the SQL connection here
}

resetData();

resetData();
