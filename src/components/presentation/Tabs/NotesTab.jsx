import React, { useEffect, useState } from "react";
import { usePageStore } from "../stores/usePageStore";
import {
  Avatar,
  Card,
  CardBody,
  CardFooter,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Textarea,
  useDisclosure,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Tooltip,
  Button,
} from "@nextui-org/react";
import { Upload } from "lucide-react";
import { Mic } from "lucide-react";
import AudioComponent from "./AudioComponent";
import { CloudUploadOutlined } from "@mui/icons-material";

const NotesTab = () => {
  const { selectedPage, updateAtIndex } = usePageStore();
  const [notes, setNotes] = useState(selectedPage?.notes || "");
  const [audioFile, setAudioFile] = useState();
  const [audioBlob, setAudioBlob] = useState();
  const [editMode, setEditMode] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const handleFileUpload = (e) => {
    console.log(e);
    const newFile = e.target.files[0];
    setAudioFile(newFile);
  };
  useEffect(() => {
    if (selectedPage?.pageIndex !== null) {
      updateAtIndex(selectedPage?.pageIndex, {
        notes: notes,
      });
    }
  }, [notes]);
  useEffect(() => {
    if (selectedPage) {
      setNotes(selectedPage?.notes);
    }
  }, [selectedPage]);
  return (
    <div className="flex-col">
      <div className="p-4 border-b-2">
        <p className="text-[14px] text-[#05686e]">Notes</p>
      </div>
      <div className="h-[calc(100vh-120px)] overflow-scroll flex flex-col gap-4">
        <Card shadow="md" className="w-full mt-4" isPressable onPress={onOpen}>
          <CardBody className="flex flex-row justify-start w-full gap-4 p-4">
            <div className="flex h-full items-center">
              <Avatar className="" />
            </div>
            <div className="flex flex-col gap-1">
              <span>Martin Luther</span>
              <span className="text-default-500 line-clamp-2">
                Multilingual, Narration, Middle-Aged, Natural{" "}
              </span>
            </div>
          </CardBody>
        </Card>
        <div>
          <div className="flex gap-4 justify-center items-center ">
            <Popover
              classNames={{
                base: [
                  // arrow color
                  "before:bg-transparent",
                ],
                content: ["py-3 px-4 border border-default-200 min-h-[30vh]"],
              }}
              placement="bottom"
            >
              <Tooltip content="Upload Audio File">
                <div className="max-w-fit">
                  <PopoverTrigger>
                    <span className="cursor-pointer">
                      <Upload />
                    </span>
                  </PopoverTrigger>
                </div>
              </Tooltip>
              <PopoverContent>
                <div className="flex flex-col gap-2">
                  {audioFile && (
                    <div className="flex w-full flex-col justify-center items-center">
                      <audio src={URL.createObjectURL(audioFile)} controls />
                    </div>
                  )}
                  <label
                    htmlFor="dropzone-file"
                    className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                  >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                        <span className="font-semibold">
                          {editMode || audioFile
                            ? "Click to change"
                            : "Upload Local Audio"}
                        </span>
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Audio: MP3, WAV Up to 100MB
                      </p>
                    </div>

                    <input
                      id="dropzone-file"
                      type="file"
                      accept="audio/wav,audio/mpeg,audio/x-m4a,audio/ogg,audio/webm;codecs=opus,audio/webm;codecs=pcm,audio/ogg;codecs=opus,audio/mp4;codecs=mp4a,audio/webm,audio/ogg,audio/mp4"
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                  {audioFile && <Button>Upload</Button>}
                </div>
              </PopoverContent>
            </Popover>

            <Popover
              placement="top"
              classNames={{
                base: [
                  // arrow color
                  "before:bg-default-200",
                ],
                content: ["py-3 px-4 border border-default-200 min-h-[30vh]"],
              }}
            >
              <Tooltip content="Add a recording">
                <div className="max-w-fit">
                  <PopoverTrigger>
                    <span className="cursor-pointer">
                      <Mic />
                    </span>
                  </PopoverTrigger>
                </div>
              </Tooltip>
              <PopoverContent>
                <AudioComponent setAudioBlob={setAudioBlob} />
              </PopoverContent>
            </Popover>
          </div>

          <Textarea
            variant="bordered"
            minRows={25}
            maxRows={30}
            labelPlacement="outside"
            placeholder="Your Notes: Type it out or record/upload an audio."
            value={notes}
            onValueChange={setNotes}
            className="my-4"
          />
        </div>
      </div>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 text-[#05686E]">
                Voice
              </ModalHeader>
              <ModalBody>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat
                  consequat elit dolor adipisicing. Mollit dolor eiusmod sunt ex
                  incididunt cillum quis. Velit duis sit officia eiusmod Lorem
                  aliqua enim laboris do dolor eiusmod. Et mollit incididunt
                  nisi consectetur esse laborum eiusmod pariatur proident Lorem
                  eiusmod et. Culpa deserunt nostrud ad veniam.
                </p>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default NotesTab;