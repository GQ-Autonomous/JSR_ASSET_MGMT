import { NextRequest, NextResponse } from "next/server";
import pool from "@/app/server/db/db";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const query = await pool.query("select * from city_master");

    const cities = await query[0];

    return NextResponse.json(
      {
        cities: cities,
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
