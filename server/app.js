const express = require("express");
const passport = require("passport");
const session = require("express-session");
const bodyParser = require("body-parser");
const flash = require("connect-flash");
const bcrypt = require("bcrypt");
const sql = require("mssql");
const fs = require("fs");
const cors = require("cors");
const path = require("path");

// Require the Passport configuration
require("./passport-config")(passport);
const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

console.log(process.env.secret_key);
const app = express();

// Middleware for enabling CORS
// Middleware for CORS
app.use(
  cors({
    origin: "http://localhost:3000", // Allow requests from this origin
    credentials: true, // Allow cookies to be sent with requests
  })
);
// Middleware for parsing JSON and urlencoded request bodies
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for managing sessions
app.use(
  session({
    secret: process.env.secret_key,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

app.use(express.static(path.join(__dirname, "../client/", "public")));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Middleware for flash messages
app.use(flash());

// Set up routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({
      message: "Unauthorized",
      isAuthenticated: req.isAuthenticated(),
    });
  } else {
    // return UserID
    res.json({
      message: req.user.UserName,
      isAuthenticated: req.isAuthenticated(),
    });
    // res.json({ message: "You are authenticated" });
  }
});

// Login route
app.post("/api/login", (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      // Authentication failed, send specific error message
      return res.status(401).json({ messages: [info.message] });
    }
    req.logIn(user, (err) => {
      if (err) {
        return next(err);
      }
      // Authentication successful
      return res.status(200).json({ message: "Login successful" });
    });
  })(req, res, next);
});

app.get("/api/register", (req, res) => {
  res.send("Register");
});

app.post("/api/register", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    await new sql.Request()
      .input("UserName", sql.NVarChar, username)
      .input("UserEmail", sql.NVarChar, email)
      .input("PasswordHash", sql.NVarChar, hashedPassword)
      .query(
        "INSERT INTO Users (UserName, UserEmail, PasswordHash) VALUES (@UserName, @UserEmail, @PasswordHash)"
      );
    res.send("User registered successfully!");
  } catch (err) {
    console.error("Error registering user:", err);
    res.redirect("/register");
  }
});

// ../public/uploads
const uploadDir = path.join(__dirname, "../client/", "public", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// POST route for adding a product with Base64 image input
app.post("/api/addProduct", async (req, res) => {
  const {
    nameProduct,
    priceProduct,
    description,
    size,
    materials,
    imgProductBase64,
  } = req.body;

  try {
    // Validate required fields
    if (
      !nameProduct ||
      !priceProduct ||
      !description ||
      !size ||
      !materials ||
      !imgProductBase64
    ) {
      return res
        .status(400)
        .send("All fields and image file (Base64) are required");
    }

    const imgProductBase64S = imgProductBase64.replace(
      /^data:image\/\w+;base64,/,
      ""
    );

    // Ensure 'uploads' directory exists
    const uploadDir = path.join(__dirname, "../client/", "public", "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Decode Base64 image data
    const imgBuffer = Buffer.from(imgProductBase64S, "base64");
    // Save decoded image to a file
    const imgProductUrl = `/uploads/${Date.now()}_image.jpg`;
    const imgPath = path.join(__dirname, "../client/", "public", imgProductUrl);
    fs.writeFileSync(imgPath, imgBuffer);

    // Start a transaction
    const transaction = new sql.Transaction();
    await transaction.begin();

    // Insert into Products table
    const productRequest = new sql.Request(transaction);
    const productResult = await productRequest
      .input("Name", sql.NVarChar, nameProduct)
      .input("ImageURL", sql.NVarChar, imgProductUrl)
      .input("Price", sql.Decimal(10, 2), priceProduct)
      .query(
        "INSERT INTO Products (Name, Price, ImageURL) OUTPUT INSERTED.ProductID VALUES (@Name, @Price, @ImageURL)"
      );

    const productId = productResult.recordset[0].ProductID;

    // Insert into ProductDetails table
    const detailRequest = new sql.Request(transaction);
    await detailRequest
      .input("ProductID", sql.Int, productId)
      .input("Description", sql.NVarChar, description)
      .input("Size", sql.NVarChar, size)
      .query(
        "INSERT INTO ProductDetails (ProductID, Description, Size) VALUES (@ProductID, @Description, @Size)"
      );

    // Insert materials and product-material relationships
    for (const material of materials) {
      // Check if the material already exists
      const materialCheckRequest = new sql.Request(transaction);
      const materialResult = await materialCheckRequest
        .input("Material", sql.NVarChar, material)
        .query("SELECT MaterialID FROM Materials WHERE Material = @Material");

      let materialId;
      if (materialResult.recordset.length > 0) {
        materialId = materialResult.recordset[0].MaterialID;
      } else {
        // Insert new material
        const materialInsertRequest = new sql.Request(transaction);
        const materialInsertResult = await materialInsertRequest
          .input("Material", sql.NVarChar, material)
          .query(
            "INSERT INTO Materials (Material) OUTPUT INSERTED.MaterialID VALUES (@Material)"
          );
        materialId = materialInsertResult.recordset[0].MaterialID;
      }

      // Insert into ProductMaterials table
      const productMaterialRequest = new sql.Request(transaction);
      await productMaterialRequest
        .input("ProductID", sql.Int, productId)
        .input("MaterialID", sql.Int, materialId)
        .query(
          "INSERT INTO ProductMaterials (ProductID, MaterialID) VALUES (@ProductID, @MaterialID)"
        );
    }

    // Commit the transaction
    await transaction.commit();

    res.status(201).send("Product added successfully!");
  } catch (err) {
    console.error("Error adding product:", err);

    // Rollback the transaction in case of error
    if (transaction) await transaction.rollback();

    res.status(500).send("Error adding product");
  }
});

app.get("/api/getAllProducts", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const result = await new sql.Request().query(
      "SELECT DISTINCT Products.ProductID, Products.Name, Products.Price, Products.ImageURL, ProductDetails.Description, ProductDetails.Size,Products.Created_at FROM Products JOIN ProductDetails ON Products.ProductID = ProductDetails.ProductID;"
    );
    res.send(result.recordset);
  } catch (err) {
    console.error("Error getting products:", err);
    res.redirect("/");
  }
});

app.get("/api/getProduct/:id", async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;
  try {
    const productRequest = new sql.Request();
    const productResult = await productRequest
      .input("ProductID", sql.Int, id)
      .query(
        "SELECT * FROM Products WHERE ProductID = @ProductID; SELECT * FROM ProductDetails WHERE ProductID = @ProductID; SELECT Materials.Material FROM Materials INNER JOIN ProductMaterials ON Materials.MaterialID = ProductMaterials.MaterialID WHERE ProductMaterials.ProductID = @ProductID"
      );

    if (productResult.recordsets[0].length === 0) {
      return res.status(404).send("Product not found");
    }

    const product = productResult.recordsets[0][0];
    const details = productResult.recordsets[1][0];
    const materials = productResult.recordsets[2].map(
      (material) => material.Material
    );

    res.send({ product, details, materials });
  } catch (err) {
    console.error("Error getting product:", err);
    res.status(500).send("Error getting product");
  }
});

app.get("/api/logout", (req, res) => {
  res
    .status(200)
    .json({
      message: "Logout successful",
      isAuthenticated: req.isAuthenticated(),
    });
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
});

// Start the server
app.listen(3001, () => {
  console.log("Server started on http://localhost:3001");
});
