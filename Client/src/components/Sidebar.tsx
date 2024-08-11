import React, { useState } from "react";
import {
  Box,
  Button,
  VStack,
  Input,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
  Link,
} from "@chakra-ui/react";
import FileStorage from "../services/uploadRetriev";
const fileStorage = new FileStorage();

const Sidebar: React.FC = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileId, setFileId] = useState<string>("");
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("");
  const toast = useToast();

  // Modal controls
  const {
    isOpen: isUploadOpen,
    onOpen: onUploadOpen,
    onClose: onUploadClose,
  } = useDisclosure();
  const {
    isOpen: isRetrieveOpen,
    onOpen: onRetrieveOpen,
    onClose: onRetrieveClose,
  } = useDisclosure();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.[0]) {
      setSelectedFile(event.target.files[0]);
    }
  };

  const handleUpload = async () => {
    if (selectedFile) {
      try {
        console.log(selectedFile);
        const file = await fileStorage.storeFile(selectedFile);
        toast({
          title: `File stored successfully with ID: ${file.id}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onUploadClose(); // Close the modal after uploading
      } catch (error) {
        toast({
          title: "Error storing file",
          description: error as string,
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      toast({
        title: "No file selected",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleRetrieve = async () => {
    try {
      const fileData = await fileStorage.retrieveFile(parseInt(fileId, 10));
      if (fileData) {
        console.log(fileData);
        setFileName(fileData.name);
        setFileUrl(URL.createObjectURL(fileData.data as Blob));
        // window.open(fileData);
        toast({
          title: "File retrieved successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
        onRetrieveClose(); // Close the modal after retrieving
      } else {
        toast({
          title: "File not found",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      toast({
        title: "Error retrieving file",
        description: error as string,
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box bgColor="gray.700" width="100%" height="100%" p={4}>
      <VStack spacing={4}>
        <Button variant="outline" colorScheme="teal" onClick={onUploadOpen}>
          Upload Files
        </Button>
        <Button variant="outline" colorScheme="teal" onClick={onRetrieveOpen}>
          Retrieve Files
        </Button>

        <Modal isOpen={isUploadOpen} onClose={onUploadClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Upload File</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input type="file" onChange={handleFileChange} />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" onClick={handleUpload}>
                Upload
              </Button>
              <Button variant="outline" ml={3} onClick={onUploadClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        <Modal isOpen={isRetrieveOpen} onClose={onRetrieveClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Retrieve File</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                type="text"
                placeholder="Enter file ID to retrieve"
                value={fileId}
                onChange={(e) => setFileId(e.target.value)}
              />
            </ModalBody>
            <ModalFooter>
              <Button colorScheme="teal" onClick={handleRetrieve}>
                Retrieve
              </Button>
              <Button variant="outline" ml={3} onClick={onRetrieveClose}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {fileUrl && (
          <Link href={fileUrl} isExternal>
            {fileName}
            <img src={fileUrl} alt="retrieved file" />
          </Link>
        )}
      </VStack>
    </Box>
  );
};

export default Sidebar;
