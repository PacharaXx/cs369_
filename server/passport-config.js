const sql = require("mssql");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
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
let poolPromise = sql
  .connect(config)
  .then((pool) => {
    console.log("Connected to SQL Server");
    return pool;
  })
  .catch((err) => {
    console.error("Database connection failed:", err);
    throw err;
  });

module.exports = (passport) => {
  passport.use(
    new LocalStrategy(async (username, password, done) => {
      try {
        const pool = await poolPromise;
        const result = await pool
          .request()
          .input("username", sql.VarChar, username)
          .query("SELECT * FROM Users WHERE UserName = @username");
        console.log("USERNAME: ", username + " Has logged in");
        if (result.recordset.length === 0) {
          console.log("Incorrect username");
          return done(null, false, {
            message: "Incorrect username or password",
          });
        }

        const user = result.recordset[0];
        const isMatch = await bcrypt.compare(password, user.PasswordHash);

        if (isMatch) {
          return done(null, user, { message: "Logged in successfully" });
        } else {
          console.log("Incorrect password");
          return done(null, false, {
            message: "Incorrect username or password",
          });
        }
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    done(null, user.UserID);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const pool = await poolPromise;
      const result = await pool
        .request()
        .input("id", sql.Int, id)
        .query("SELECT * FROM Users WHERE UserID = @id");

      if (result.recordset.length === 0) {
        return done(new Error("User not found"));
      }

      done(null, result.recordset[0]);
    } catch (err) {
      done(err);
    }
  });
};
