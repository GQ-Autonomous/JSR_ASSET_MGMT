import { getConnection } from "@/app/server/db/db";
import { NextRequest, NextResponse } from "next/server";

interface AreaInterface {
  id: string;
  area_id: string;
  locality: string;
  locality_id: string;
  status: string;
  entry_by: Date;
  entry_date: string;
  mod_by: Date;
  mod_date: string;
}

export async function POST(req: NextRequest) {
  try {
    const { cluster_id }: { cluster_id: number } = await req.json();
    const pool = await getConnection();
    const result = await pool
      .request()
      .query(
        `SELECT * FROM tata_asset_mgmt.jusco_asset_mgmt.data_locality where area_id=${cluster_id}`
      );

    // Assuming result.recordset contains the rows you need
    const locality: AreaInterface[] = result.recordset;

    return NextResponse.json(
      {
        localities: locality,
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
