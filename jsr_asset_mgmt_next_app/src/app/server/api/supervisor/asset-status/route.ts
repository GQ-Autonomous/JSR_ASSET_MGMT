import { NextRequest, NextResponse } from "next/server";
import {
  getAssetById,
  getAssetByLocality,
  getAssetByName,
  getAssetByStatus,
} from "../helper/asset-status-functions";
import { getConnection } from "@/app/server/db/db";

// export async function POST(req: NextRequest) {
//   console.log("hii")
//   try {
//     const { asset_id, asset_name, asset_status, locality_id } = await req.json();
//     console.log({ asset_id, asset_name, asset_status, locality_id });

//     if (asset_id) {
//       const asset = await getAssetById(asset_id);
//       return NextResponse.json({ assets: asset }, { status: 200 });
//     } else if (asset_name) {
//       const asset = await getAssetByName(asset_name);
//       return NextResponse.json({ assets: asset }, { status: 200 });
//     } else if (asset_status) {
//       const asset = await getAssetByStatus(asset_status);
//       return NextResponse.json({ assets: asset }, { status: 200 });
//     }
//     else if (locality_id) {
//       const asset = await getAssetByLocality(locality_id);
//       return NextResponse.json({ assets: asset }, { status: 200 });
//     }
//     else {
//       return NextResponse.json(
//         { error: "No valid parameters provided." },
//         { status: 400 }
//       );
//     }
//   } catch (error) {
//     console.error("Error processing request:", error);
//     return NextResponse.json(
//       { error: "Internal server error" },
//       { status: 500 }
//     );
//   }
// }

// import { getConnection } from "@/app/server/db/db";
// import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    // const { user_id }: { user_id: number } = await req.json();
    const { locality_id, status, user_id, asset_id } = await req.json();
    console.log({ locality_id, status, user_id });

    const pool = await getConnection();
    if (asset_id) {
      const asset = await getAssetById(asset_id);
      return NextResponse.json({ assets: asset }, { status: 200 });
    } else {
      const result = await pool.request().query(`select 
        dz.zone, da.area, dl.locality, dal.name, dal.code, dal.frequency, dal.status
        from tata_asset_mgmt.jusco_asset_mgmt.data_asset_list as dal
        join tata_asset_mgmt.jusco_asset_mgmt.data_locality as dl on dl.id = dal.locality_id
        join tata_asset_mgmt.jusco_asset_mgmt.data_area as da on da.id = dl.area_id
        join tata_asset_mgmt.jusco_asset_mgmt.data_zone as dz on dz.id = da.zone_id
        join tata_asset_mgmt.jusco_asset_mgmt.matrix_user_asset_id as mua on mua.asset_id = dal.id
        where 
        dal.locality_id =' ${locality_id}' AND
        dal.status = '${status}' AND
        mua.user_id = ${user_id}`);
      // console.log(user_id);

      const assets = result.recordset;
      return NextResponse.json({ assets: assets }, { status: 200 });
    }
  } catch (error) {
    console.error("Error fetching area and localities", error);
    throw new Error("Failed to retrieve area and localities");
  }
}
