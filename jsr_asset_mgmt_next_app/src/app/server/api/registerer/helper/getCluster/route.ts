import { getConnection } from "@/app/server/db/db";
import { NextRequest, NextResponse } from "next/server";

interface ClusterInterface {
  id: string;
  area_id: string;
  locality: string;
  locality_id: string;
  status: string;
  entry_by: number;
  entry_date: Date;
  mod_by: number;
  mod_date: Date;
}

export async function POST(req: NextRequest) {
  try {
    const { zone_id }: { zone_id: number } = await req.json();
    const pool = await getConnection();
    const result = await pool
      .request()
      .query(
        `SELECT * FROM tata_asset_mgmt.jusco_asset_mgmt.data_area where zone_id=${zone_id}`
      );

    console.log(result);

    // Assuming result.recordset contains the rows you need
    const clusters: ClusterInterface[] = result.recordset;

    return NextResponse.json(
      {
        clusters: clusters,
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
