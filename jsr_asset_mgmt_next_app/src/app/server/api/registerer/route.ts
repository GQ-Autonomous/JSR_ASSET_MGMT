import { NextRequest, NextResponse } from "next/server";
import pool from "../../db/db";
import cloudinary from "../../db/cloudinary"; // Ensure this path is correct

interface FormDatatype {
  toilet_ref_name: string;
  toilet_type: number;
  frequency: number;
  locality_id: number;
  business_id: number;
  created_on: Date;
  created_by: number;
  image1: string;
  image2?: string;
  latitude: number;
  longitude: number;
  status: number;
}

const uploadImageToCloudinary = async (base64Image: string) => {
  const result = await cloudinary.uploader.upload(base64Image, {
    folder: "trees/guest",
  });
  return result.secure_url;
};

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();

    // Upload image1 to Cloudinary
    let image1Url = null;
    const image1 = formData.get("image1") as string;
    if (image1) {
      image1Url = await uploadImageToCloudinary(image1);
    }

    // Upload image2 to Cloudinary if provided
    let image2Url = null;
    const image2 = formData.get("image2") as string;
    if (image2) {
      image2Url = await uploadImageToCloudinary(image2);
    }

    // const createdOn = new Date();

    const data: FormDatatype = {
      toilet_ref_name: formData.get("toilet_ref_name") as string,
      toilet_type: Number(formData.get("toilet_type_id")),
      frequency: Number(formData.get("frequency")),
      locality_id: Number(formData.get("locality_id")),
      business_id: Number(formData.get("business_id")),
      created_by: Number(formData.get("created_by")),
      image1: image1Url,
      image2: image2Url,
      latitude: Number(formData.get("latitude")),
      longitude: Number(formData.get("longitude")),
      status: 1,
    };

    console.log(data);
    

    const query = `
      INSERT INTO toilet_master (
        toilet_ref_name,
        toilet_type,
        frequency,
        locality_id,
        business_id,
        created_by,
        image1,
        image2,
        latitude,
        longitude,
        status
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?
      );
    `;
    const values = [
      data.toilet_ref_name,
      data.toilet_type,
      data.frequency,
      data.locality_id,
      data.business_id,
      data.created_by,
      data.image1,
      data.image2,
      data.latitude,
      data.longitude,
      data.status,
    ];

    const [result] = await pool.query(query, values);

    // Get the last inserted ID
    const [rows] = await pool.query('SELECT LAST_INSERT_ID() AS id');
    const insertedId = rows[0].id;

    return NextResponse.json({
      message: "Data received and inserted successfully",
      id: insertedId,
    });
  } catch (error) {
    console.error("Error inserting data:", error);
    return NextResponse.json(
      { message: (error as Error).message },
      { status: 500 }
    );
  }
}
