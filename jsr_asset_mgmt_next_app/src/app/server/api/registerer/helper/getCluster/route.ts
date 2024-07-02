import pool from "@/app/server/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { zone_id } = await req.json();
    const query = await pool.query(
      `select * from cluster_master where zone_id = ${zone_id}`
    );
    const clusters = await query[0];

    return NextResponse.json(
      {
        clusters,
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
        status: 500,
      }
    );
  }
}
