import { NextRequest, NextResponse } from "next/server";
import {
  getAssetById,
  getAssetByLocality,
  getAssetByName,
  getAssetByStatus,
} from "../helper/asset-status-functions";

export async function POST(req: NextRequest) {
  console.log("hii")
  try {
    const { asset_id, asset_name, asset_status, locality_id } = await req.json();
    console.log({ asset_id, asset_name, asset_status, locality_id });
    

    if (asset_id) {
      const asset = await getAssetById(asset_id);
      return NextResponse.json({ assets: asset }, { status: 200 });
    } else if (asset_name) {
      const asset = await getAssetByName(asset_name);
      return NextResponse.json({ assets: asset }, { status: 200 });
    } else if (asset_status) {
      const asset = await getAssetByStatus(asset_status);
      return NextResponse.json({ assets: asset }, { status: 200 });
    } 
    else if (locality_id) {
      const asset = await getAssetByLocality(locality_id);
      return NextResponse.json({ assets: asset }, { status: 200 });
    }
    else {
      return NextResponse.json(
        { error: "No valid parameters provided." },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
