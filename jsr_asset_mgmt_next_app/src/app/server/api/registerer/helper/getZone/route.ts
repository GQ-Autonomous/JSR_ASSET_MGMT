import pool from "@/app/server/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const { business_id } = await req.json();

  try {
    const query = await pool.query(
      `select * from zone_master where business_id = ${business_id}`
    );
    const zones = await query[0];

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
