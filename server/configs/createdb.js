const bcrypt = require("bcrypt");
const sql = require("mssql");
const dotenv = require("dotenv");

// Load environment variables from .env file
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

console.log(config);

const users = [
  {
    username: "john_doe",
    email: "john.doe@example.com",
    password: "password1",
  },
  {
    username: "jane_smith",
    email: "jane.smith@example.com",
    password: "password2",
  },
  {
    username: "voy",
    email: "asd@example.cpm",
    password: "voy1",
  },
];

async function createTable() {
  try {
    await sql.connect(config);

    const request = new sql.Request();

    const tableSchema = `
        CREATE TABLE Users (
            UserID INT PRIMARY KEY IDENTITY (1,1),
            UserName NVARCHAR(255) NOT NULL,
            UserEmail NVARCHAR(255) NOT NULL,
            PasswordHash NVARCHAR(255) NOT NULL
        );
        `;

    await request.query(tableSchema);
    console.log("Table created successfully");
  } catch (err) {
    console.error("Error creating table:", err);
  } finally {
    sql.close();
  }
}

async function insertUsers() {
  try {
    await sql.connect(config);
    for (const user of users) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      await new sql.Request()
        .input("UserName", sql.NVarChar, user.username)
        .input("UserEmail", sql.NVarChar, user.email)
        .input("PasswordHash", sql.NVarChar, hashedPassword)
        .query(
          "INSERT INTO Users (UserName, UserEmail, PasswordHash) VALUES (@UserName, @UserEmail, @PasswordHash)"
        );
    }
    console.log("Users inserted successfully");
  } catch (err) {
    console.error("Error inserting users:", err);
  } finally {
    sql.close();
  }
}

// createTable();
insertUsers();
