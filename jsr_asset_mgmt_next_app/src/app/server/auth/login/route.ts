import { NextRequest, NextResponse } from "next/server";
import pool from "../../db/db";
import jwt from "jsonwebtoken";

const SECRET_KEY = "your-secret-key"; // Replace with your actual secret key

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    // Parse the request body to get mobile_number and password
    const { mobile_number } = await req.json();

    const query = await pool.query(`
      SELECT 
        u.id,
        u.first_name,
        u.last_name,
        r.role_name AS role
      FROM 
        user_master u
      JOIN 
        role_master r ON u.role_id = r.id
      WHERE 
        u.mobile_number = ${mobile_number};
    `);

    if (query[0].length === 0) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const user = query[0][0];

    console.log(user);
    
    const token = jwt.sign(
      {
        id: user.id,
        firstName: user.first_name,
        lastName: user.last_name,
        role: user.role,
      },
      SECRET_KEY,
      { expiresIn: "1h" }
    );

    // Set the token in a HttpOnly cookie
    // const response = ;

    return NextResponse.json({
      user: user,
      token,
    });
  } catch (error) {
    console.error("Error processing login:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
