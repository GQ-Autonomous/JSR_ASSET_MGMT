"use client";

import { useAppSelector } from "@/lib/hooks";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  Heading,
  Select,
  Stack,
  VStack,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Text,
  useDisclosure,
  Icon,
} from "@chakra-ui/react";
import Image from "next/image";
import { FaQrcode } from "react-icons/fa";
import { useRef, useState, useEffect } from "react";
import { Camera } from "react-camera-pro";
import axios from "axios";
import AddLocation from "@/components/AddLocation";
import QrCodeScannerModal from "@/components/QrCodeScannerModal";

interface FormData {
  serial_number: string;
  city_id: number;
  business_id: number;
  zone_id: number;
  cluster_id: number;
  locality_id: number;
  toilet_type_id: number;
  toilet_ref_name: string;
  frequency: number;
  image1: string;
  image2?: string;
  user_id: number;
  latitude: number | null;
  longitude: number | null;
  remark1: string;
  remark2?: string;
}

const RegisterToilet = () => {
  const user = useAppSelector((store) => store.user);
  const [formData, setFormData] = useState<FormData>({
    serial_number: "",
    city_id: 0,
    business_id: 0,
    zone_id: 0,
    cluster_id: 0,
    locality_id: 0,
    toilet_type_id: 0,
    toilet_ref_name: "",
    frequency: 1,
    image1: "",
    image2: "",
    user_id: user.id, // Example user_id, replace with actual user_id
    latitude: null,
    longitude: null,
    remark1: "",
    remark2: "",
  });

  const [cities, setCities] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [zones, setZones] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [localities, setLocalities] = useState([]);
  const [toilet_types, setToilet_types] = useState([]);

  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<"image1" | "image2">(
    "image1"
  );
  const camera = useRef<any>(null);

  const {
    isOpen: isLocationModelOpen,
    onOpen: onLocationModalOpen,
    onClose: onLocationModalClose,
  } = useDisclosure();

  const {
    isOpen: isQrCodeModalOpen,
    onOpen: onQrCodeModalOpen,
    onClose: onQrCodeModalClose,
  } = useDisclosure();

  useEffect(() => {
    fetchCities();
    fetchToiletTypes();
  }, []);

  const handleLocationChange = (latitude: number, longitude: number) => {
    setFormData((prevData) => ({
      ...prevData,
      latitude,
      longitude,
    }));
    console.log(latitude, longitude);
  };

  const fetchCities = async () => {
    // Fetch cities from the API and update state
    const response = await fetch("/server/api/registerer/helper/getCity");
    const data = await response.json();
    setCities(data.cities);
  };

  const fetchToiletTypes = async () => {
    // Fetch cities from the API and update state
    const response = await fetch("/server/api/registerer/helper/getToiletType");
    const data = await response.json();
    setToilet_types(data.toilet_type);
  };

  const fetchBusinesses = async (city_id: number) => {
    // Fetch businesses from the API based on the selected city_id and update state
    const response = await axios.post(
      `/server/api/registerer/helper/getBusiness`,
      { city_id }
    );
    // const data = await response.json();
    console.log(response);

    setBusinesses(response.data.business);
  };

  const fetchZones = async (business_id: number) => {
    // Fetch zones from the API based on the selected business_id and update state
    const response = await axios.post(`/server/api/registerer/helper/getZone`, {
      business_id,
    });
    // const data = await response.json();
    setZones(response.data.zones);
  };

  const fetchClusters = async (zone_id: number) => {
    // Fetch clusters from the API based on the selected zone_id and update state
    const response = await axios.post(
      `/server/api/registerer/helper/getCluster`,
      { zone_id }
    );
    // const data = await response.json();
    setClusters(response.data.clusters);
  };

  const fetchLocalities = async (cluster_id: number) => {
    // Fetch localities from the API based on the selected cluster_id and update state
    const response = await axios.post(
      `/server/api/registerer/helper/getLocality`,
      { cluster_id }
    );
    // const data = await response.json();
    setLocalities(response.data.localities);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === "frequency" ? Number(value) : value,
    }));

    // Fetch dependent data based on the selected value
    if (name === "city_id") {
      fetchBusinesses(Number(value));
      setBusinesses([]);
      setZones([]);
      setClusters([]);
      setLocalities([]);
    } else if (name === "business_id") {
      fetchZones(Number(value));
      setZones([]);
      setClusters([]);
      setLocalities([]);
    } else if (name === "zone_id") {
      fetchClusters(Number(value));
      setClusters([]);
      setLocalities([]);
    } else if (name === "cluster_id") {
      fetchLocalities(Number(value));
      setLocalities([]);
    }
  };

  const handleTakePhoto = async () => {
    const photo = await camera.current.takePhoto();
    if (currentImage === "image1") {
      setImage1(photo);
      setFormData((prevData) => ({ ...prevData, image1: photo }));
    } else if (currentImage === "image2") {
      setImage2(photo);
      setFormData((prevData) => ({ ...prevData, image2: photo }));
    }
    setIsModalOpen(false); // Close modal after taking photo
  };

  const handleOpenModal = (imageType: "image1" | "image2") => {
    setCurrentImage(imageType);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.image1) {
      alert("Image 1 is required.");
      return;
    }

    const formDataToSubmit = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      formDataToSubmit.append(key, value);
    });

    try {
      console.log(formDataToSubmit);
      
      const response = await axios.post(
        "/server/api/registerer",
        formDataToSubmit,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response.data);
    } catch (error) {
      console.error("Error submitting the form", error);
    }
  };

  const handleScanSuccess = (scannedValue: any) => {
    console.log(scannedValue);

    setFormData((prevData) => ({
      ...prevData,
      serial_number: scannedValue.serial_number,
    }));
  };

  return (
    <Box maxW="xl" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="lg">
      <Heading as="h2" size="lg" mb={4} textAlign="center">
        Add new toilet
      </Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
          {/* <FormControl isRequired>
            <FormLabel>Toilet serial number</FormLabel>
            <div className="flex gap-4">
              <Input
                type="text"
                name="serial_number"
                value={formData.serial_number}
                placeholder="Scan qr code for serial number"
                isReadOnly
              />
              <Button onClick={onQrCodeModalOpen}>
                <Icon as={FaQrcode} />
              </Button>
            </div>
          </FormControl> */}
          <FormControl
            isRequired
            display={"flex"}
            justifyContent={"space-between"}
          >
            <FormLabel>Select City </FormLabel>
            <Select
              placeholder="Select City"
              name="city_id"
              width={"50%"}
              onChange={handleInputChange}
              value={formData.city_id || ""}
            >
              {cities.map((city: { id: number; name: string }) => (
                <option value={city.id} key={city.id}>
                  {city.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl
            isRequired
            display={"flex"}
            justifyContent={"space-between"}
          >
            <FormLabel>Select Business </FormLabel>
            <Select
              placeholder="Select Business"
              name="business_id"
              width={"50%"}
              onChange={handleInputChange}
              value={formData.business_id || ""}
              isDisabled={!formData.city_id}
            >
              {businesses.map((business: { id: number; name: string }) => (
                <option value={business.id} key={business.id}>
                  {business.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl
            isRequired
            display={"flex"}
            justifyContent={"space-between"}
          >
            <FormLabel>Select Zone </FormLabel>
            <Select
              placeholder="Select Zone"
              name="zone_id"
              width={"50%"}
              onChange={handleInputChange}
              value={formData.zone_id || ""}
              isDisabled={!formData.business_id}
            >
              {zones.map((zone: { id: number; name: string }) => (
                <option value={zone.id} key={zone.id}>
                  {zone.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl
            isRequired
            display={"flex"}
            justifyContent={"space-between"}
          >
            <FormLabel>Select Cluster </FormLabel>
            <Select
              placeholder="Select Cluster"
              name="cluster_id"
              width={"50%"}
              onChange={handleInputChange}
              value={formData.cluster_id || ""}
              isDisabled={!formData.zone_id}
            >
              {clusters.map((cluster: { id: number; name: string }) => (
                <option value={cluster.id} key={cluster.id}>
                  {cluster.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl
            isRequired
            display={"flex"}
            justifyContent={"space-between"}
          >
            <FormLabel>Select Locality </FormLabel>
            <Select
              placeholder="Select Locality"
              name="locality_id"
              width={"50%"}
              onChange={handleInputChange}
              value={formData.locality_id || ""}
              isDisabled={!formData.cluster_id}
            >
              {localities.map((locality: { id: number; name: string }) => (
                <option value={locality.id} key={locality.id}>
                  {locality.name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl
            isRequired
            display={"flex"}
            justifyContent={"space-between"}
          >
            <FormLabel>Select Toilet Type </FormLabel>
            <Select
              placeholder="Select Toilet Type"
              name="toilet_type_id"
              width={"50%"}
              onChange={handleInputChange}
              value={formData.toilet_type_id || ""}
            >
              {/* Replace with actual toilet types data */}
              {toilet_types.map((type: { id: number; type_name: string }) => (
                <option key={type.id} value={type.id}>
                  {type.type_name}
                </option>
              ))}
            </Select>
          </FormControl>

          <FormControl
            isRequired
            display={"flex"}
            justifyContent={"space-between"}
          >
            <FormLabel>Toilet Reference Name</FormLabel>
            <Input
              type="text"
              name="toilet_ref_name"
              width={"50%"}
              onChange={handleInputChange}
              value={formData.toilet_ref_name}
            />
          </FormControl>

          <FormControl
            isRequired
            display={"flex"}
            justifyContent={"space-between"}
          >
            <FormLabel>Frequency</FormLabel>
            <Input
              type="number"
              name="frequency"
              width={"50%"}
              onChange={handleInputChange}
              value={formData.frequency}
            />
          </FormControl>

          <FormControl
            isRequired
            display={"flex"}
            justifyContent={"space-between"}
          >
            <FormLabel>Remark 1</FormLabel>
            <Input
              type="text"
              name="remark1"
              width={"50%"}
              onChange={handleInputChange}
              value={formData.remark1}
            />
          </FormControl>

          <FormControl display={"flex"} justifyContent={"space-between"}>
            <FormLabel>Remark 2</FormLabel>
            <Input
              type="text"
              name="remark2"
              width={"50%"}
              onChange={handleInputChange}
              value={formData.remark2}
            />
          </FormControl>

          <Box
            display={"flex"}
            gap={4}
            flexDir={"column"}
            justifyContent={"space-around"}
          >
            <Box display={"flex"} flexDir={"column"} gap={4}>
              <Button
                onClick={() => handleOpenModal("image1")}
                type="button"
                width={"200px"}
              >
                Take Image 1
              </Button>
              {image1 && (
                <Image src={image1} width={200} height={100} alt="image 1" />
              )}
            </Box>
            <Box display={"flex"} flexDir={"column"} gap={4}>
              <Button
                onClick={() => handleOpenModal("image2")}
                type="button"
                width={"200px"}
              >
                Take Image 2
              </Button>
              {image2 && (
                <Image src={image2} width={200} height={100} alt="image 2" />
              )}
            </Box>
          </Box>

          {formData.latitude && formData.longitude && (
            <div>
              <Text>Latitude: {formData.latitude}</Text>
              <Text>Longitude: {formData.longitude}</Text>
            </div>
          )}

          <Button
            type="button"
            colorScheme="blue"
            variant="outline"
            onClick={onLocationModalOpen}
          >
            Add Location
          </Button>

          <Button type="submit" colorScheme="blue">
            Submit
          </Button>
        </Stack>
      </form>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Take Photo</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box h="200px" mb={4}>
              <Camera
                ref={camera}
                errorMessages={{
                  noCameraAccessible:
                    "No camera device accessible. Please connect your camera or try a different browser.",
                  permissionDenied:
                    "Permission denied. Please refresh and give camera permission.",
                  switchCamera:
                    "It is not possible to switch camera to different one because there is only one video device accessible.",
                  canvas: "Canvas is not supported.",
                }}
              />
            </Box>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleCloseModal}>
              Cancel
            </Button>
            <Button colorScheme="green" onClick={handleTakePhoto}>
              Take Photo
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isLocationModelOpen} onClose={onLocationModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Set Location</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddLocation handleLocationChange={handleLocationChange} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={onLocationModalClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <QrCodeScannerModal
        isOpen={isQrCodeModalOpen}
        onClose={onQrCodeModalClose}
        onScanSuccess={handleScanSuccess}
      />
    </Box>
  );
};

export default RegisterToilet;
