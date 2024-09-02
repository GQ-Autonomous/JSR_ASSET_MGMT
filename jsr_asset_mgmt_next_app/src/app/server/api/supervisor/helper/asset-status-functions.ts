import { getConnection } from "@/app/server/db/db";

export const getAssetById = async (asset_id: string) => {
  try {
    const pool = await getConnection();
    const results = await pool.request().query(
      `select dz.zone, da.area, dl.locality, dal.name, dal.code, dal.frequency, dal.status
from tata_asset_mgmt.jusco_asset_mgmt.data_asset_list as dal
join tata_asset_mgmt.jusco_asset_mgmt.data_locality as dl on dl.id = dal.locality_id
join tata_asset_mgmt.jusco_asset_mgmt.data_area as da on da.id = dl.area_id
join tata_asset_mgmt.jusco_asset_mgmt.data_zone as dz on dz.id = da.zone_id
where 
dal.code = '${asset_id}'`
    );

    const asset = results.recordset;

    return asset;
  } catch (error) {
    console.error("Error fetching asset by ID:", error);
    throw new Error("Failed to retrieve asset by ID.");
  }
};

export const getAssetByName = async (asset_name: string) => {
  try {
    const pool = await getConnection();
    const results = await pool
      .request()
      .query(
        `select dz.zone, da.area, dl.locality, dal.name, dal.code, dal.frequency, dal.status
from tata_asset_mgmt.jusco_asset_mgmt.data_asset_list as dal
join tata_asset_mgmt.jusco_asset_mgmt.data_locality as dl on dl.id = dal.locality_id
join tata_asset_mgmt.jusco_asset_mgmt.data_area as da on da.id = dl.area_id
join tata_asset_mgmt.jusco_asset_mgmt.data_zone as dz on dz.id = da.zone_id
where 
dal.name = '${asset_name}'`
      );

    const asset = results.recordset;

    return asset;
  } catch (error) {
    console.error("Error fetching asset by name:", error);
    throw new Error("Failed to retrieve asset by name.");
  }
};

export const getAssetByStatus = async (asset_status: string) => {
  try {
    const pool = await getConnection();
    const results = await pool
      .request()
      .query(
        `select dz.zone, da.area, dl.locality, dal.name, dal.code, dal.frequency, dal.status
from tata_asset_mgmt.jusco_asset_mgmt.data_asset_list as dal
join tata_asset_mgmt.jusco_asset_mgmt.data_locality as dl on dl.id = dal.locality_id
join tata_asset_mgmt.jusco_asset_mgmt.data_area as da on da.id = dl.area_id
join tata_asset_mgmt.jusco_asset_mgmt.data_zone as dz on dz.id = da.zone_id
where 
dal.status = '${asset_status}'`
      );

    const asset = results.recordset;

    return asset;
  } catch (error) {
    console.error("Error fetching asset by status:", error);
    throw new Error("Failed to retrieve asset by status.");
  }
};


export const getAssetByLocality = async (locality_id: string) => {
  try {
    const pool = await getConnection();
    const results = await pool
      .request()
      .query(`select dz.zone, da.area, dl.locality, dal.name, dal.code, dal.frequency, dal.status
from tata_asset_mgmt.jusco_asset_mgmt.data_asset_list as dal
join tata_asset_mgmt.jusco_asset_mgmt.data_locality as dl on dl.id = dal.locality_id
join tata_asset_mgmt.jusco_asset_mgmt.data_area as da on da.id = dl.area_id
join tata_asset_mgmt.jusco_asset_mgmt.data_zone as dz on dz.id = da.zone_id
where 
dal.locality_id = '${locality_id}'`);

    const asset = results.recordset;

    return asset;
  } catch (error) {
    console.error("Error fetching asset by status:", error);
    throw new Error("Failed to retrieve asset by status.");
  }
};
