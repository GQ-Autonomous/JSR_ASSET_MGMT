import { getConnection } from "@/app/server/db/db";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    // const { user_id }: { user_id: number } = await req.json();
    const pool = await getConnection();
    const result = await pool.request()
      .query(`SELECT DISTINCT dl.area_id, da.area, dal.locality_id, dl.locality 
FROM tata_asset_mgmt.jusco_asset_mgmt.matrix_user_asset_id as mua
join tata_asset_mgmt.jusco_asset_mgmt.data_asset_list as dal on dal.id = mua.asset_id
join tata_asset_mgmt.jusco_asset_mgmt.data_locality as dl on dl.id = dal.locality_id
join tata_asset_mgmt.jusco_asset_mgmt.data_area as da on da.id = dl.area_id
where 
mua.user_id = '53'`);
    // console.log(user_id);

    const areaAndLocalities = result.recordset;
    return NextResponse.json(
      { areaAndLocalities: areaAndLocalities },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching area and localities", error);
    throw new Error("Failed to retrieve area and localities");
  }
}
