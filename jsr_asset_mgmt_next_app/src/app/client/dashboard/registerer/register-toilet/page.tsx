"use client";

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
} from "@chakra-ui/react";
import Image from "next/image";
import { useRef, useState } from "react";
import { Camera } from "react-camera-pro";

interface FormData {
  city_id: number;
  business_id: number;
  zone_id: number;
  cluster_id: number;
  locality_id: number;
  image1: string;
  image2?: string;
}

const RegisterToilet = () => {
  const [formData, setFormData] = useState<FormData>({
    city_id: 0,
    business_id: 0,
    zone_id: 0,
    cluster_id: 0,
    locality_id: 0,
    image1: "",
    image2: "",
  });

  const [cities, setCities] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [zones, setZones] = useState([]);
  const [clusters, setClusters] = useState([]);
  const [localities, setLocalities] = useState([]);

  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<"image1" | "image2">(
    "image1"
  );
  const camera = useRef<any>(null);

  const handleTakePhoto = async () => {
    const photo = await camera.current.takePhoto();
    if (currentImage === "image1") {
      setImage1(photo);
    } else if (currentImage === "image2") {
      setImage2(photo);
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

  const handleSubmit = () => {
    console.log(formData);
  };
  return (
    <Box maxW="xl" mx="auto" mt={8} p={6} borderWidth="1px" borderRadius="lg">
      <Heading as="h2" size="lg" mb={4} textAlign="center">
        Add new toilet
      </Heading>
      <form onSubmit={handleSubmit}>
        <Stack spacing={4}>
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
              //   onChange={handleInputChange}
              //   value={formData.city_id || ""}
            >
              {/* {cityData.map((city) => (
                <option value={city.id} key={city.id}>
                  {city.name}
                </option>
              ))} */}
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
              //   onChange={handleInputChange}
              //   value={formData.zone_id || ""}
              //   isDisabled={zoneData.length === 0}
            >
              {/* {zoneData.map((zone) => (
                <option value={zone.id} key={zone.id}>
                  {zone.name}
                </option>
              ))} */}
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
              //   onChange={handleInputChange}
              //   value={formData.cluster_id || ""}
              //   isDisabled={clusterData.length === 0}
            >
              {/* {clusterData.map((cluster) => (
                <option value={cluster.id} key={cluster.id}>
                  {cluster.name}
                </option>
              ))} */}
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
              //   onChange={handleInputChange}
              //   value={formData.locality_id || ""}
              //   isDisabled={localityData.length === 0}
            >
              {/* {localityData.map((locality) => (
                <option value={locality.id} key={locality.id}>
                  {locality.name}
                </option>
              ))} */}
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
              name="bin_type_id"
              width={"50%"}
              //   onChange={handleInputChange}
              //   value={formData.bin_type_id || ""}
            >
              {/* {binTypes.map((bin) => (
                <option key={bin.bin_type_id} value={bin.bin_type_id}>
                  {bin.bin_type_name}
                </option>
              ))} */}
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
              name="bin_ref_name"
              width={"50%"}
              //   onChange={handleInputChange}
              //   value={formData.bin_ref_name}
            />
          </FormControl>

          <FormControl
            isRequired
            display={"flex"}
            justifyContent={"space-between"}
          >
            <FormLabel>Remarks 1</FormLabel>
            <Input
              type="text"
              name="remark1"
              width={"50%"}
              //   onChange={handleInputChange}
              //   value={formData.remark1}
            />
          </FormControl>

          <FormControl display={"flex"} justifyContent={"space-between"}>
            <FormLabel>Remarks 2</FormLabel>
            <Input
              type="text"
              name="remark2"
              width={"50%"}
              //   onChange={handleInputChange}
              //   value={formData.remark2}
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

          <Button
            type="button"
            // onClick={onOpen}
            colorScheme="blue"
            variant="outline"
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
    </Box>
  );
};

export default RegisterToilet;
