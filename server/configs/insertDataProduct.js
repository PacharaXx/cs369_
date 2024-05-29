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

const data = [
  {
    Name: "Wooden Table",
    Price: 150.0,
    ImageURL: "http://example.com/images/table.jpg",
    Description: "A beautiful wooden table",
    Size: "Medium",
    Materials: ["Wood", "Metal"],
  },
  {
    Name: "Glass Vase",
    Price: 20.0,
    ImageURL: "http://example.com/images/vase.jpg",
    Description: "A delicate glass vase",
    Size: "Small",
    Materials: ["Glass"],
  },
  {
    Name: "Leather Sofa",
    Price: 500.0,
    ImageURL: "http://example.com/images/sofa.jpg",
    Description: "A luxurious leather sofa",
    Size: "Large",
    Materials: ["Leather", "Wood"],
  },
];

async function insertData() {
  try {
    await sql.connect(config);

    for (const product of data) {
      const request = new sql.Request(); // Create a new request object for each product

      // Insert into Products table
      const productResult = await request
        .input("Name", sql.NVarChar, product.Name)
        .input("ImageURL", sql.NVarChar, product.ImageURL)
        .input("Price", sql.Decimal(10, 2), product.Price)
        .query(
          "INSERT INTO Products (Name, Price, ImageURL) OUTPUT INSERTED.ProductID VALUES (@Name, @Price, @ImageURL)"
        );

      const productId = productResult.recordset[0].ProductID;

      // Insert into ProductDetails table
      await request
        .input("ProductID_Detail", sql.Int, productId)
        .input("Description", sql.NVarChar, product.Description)
        .input("Size", sql.NVarChar, product.Size)
        .query(
          "INSERT INTO ProductDetails (ProductID, Description, Size) VALUES (@ProductID_Detail, @Description, @Size)"
        );

      // Insert materials and product-material relationships
      for (const material of product.Materials) {
        const materialRequest = new sql.Request(); // Create a new request object for each material

        // Check if the material already exists
        const materialResult = await materialRequest
          .input("Material_Check", sql.NVarChar, material)
          .query(
            "SELECT MaterialID FROM Materials WHERE Material = @Material_Check"
          );

        let materialId;
        if (materialResult.recordset.length > 0) {
          materialId = materialResult.recordset[0].MaterialID;
        } else {
          // Insert new material
          const materialInsertResult = await materialRequest
            .input("Material_Insert", sql.NVarChar, material)
            .query(
              "INSERT INTO Materials (Material) OUTPUT INSERTED.MaterialID VALUES (@Material_Insert)"
            );
          materialId = materialInsertResult.recordset[0].MaterialID;
        }

        // Insert into ProductMaterials table
        await materialRequest
          .input("ProductID_Material", sql.Int, productId)
          .input("MaterialID", sql.Int, materialId)
          .query(
            "INSERT INTO ProductMaterials (ProductID, MaterialID) VALUES (@ProductID_Material, @MaterialID)"
          );
      }
    }

    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error inserting data:", error);
  } finally {
    sql.close();
  }
}

insertData();
