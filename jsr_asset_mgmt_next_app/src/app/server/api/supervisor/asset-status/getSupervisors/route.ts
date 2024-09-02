import { getConnection } from "@/app/server/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // const { user_id }: { user_id: number } = await req.json();
    const pool = await getConnection();
    const result = await pool.request().query(`select du.id, du.user_name 
from 
tata_asset_mgmt.jusco_asset_mgmt.data_users as du
where
du.user_role = 3`);
    // console.log(user_id);

    const supervisors = result.recordset;
    return NextResponse.json({ supervisors: supervisors }, { status: 200 });
  } catch (error) {
    console.error("Error fetching area and localities", error);
    throw new Error("Failed to retrieve area and localities");
  }
}
