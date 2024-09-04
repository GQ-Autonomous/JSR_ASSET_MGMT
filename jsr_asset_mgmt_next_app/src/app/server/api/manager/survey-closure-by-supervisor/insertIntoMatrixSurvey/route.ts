import { getConnection } from "@/app/server/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    let { code, date, average_rating, remarks, description, user_id, resolve_date_time } = await req.json();
    console.log({ code, date, average_rating, remarks, description, user_id, resolve_date_time });

    if (description) {
        description = ' '
    }
    

    const pool = await getConnection();
    await pool.request()
      .query(`
        INSERT INTO tata_asset_mgmt.jusco_asset_mgmt.matrix_survey_close 
        (average_rating, code, survey_date, remarks, description, user_id, resolve_date_time)
        VALUES ('${average_rating}', '${code}', '${date}', '${remarks}', '${description}', '${user_id}','${resolve_date_time}');
      `);

    return NextResponse.json({ message: "Data inserted successfully" }, { status: 201 });

  } catch (error) {
    console.error("Error inserting data", error);
    return NextResponse.json({ error: "Failed to insert data" }, { status: 500 });
  }
}
