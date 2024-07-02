import pool from "@/app/server/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const { cluster_id } = await req.json();
    const query = await pool.query(
      `select * from locality_master where cluster_id = ${cluster_id}`
    );
    const localities = await query[0];

    return NextResponse.json(
      {
        localities,
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
