// import { getConnection } from "../db/db";

import { getConnection } from "@/app/server/db/db";

export async function POST(req, res) {
  const { startDate, endDate } = await req.json();
  try {
    const pool = await getConnection();
    console.log(startDate, endDate);
    const result = await pool.request()
      .query(`SELECT 
    dz.zone, 
    daA.area, 
    dl.locality, 
    da.code, 
    da.name, 
    dq.questions, 
    tf.rating, 
    ta.remarks, 
    CONVERT(date, ta.entry_date) AS entry_date,  -- Extract date part
    FORMAT(ta.entry_date, 'HH:mm:ss') AS entry_time  -- Format time part
FROM 
    tata_asset_mgmt.jusco_asset_mgmt.txn_feedback AS tf
JOIN 
    tata_asset_mgmt.jusco_asset_mgmt.data_questions AS dq ON tf.question_no = dq.id
JOIN 
    tata_asset_mgmt.jusco_asset_mgmt.txn_activity AS ta ON tf.txn_id = ta.id
JOIN 
    tata_asset_mgmt.jusco_asset_mgmt.data_asset_list AS da ON ta.asset_id = da.id
JOIN 
    tata_asset_mgmt.jusco_asset_mgmt.data_locality AS dl ON da.locality_id = dl.id
JOIN 
    tata_asset_mgmt.jusco_asset_mgmt.data_area AS daA ON dl.area_id = daA.id
JOIN 
    tata_asset_mgmt.jusco_asset_mgmt.data_zone AS dz ON daA.zone_id = dz.id
WHERE
    dq.category = 'FEEDBACK' AND
    ta.entry_date BETWEEN '${startDate}' AND '${endDate}'
ORDER BY
    ta.entry_date, da.code;
`);
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



// -- Initialize the variable for the maximum count_of_frequency
// DECLARE @MaxFrequency INT;
// DECLARE @sql NVARCHAR(MAX);

// -- Calculate the count_of_frequency for each row independently
// WITH FrequencyCTE AS (
//     SELECT 
//         dal.code,
//         CONVERT(date, ta.mod_date) AS mod_date,
//         ROW_NUMBER() OVER (PARTITION BY dal.code, CONVERT(date, ta.mod_date) ORDER BY ta.mod_date) AS rn
//     FROM 
//         tata_asset_mgmt.jusco_asset_mgmt.txn_activity AS ta
//     JOIN 
//         tata_asset_mgmt.jusco_asset_mgmt.data_asset_list AS dal ON ta.asset_id = dal.id
//     WHERE 
//         ta.mod_date BETWEEN '2024-06-01' AND '2024-06-30'
//         AND ta.user_role = 'cleaner'
// ),
// CountCTE AS (
//     SELECT 
//         code,
//         mod_date,
//         COUNT(*) AS count_of_frequency
//     FROM 
//         FrequencyCTE
//     GROUP BY 
//         code, mod_date
// ),
// MaxFrequencyPerCode AS (
//     SELECT 
//         code,
//         MAX(count_of_frequency) AS MaxFrequency
//     FROM 
//         CountCTE
//     GROUP BY 
//         code
// ),
// MaxFrequencyOverall AS (
//     SELECT 
//         MAX(MaxFrequency) AS MaxFrequency
//     FROM 
//         MaxFrequencyPerCode
// )

// -- Set the variable for the maximum count_of_frequency
// SELECT @MaxFrequency = MaxFrequency
// FROM MaxFrequencyOverall;

// -- Debugging: Check the calculated MaxFrequency
// PRINT 'Calculated MaxFrequency: ' + CAST(@MaxFrequency AS NVARCHAR);

// -- Ensure @MaxFrequency is set correctly, default to 2 if not (safety check)
// IF @MaxFrequency IS NULL OR @MaxFrequency < 1
//     SET @MaxFrequency = 2;

// -- Build the dynamic SQL query
// SET @sql = N'
// WITH FrequencyCTE AS (
//     SELECT 
//         dal.code,
//         dz.zone,
//         da.area,
//         dl.locality, 
//         dal.name,
//         CONVERT(date, ta.mod_date) AS mod_date,
//         ta.status, 
//         dal.frequency,
//         ta.remarks, 
//         ta.user_role,
//         ta.mod_by,
//         du.user_name,
//         ta.mod_date AS entry_time,
//         ROW_NUMBER() OVER (PARTITION BY dal.code, CONVERT(date, ta.mod_date) ORDER BY ta.mod_date) AS rn
//     FROM 
//         tata_asset_mgmt.jusco_asset_mgmt.txn_activity AS ta
//     JOIN 
//         tata_asset_mgmt.jusco_asset_mgmt.data_asset_list AS dal ON ta.asset_id = dal.id
//     JOIN 
//         tata_asset_mgmt.jusco_asset_mgmt.data_locality AS dl ON dal.locality_id = dl.id
//     JOIN
//         tata_asset_mgmt.jusco_asset_mgmt.data_area AS da ON dl.area_id = da.id
//     JOIN
//         tata_asset_mgmt.jusco_asset_mgmt.data_zone AS dz ON da.zone_id = dz.id
//     JOIN
//         tata_asset_mgmt.jusco_asset_mgmt.data_users AS du ON ta.entry_by = du.id
//     WHERE 
//         ta.mod_date BETWEEN ''${startDate}'' AND ''${endDate}''
//         AND ta.user_role = ''cleaner''
// ),
// FilteredCTE AS (
//     SELECT
//         code,
//         zone,
//         area,
//         locality, 
//         name,
//         mod_date,
//         entry_time,
//         status, 
//         frequency,
//         remarks, 
//         user_role,
//         user_name,
//         rn,
//         LAG(entry_time) OVER (PARTITION BY code, mod_date ORDER BY entry_time) AS prev_entry_time
//     FROM
//         FrequencyCTE
// ),
// FilteredModTimes AS (
//     SELECT
//         code,
//         zone,
//         area,
//         locality, 
//         name,
//         mod_date,
//         entry_time,
//         status, 
//         frequency,
//         remarks, 
//         user_role,
//         user_name,
//         rn,
//         CASE 
//             WHEN prev_entry_time IS NULL OR DATEDIFF(MINUTE, prev_entry_time, entry_time) >= ${timeInterval}
//             THEN FORMAT(entry_time, ''HH:mm:ss'')
//             ELSE NULL
//         END AS entry_time_filtered
//     FROM
//         FilteredCTE
// ),
// OrderedModTimes AS (
//     SELECT
//         code,
//         zone,
//         area,
//         locality, 
//         name,
//         mod_date,
//         entry_time_filtered,
//         status, 
//         frequency,
//         remarks, 
//         user_role,
//         user_name,
//         ROW_NUMBER() OVER (PARTITION BY code, mod_date ORDER BY rn) AS ordered_rn
//     FROM
//         FilteredModTimes
//     WHERE entry_time_filtered IS NOT NULL
// )
// SELECT 
//     zone,
//     area,
//     locality, 
//     code,
//     name, 
//     mod_date AS Entry_Date,
//     STRING_AGG(entry_time_filtered, '', '') WITHIN GROUP (ORDER BY ordered_rn) AS original_entry_time,
//     COUNT(entry_time_filtered) AS Count_of_frequency, 
//     remarks, 
//     status AS Status, 
//     user_role AS User_role, 
//     user_name AS UserName
// FROM 
//     OrderedModTimes
// GROUP BY 
//     code, locality, name, mod_date, status, frequency, remarks, user_role, area, zone, user_name
// ORDER BY 
//     code, mod_date;';

// -- Execute the dynamic SQL
// EXEC sp_executesql @sql;
