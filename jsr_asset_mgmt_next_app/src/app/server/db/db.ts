// import mysql from "mysql2/promise"


// const connectionDetails = {
//   host: 'localhost',
//   user: 'root',
//   password: 'root',
//   database: 'jusco_asset_mgmt',
// };

// const pool = mysql.createPool(connectionDetails); 

// export default pool;

import sql from "mssql";

const connectionDetails = {
  user: 'door2door',
  password: 'Bajr@ng#900',
  server: '10.0.168.30', // You can use 'localhost\\instance' to connect to a specific instance
  database: 'tata_asset_mgmt',
  options: {
    encrypt: true, // Use this if you're on Windows Azure
    trustServerCertificate: true // Change to false for production
  }
};

let pool: any;

const getConnection = async () => {
  if (!pool) {
    pool = new sql.ConnectionPool(connectionDetails);
    await pool.connect();
  }
  return pool;
};

export { getConnection };