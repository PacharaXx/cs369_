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

async function createTable() {
  try {
    await sql.connect(config);

    const request = new sql.Request();

    // Define your table schema and columns
    const tableSchema = `
    -- Products Table
CREATE TABLE Products (
    ProductID INT PRIMARY KEY IDENTITY (1,1),
    Name NVARCHAR(255) NOT NULL,
    Price DECIMAL(10, 2) NOT NULL,
    ImageURL NVARCHAR(255) NOT NULL
);

-- ProductDetails Table
CREATE TABLE ProductDetails (
    ProductID INT PRIMARY KEY,
    Description NVARCHAR(MAX) NOT NULL,
    Size NVARCHAR(255),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID)
);

-- Materials Table
CREATE TABLE Materials (
    MaterialID INT PRIMARY KEY IDENTITY (1,1),
    Material NVARCHAR(255) NOT NULL
);

-- ProductMaterials Junction Table
CREATE TABLE ProductMaterials (
    ProductID INT,
    MaterialID INT,
    PRIMARY KEY (ProductID, MaterialID),
    FOREIGN KEY (ProductID) REFERENCES Products(ProductID),
    FOREIGN KEY (MaterialID) REFERENCES Materials(MaterialID)
);


-- Insert into Products table
INSERT INTO Products (Name, Price, ImageURL)
VALUES ('Wooden Table', 150.00, 'http://example.com/images/table.jpg');

-- Assume the ProductID is 1 for this example, insert into ProductDetails table
INSERT INTO ProductDetails (ProductID, Description, Size)
VALUES (1, 'A beautiful handcrafted wooden table perfect for any home.', '120x60x75 cm');

-- Insert materials
INSERT INTO Materials (Material) VALUES ('Oak Wood');
INSERT INTO Materials (Material) VALUES ('Metal Legs');

-- Assume MaterialIDs are 1 and 2 for this example, insert into ProductMaterials table
INSERT INTO ProductMaterials (ProductID, MaterialID) VALUES (1, 1);
INSERT INTO ProductMaterials (ProductID, MaterialID) VALUES (1, 2);

        `;

    // Execute the table creation query
    await request.query(tableSchema);

    console.log("Table Products created successfully");
  } catch (error) {
    console.error("Error creating table:", error);
  } finally {
    sql.close();
  }
}

createTable();
