"use client";

import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { Box, Button, Select, VStack, Text, Center } from "@chakra-ui/react";
import QrScanIcon from "./../../../../../../public/icons/qr-scan.svg";
import Image from "next/image";

const ScanQrCleaner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
  const [cameras, setCameras] = useState<QrScanner.Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [isCameraEnable, setIsCameraEnable] = useState<boolean>(false);

  useEffect(() => {
    const initQrScanner = async () => {
      const availableCameras = await QrScanner.listCameras(true);
      setCameras(availableCameras);

      if (videoRef.current && selectedCamera) {
        const scanner = new QrScanner(
          videoRef.current,
          (result) => {
            console.log("decoded qr code:", result.data);
            // Log the message on successful scan
            console.log("use client");
          },
          { preferredCamera: selectedCamera }
        );
        setQrScanner(scanner);
        await scanner.start();
      }
    };

    initQrScanner();

    return () => {
      if (qrScanner) {
        qrScanner.destroy();
      }
    };
  }, [selectedCamera]);

  const startScanning = async () => {
    if (qrScanner) {
      await qrScanner.start();
    }
  };

  return (
    <VStack spacing={4} border="1px" borderColor="gray.200" p={3}>
      {isCameraEnable ? (
        <Center>
          <Box width={["100%", "50%"]} height={["300px", "auto"]}>
            <video ref={videoRef} style={{ width: "100%", height: "100%" }}></video>
          </Box>
        </Center>
      ) : (
        <Image priority src={QrScanIcon} alt="QR scan icon" />
      )}

      <Box display={"flex"} gap={4}>
        <Text>Select camera</Text>
        <Select
          placeholder="Select camera"
          onChange={(e) => {
            setSelectedCamera(e.target.value);
            setIsCameraEnable(true);
          }}
        >
          {cameras.map((camera) => (
            <option key={camera.id} value={camera.id}>
              {camera.label}
            </option>
          ))}
        </Select>
      </Box>

      <Box display={"flex"} gap={4}>
        <Button colorScheme="gray" onClick={startScanning}>
          Start scanning
        </Button>
      </Box>
    </VStack>
  );
};

export default ScanQrCleaner;
