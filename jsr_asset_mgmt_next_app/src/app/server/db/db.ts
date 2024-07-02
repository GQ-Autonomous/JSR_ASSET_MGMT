import mysql from "mysql2/promise"


const connectionDetails = {
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'jusco_asset_mgmt',
};

const pool = mysql.createPool(connectionDetails); 

export default pool;
