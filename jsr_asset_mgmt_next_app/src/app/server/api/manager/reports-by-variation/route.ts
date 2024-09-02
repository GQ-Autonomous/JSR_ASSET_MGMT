import { getConnection } from "@/app/server/db/db";
import { NextRequest } from "next/server";


export async function POST(req: NextRequest) {
    const {startTime, endTime} = await req.json()
    console.log({startTime, endTime});
    
    try {
        const pool = await getConnection()
        const result = await pool.request().query(`SELECT 
    dal.location,
	dal.code, 
    dal.name, 
    dal.location, 
    dl.locality, 
    da.area, 
    dz.zone,
	du.user_name,
    CASE 
        WHEN CHARINDEX(',', dal.location) > 0 
        THEN TRY_CAST(SUBSTRING(dal.location, 1, CHARINDEX(',', dal.location) - 1) AS FLOAT) 
        ELSE NULL 
    END AS dal_latitude, 
    CASE 
        WHEN CHARINDEX(',', dal.location) > 0 
        THEN TRY_CAST(SUBSTRING(dal.location, CHARINDEX(',', dal.location) + 1, LEN(dal.location)) AS FLOAT) 
        ELSE NULL 
    END AS dal_longitude,
    
    txa.entry_location AS scanned_location, 
    CASE 
        WHEN CHARINDEX(',', txa.entry_location) > 0 
        THEN TRY_CAST(SUBSTRING(txa.entry_location, 1, CHARINDEX(',', txa.entry_location) - 1) AS FLOAT) 
        ELSE NULL 
    END AS scanned_latitude, 
    CASE 
        WHEN CHARINDEX(',', txa.entry_location) > 0 
        THEN TRY_CAST(SUBSTRING(txa.entry_location, CHARINDEX(',', txa.entry_location) + 1, LEN(txa.entry_location)) AS FLOAT) 
        ELSE NULL 
    END AS scanned_longitude,
    CONVERT(VARCHAR, txa.entry_date, 23) AS scanned_date,
    CONVERT(VARCHAR, txa.entry_date, 8) AS scanned_time
FROM 
    tata_asset_mgmt.jusco_asset_mgmt.txn_activity AS txa
JOIN 
    tata_asset_mgmt.jusco_asset_mgmt.data_asset_list AS dal 
    ON dal.id = txa.asset_id
JOIN 
    tata_asset_mgmt.jusco_asset_mgmt.data_locality AS dl 
    ON dl.id = dal.locality_id
JOIN 
    tata_asset_mgmt.jusco_asset_mgmt.data_area AS da 
    ON da.id = dl.area_id
JOIN 
    tata_asset_mgmt.jusco_asset_mgmt.data_zone AS dz 
    ON dz.id = da.zone_id
JOIN 
    tata_asset_mgmt.jusco_asset_mgmt.data_users AS du 
    ON du.id = txa.entry_by
WHERE 
    txa.user_role = 'cleaner' AND
	txa.entry_date between '${startTime}' AND '${endTime}'`)
    return new Response(
        JSON.stringify(
          result.recordset,
        ),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    } catch (error) {
        console.error("Database connection failed", error);
    return new Response(
      JSON.stringify({
        message: "Database connection failed",
        error: error.message,
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    }

}