import { getConnection } from "@/app/server/db/db";
import { NextRequest, NextResponse } from "next/server";

interface ZoneInterface {
  id: number;
  zone: string;
  zone_id: string;
  status: string;
  entry_by: number;
  entry_date: Date;
  mod_by: number;
  mod_date: Date;
}

export async function GET(req: NextRequest) {
  try {
    const pool = await getConnection();
    const result = await pool.request().query(`SELECT * FROM tata_asset_mgmt.jusco_asset_mgmt.data_zone`);

    // Assuming result.recordset contains the rows you need
    const zones: ZoneInterface[] = result.recordset;

    return NextResponse.json(
      {
        zones: zones,
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    return NextResponse.json(
      {
        message: (error as Error).message,
      },
      {
        status: 400,
      }
    );
  }
}
