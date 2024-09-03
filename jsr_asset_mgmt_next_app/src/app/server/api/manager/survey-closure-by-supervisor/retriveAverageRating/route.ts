import { getConnection } from "@/app/server/db/db";
import { NextRequest, NextResponse } from "next/server";
import sql from "mssql"; // Ensure 'mssql' is imported

function formatDateTime(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-based
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

export async function POST(req: NextRequest) {
  try {
    const { startDate, endDate } = await req.json();

    console.log({ startDate, endDate });

    const pool = await getConnection();
    const result = await pool
      .request()
      .input("startDate", sql.Date, startDate)
      .input("endDate", sql.Date, endDate).query(`
        SELECT 
            da.code AS code,
            ta.entry_date AS entry_date, 
            AVG(CAST(tf.rating AS FLOAT)) AS average_rating,
            ta.remarks,
            STRING_AGG(CONCAT(dq.questions, ': ', tf.rating), '; ') AS questions_and_ratings,
            FORMAT(ta.entry_date, 'HH:mm:ss') AS entry_time
        FROM 
            tata_asset_mgmt.jusco_asset_mgmt.txn_feedback AS tf
        JOIN 
            tata_asset_mgmt.jusco_asset_mgmt.txn_activity AS ta ON tf.txn_id = ta.id
        JOIN 
            tata_asset_mgmt.jusco_asset_mgmt.data_asset_list AS da ON ta.asset_id = da.id
        JOIN 
            tata_asset_mgmt.jusco_asset_mgmt.data_questions AS dq ON tf.question_no = dq.id
        WHERE
            dq.category = 'FEEDBACK' AND
            ta.entry_date BETWEEN @startDate AND @endDate
        GROUP BY
            da.code, 
            ta.entry_date, 
            ta.remarks, 
            FORMAT(ta.entry_date, 'HH:mm:ss')
        ORDER BY
            entry_date, code;
      `);

    const data = result.recordset;
    // console.log(data);

    const filteredData = [];

    for (let item of data) {
      // Ensure entry_date is a Date object
      const entryDate = new Date(item.entry_date);
      const entryTime = item.entry_time;

      // Combine entry_date and entry_time into a single Date object
      const combinedDateTime = new Date(
        `${entryDate.toISOString().split("T")[0]}T${entryTime}`
      );
      const formattedDateTime = formatDateTime(combinedDateTime);
      // console.log(formattedDateTime);

      if (item.average_rating < 4) {
        const matrixResult = await pool
          .request()
          .query(`
            SELECT * 
            FROM tata_asset_mgmt.jusco_asset_mgmt.matrix_survey_close 
            WHERE code = '${item.code}' AND survey_date = '${formattedDateTime}';
          `);

        console.log(formattedDateTime, item.code);
        
        if (matrixResult.recordset.length > 0) {
          console.log(matrixResult.recordset[0].remarks);

          item.resolve_remarks = matrixResult.recordset[0].remarks;
          // console.log(matrixResult.recordset[0].remarks);
          
        }
        filteredData.push(item);
      } else {
        filteredData.push(item);
      }
    }

    return NextResponse.json({ data: filteredData }, { status: 200 });
  } catch (error) {
    console.error("Error fetching data", error);
    return NextResponse.json(
      { error: "Failed to retrieve data" },
      { status: 500 }
    );
  }
}
