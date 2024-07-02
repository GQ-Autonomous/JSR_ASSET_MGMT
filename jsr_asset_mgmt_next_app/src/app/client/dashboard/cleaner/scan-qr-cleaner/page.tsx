"use client";

import React, { useEffect, useRef, useState } from "react";
import QrScanner from "qr-scanner";
import { Box, Button, Select, VStack, Text, Center } from "@chakra-ui/react";
import QrScanIcon from "./../../../../../../public/icons/qr-scan.svg";
import Image from "next/image";
import { useRouter } from "next/navigation";

const ScanQrCleaner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [qrScanner, setQrScanner] = useState<QrScanner | null>(null);
  const [cameras, setCameras] = useState<QrScanner.Camera[]>([]);
  const [selectedCamera, setSelectedCamera] = useState<string>("");
  const [isCameraEnable, setIsCameraEnable] = useState<boolean>(false);
  const [isClient, setIsClient] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);

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
            router.push(
              `/client/dashboard/cleaner/clean-toilet/${result.data}`
            );
          },
          { preferredCamera: selectedCamera }
        );
        setQrScanner(scanner);
        await scanner.start();
      }
    };

    if (isClient) {
      initQrScanner();
    }

    return () => {
      if (qrScanner) {
        qrScanner.destroy();
      }
    };
  }, [selectedCamera, isClient]);

  const startScanning = async () => {
    if (qrScanner) {
      await qrScanner.start();
    }
  };

  return (
    <div>
      <VStack spacing={4} border="1px" borderColor="gray.200" p={3}>
        {isClient && isCameraEnable ? (
          <Center>
            <Box width={["100%", "50%"]} height={["300px", "auto"]}>
              <video
                ref={videoRef}
                style={{ width: "100%", height: "100%" }}
              ></video>
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
    </div>
  );
};

export default ScanQrCleaner;
