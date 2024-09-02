import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  const { serial_number } = await req.json();

  try {
    const query = `select * from toilet_master where serial_number = ${serial_number}`;
    const toilet = query[0];

    return NextResponse.json(
      {
        toilet,
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
