"use client";

import AssetStatusCards from "@/components/AssetStatusCard";
import TableForAssetStatus from "@/components/TableForAssetStatus";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

const AssetStatusPage = () => {
  const [assetID, setAssetId] = useState('');
  const [assetName, setAssetName] = useState('');
  const [assetType, setAssetType] = useState('');
  const [localities, setLocalities] = useState([]);
  const [localityId, setLocalityId] = useState('');
  const [data, setData] = useState([]);
  const [showTable, setShowTable] = useState(false)

  const getLocalities = async () => {
    try {
      const res = await axios.get(
        "/server/api/supervisor/asset-status/getAreaLocalities"
      );
      setLocalities(res.data.areaAndLocalities);
    } catch (error) {
      console.error("Error fetching localities:", error);
    }
  };

  const getData = async (event) => {
    event.preventDefault(); // Prevent form submission refresh
    try {
      const filters = {};

      if (localityId) filters.locality_id = localityId;
      if (assetID) filters.asset_id = assetID;
      if (assetName) filters.asset_name = assetName;
      if (assetType) filters.asset_status = assetType;

      const res = await axios.post("/server/api/supervisor/asset-status/", filters);
      setData(res.data.assets);
      console.log(res.data.assets);
      setShowTable(true)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    getLocalities();
  }, []);

  const handleAssetIdChange = (e) => {
    setAssetId(e.target.value);
    setAssetName('');  // Clear other fields
    setAssetType('');
    setLocalityId('');
  };

  const handleAssetNameChange = (e) => {
    setAssetName(e.target.value);
    setAssetId('');  // Clear other fields
    setAssetType('');
    setLocalityId('');
  };

  const handleAssetTypeChange = (e) => {
    setAssetType(e.target.value);
    setAssetId('');  // Clear other fields
    setAssetName('');
    setLocalityId('');
  };

  const handleLocalityChange = (e) => {
    setLocalityId(e.target.value);
    setAssetId('');  // Clear other fields
    setAssetName('');
    setAssetType('');
  };

  // Use Chakra UI's `useBreakpointValue` to determine if the screen size is mobile or tablet
  const isMobileOrTablet = useBreakpointValue({ base: true, md: true, lg: false });

  return (
    <Box>
      <form onSubmit={getData}>
        <Box
          display={"flex"}
          flexWrap={"wrap"}
          gap={4}
          paddingY={4}
          alignItems={"center"}
        >
          <FormControl w={"400px"}>
            <FormLabel>Asset ID</FormLabel>
            <Input
              type="text"
              placeholder="Enter asset id"
              id="asset_id"
              value={assetID}
              onChange={handleAssetIdChange}
            />
          </FormControl>
          <Text textStyle={"bold"}>OR</Text>
          <FormControl w={"400px"}>
            <FormLabel>Asset Name</FormLabel>
            <Input
              type="text"
              placeholder="Enter asset name"
              id="asset_name"
              value={assetName}
              onChange={handleAssetNameChange}
            />
          </FormControl>
          <Text textStyle={"bold"}>OR</Text>
          <FormControl w={"400px"}>
            <FormLabel>Asset Type</FormLabel>
            <Select
              value={assetType}
              onChange={handleAssetTypeChange}
            >
              <option value="">Select type</option>
              <option value={"ACTIVE"}>Active</option>
              <option value={"INACTIVE"}>Inactive</option>
            </Select>
          </FormControl>
          <Text textStyle={"bold"}>OR</Text>
          <FormControl w={"400px"}>
            <FormLabel>Select locality</FormLabel>
            <Select
              value={localityId}
              onChange={handleLocalityChange}
            >
              <option value="">Select locality</option>
              {localities.map((item) => (
                <option key={item.locality_id} value={item.locality_id}>
                  {`${item.area} -- ${item.locality}`}
                </option>
              ))}
            </Select>
          </FormControl>
          <Button colorScheme="blue" type="submit">
            Search
          </Button>
        </Box>
      </form>
      {!isMobileOrTablet && showTable && <TableForAssetStatus tableData={data} />}
      {isMobileOrTablet && <AssetStatusCards tableData={data} />}
    </Box>
  );
};

export default AssetStatusPage;
