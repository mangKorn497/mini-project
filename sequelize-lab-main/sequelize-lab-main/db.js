import { Sequelize, DataTypes } from "sequelize";
// database connection

const sequelize = new Sequelize("product_db", "dev_user", "dev_password", {
    host:"localhost",
    port:5439,
    dialect:"postgres",
    logging:false,
});

// define database schema
const Product = sequelize.define("Product", {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey:true,
    },
    name:{
        type:DataTypes.STRING,
        allowNull: false,
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull:false
    },
})

const connectDB = async () =>{
    try {
        await sequelize.authenticate();
        console.log("Connected to PostgreSQL!!");
        await sequelize.sync({ alter:true });
        console.log("Table syncronize !");
    } catch (error) {
        console.error("Connection failed", error);
        process.exit(1);
    }
};
export { sequelize, Product, connectDB };