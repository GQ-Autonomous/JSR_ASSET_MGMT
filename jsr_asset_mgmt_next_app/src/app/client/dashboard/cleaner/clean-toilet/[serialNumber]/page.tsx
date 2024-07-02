"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import RadioQuestion from "@/components/RadioQuestion";
import { useParams } from "next/navigation";
import { Camera } from "react-camera-pro";
import Image from "next/image";

const CleanToilet = () => {
  const [latitude, setLatitude] = useState<number>(0);
  const [longitude, setLongitude] = useState<number>(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [questions, setQuestions] = useState<
    Array<{ id: string; question: string; options: string[] }>
  >([]);
  const [image1, setImage1] = useState<string | null>(null);
  const [image2, setImage2] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImage, setCurrentImage] = useState<"image1" | "image2">(
    "image1"
  );
  const camera = useRef<any>(null); // Adjust the ref type as per the library documentation

  const { serialNumber } = useParams();

  useEffect(() => {
    // Simulating API call to fetch questions
    const fetchQuestions = async () => {
      // Replace with actual API call to fetch questions
      const fetchedQuestions = [
        {
          id: "1",
          question: "Was the toilet cleaned?",
          options: ["Yes", "No"],
        },
      ];
      setQuestions(fetchedQuestions);
    };

    fetchQuestions();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      });
    }
  }, []);

  const handleRadioChange = (value: string, id: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

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

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Check if all questions are answered
    const allQuestionsAnswered = questions.every((q) => formData[q.id]);
    if (!allQuestionsAnswered) {
      alert("Please answer all questions");
      return;
    }

    // Construct data to submit
    const dataToSubmit = {
      assetId: serialNumber,
      location: {
        latitude,
        longitude,
      },
      responses: questions.map((q) => ({
        questionId: q.id,
        answerId: formData[q.id],
      })),
      images: [image1, image2].filter((img) => img !== null) as string[], // Filter out null values
    };

    console.log("Data to submit:", dataToSubmit);

    // Example: Submit API call
    // fetch('/api/submit-form', {
    //   method: 'POST',
    //   body: JSON.stringify(dataToSubmit),
    // });
  };

  return (
    <Box w="full">
      <VStack p={6} spacing={6} w="full">
        <form
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
          onSubmit={handleSubmit}
        >
          <Box display="flex" flexDir={"column"} gap={6} w="full">
            <FormControl isRequired>
              <FormLabel>AssetID</FormLabel>
              <Input type="text" readOnly value={serialNumber} />
            </FormControl>
            <FormControl isRequired>
              <FormLabel>Your Location</FormLabel>
              <Input
                type="text"
                readOnly
                value={`Latitude: ${latitude} and Longitude: ${longitude}`}
              />
            </FormControl>
            {questions.map((q) => (
              <RadioQuestion
                key={q.id}
                id={q.id}
                question={q.question}
                options={q.options}
                onChange={handleRadioChange}
              />
            ))}
          </Box>
          <Box display={"flex"} flexDir={"column"} gap={4}>
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
            <Box>
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

          <Button type="submit">Submit</Button>
        </form>
      </VStack>
    </Box>
  );
};

export default CleanToilet;
