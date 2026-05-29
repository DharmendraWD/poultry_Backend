
const dotenv = require("dotenv");
require("dotenv").config();
const app = require("./app");
const { dbConnection } = require("../db/db.js");


// DATABASE CALL AND SERVER START 
// const userRoutes = require("./routes/user.routes");
// const contentRoutes = require("./routes/content.routes");
// calling database 
dbConnection()
    .then(() => {
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("Database connection Error", error);
        process.exit(1);
    }); 