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
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";

const AssetStatusPage = () => {
  const [assetID, setAssetId] = useState('');
  const [assetType, setAssetType] = useState('');
  const [localities, setLocalities] = useState([]);
  const [localityId, setLocalityId] = useState('');
  const [data, setData] = useState([]);
  const [showTable, setShowTable] = useState(false);
  const [supervisors, setSupervisors] = useState([]);
  const [supervisor, setSupervisor] = useState('');
  const toast = useToast();

  const getLocalities = async () => {
    try {
      const res = await axios.post(
        "/server/api/supervisor/asset-status/getAreaLocalities", 
        { user_id: supervisor }
      );
      setLocalities(res.data.areaAndLocalities);
    } catch (error) {
      console.error("Error fetching localities:", error);
    }
  };

  const getData = async (event) => {
    event.preventDefault(); // Prevent form submission refresh

    // Validation to ensure all three fields are filled
    if (assetID) {
      try {
        const filters = {
          asset_id: assetID
        };
        
        const res = await axios.post("/server/api/supervisor/asset-status/", filters);
        setData(res.data.assets);
        setShowTable(true);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    else if (!supervisor || !localityId || !assetType) {
      toast({
        title: "Error",
        description: "Please fill out Supervisor, Locality, and Asset Type.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      const filters = {
        locality_id: localityId,
        status: assetType,
        user_id: supervisor,
      };
      
      const res = await axios.post("/server/api/supervisor/asset-status/", filters);
      setData(res.data.assets);
      setShowTable(true);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  
  const getSupervisors = async () => {
    try {
      const res = await axios.get(
        "/server/api/supervisor/asset-status/getSupervisors"
      );
      setSupervisors(res.data.supervisors);
    } catch (error) {
      console.error("Error fetching supervisors:", error);
    }
  };

  useEffect(() => {
    getSupervisors();
  }, []);

  const handleAssetIdChange = (e) => {
    setAssetId(e.target.value);
    setSupervisor('');  // Clear other fields
    setLocalityId('');
    setAssetType('');
  };

  const handleSupervisorChange = async (e) => {
    const selectedSupervisor = e.target.value;
    setSupervisor(selectedSupervisor); // Update supervisor state
    setAssetId('');  // Clear Asset ID field
    setLocalityId(''); // Clear locality selection
    setAssetType('');  // Clear asset type selection
    setLocalities([]); // Clear localities before fetching new ones
    
    // Fetch new localities based on the selected supervisor
    try {
      const res = await axios.post(
        "/server/api/supervisor/asset-status/getAreaLocalities", 
        { user_id: selectedSupervisor }  // Use the new supervisor value directly
      );
      setLocalities(res.data.areaAndLocalities);
    } catch (error) {
      console.error("Error fetching localities:", error);
    }
  };
  

  const handleLocalityChange = async (e) => {
    setLocalityId(e.target.value);
    setAssetId('');  // Clear Asset ID field
  };

  const handleAssetTypeChange = (e) => {
    setAssetType(e.target.value);
    setAssetId('');  // Clear Asset ID field
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
          <FormControl w={"400px"} isDisabled={supervisor || localityId || assetType}>
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
          <FormControl w={"400px"} isRequired isDisabled={assetID}>
            <FormLabel>Select Supervisor</FormLabel>
            <Select
              value={supervisor}
              onChange={handleSupervisorChange}
            >
              <option value="">Select supervisor</option>
              {supervisors.map((item) => (
                <option key={item.id} value={item.id}>
                  {`${item.user_name}`}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl w={"400px"} isRequired isDisabled={assetID || !supervisor}>
            <FormLabel>Select Locality</FormLabel>
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
          <FormControl w={"400px"} isRequired isDisabled={assetID || !supervisor}>
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
