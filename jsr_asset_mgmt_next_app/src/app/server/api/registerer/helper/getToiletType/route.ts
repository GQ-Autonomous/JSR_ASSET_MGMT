import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/server/db/db";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const query = await pool.query("select * from toilet_type");

    const toilet_type = await query[0];

    return NextResponse.json(
      {
        toilet_type: toilet_type,
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
