import pool from "@/app/server/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const { city_id } = await req.json();

  try {
    const query = await pool.query(
      `select * from business_master where city_id = ${city_id}`
    );
    const business = await query[0];

    return NextResponse.json(
      {
        business
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
