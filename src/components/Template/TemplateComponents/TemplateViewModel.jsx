import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import Templatecarousel from "../../Carousel/Templatecarousel";
import { getcompletedTemplateList } from "../../../Apis/legalAgreement";
import { createTemplate, globalTemplate } from "../../../Apis/template";
import { useRouter } from "next/router";
import { Divider } from "@mui/material";
import PresentationModalView from "./PresentationModalView";
const images = [
  {
    link: "https://www.coolfreecv.com/images/modern_resume_template_word_free.jpg",
  },
  {
    link: "https://www.coolfreecv.com/images/cv-template-06.jpg",
  },
  {
    link: "https://www.coolfreecv.com/images/cv_templates_with_photo.jpg",
  },
  {
    link: "https://www.coolfreecv.com/images/cv-template-0002.jpg",
  },
  {
    link: "https://www.coolfreecv.com/images/cv-template-0006.jpg",
  },
  {
    link: "https://www.coolfreecv.com/images/cv-template-0004.jpg",
  },
  {
    link: "https://www.coolfreecv.com/images/cv-template-0011.jpg",
  },
  {
    link: "https://www.coolfreecv.com/images/resume_coolfreecv_ats_02.jpg",
  },
];
const TemplateViewModel = ({
  onClose,
  isOpen,
  selectedTemp,
  setSelectedTemp,
  mode,
  templateId,
}) => {
  const router = useRouter();
  console.log(selectedTemp);
  const [relatedTemplate, setRelatedTemplate] = useState(null);
  const [userTemplate, setUserTemplate] = useState(null);
  const copyTemplate = async (globalId, userTempId) => {
    let obj = {
      copiedTemplateId: globalId,
      newTemplateId: userTempId,
    };
    const res = await globalTemplate(obj);
    console.log(res);
    if (res) {
      console.log(userTempId);
      if (templateId) {
        router.reload();
      } else {
        if (userTempId) {
          if(res?.data?.type === "presentation"){
            router.push(`/presentation/new?id=${userTempId}`);
          } else {
            router.push(`/template/new?id=${userTempId}`);

          }
        }
      }
    }
  };
  const handleCreateTemplate = async (folderName, gloablTempId) => {
    let userTemplateId;
    if (templateId) {
      userTemplateId = templateId;
    } else {
      const body = {
        fileJson: "{}",
        folderName: folderName,
        isFile: "1",
        parentId: "root",
      };
      const response = await createTemplate(body);
      console.log(response);
      userTemplateId = response?.data?._id;
    }
    if (userTemplateId) {
      setUserTemplate(userTemplateId);
      copyTemplate(gloablTempId, userTemplateId);
    }
  };

  const handleUseTemplate = (id) => {
    console.log(id);
    if (selectedTemp?.name && id) {
      handleCreateTemplate(selectedTemp?.name, id);
    }
  };
  const getTemplate = async (categoryId) => {
    let filter = {
      isPublished: 1,
      isGlobal: 1,
      pageOrientation: mode,
    };
    if (categoryId) {
      filter = {
        ...filter,
        categoryId: categoryId,
      };
    }
    console.log(categoryId);
    const res = await getcompletedTemplateList(filter, 1, 5);
    console.log(res);
    setRelatedTemplate(res);
  };
  useEffect(() => {
    if (selectedTemp?.categoryId?._id) {
      getTemplate(selectedTemp?.categoryId?._id);
    } else {
      setRelatedTemplate(null);
    }
  }, [selectedTemp?._id]);
  return (
    <div>
      <Modal size={"4xl"} isOpen={isOpen} onClose={() => onClose(false)}>
        <ModalContent className="px-6">
          <ModalHeader className="flex flex-col gap-1">
            {selectedTemp?.name ? selectedTemp?.name : "template"}
          </ModalHeader>
          <ModalBody className="py-1 items-center h-full lg:h-[600px]">
          {selectedTemp?.type === "presentation" ? 
            <PresentationModalView data={selectedTemp}/>
          :
            <iframe
              loading="lazy"
              className="w-full h-full lg:h-[50vh] items-center"
              src={
                `${selectedTemp?.pdfUrl + "#view=fitV&toolbar=0"}` ||
                "/images/tSample.svg"
              }
              width="100%"
              height="100%"
            ></iframe>
          }
          </ModalBody>
          <ModalFooter className="justify-center">
            <Button
              size="lg"
              className="bg-[#05686E] text-white rounded-md"
              onPress={() => handleUseTemplate(selectedTemp?._id)}
            >
              Use Template
            </Button>
          </ModalFooter>
          {selectedTemp?.type !== "presentation" &&
            <>
              <Divider>
                <span className="text-[14px] text-[#15151380]">
                  Similar Templates
                </span>
              </Divider>
              <div className="overflow-hidden">
                {relatedTemplate?.ref && relatedTemplate?.ref?.length > 0 ? (
                  <Templatecarousel
                    images={relatedTemplate?.ref}
                    setSelectedTemp={setSelectedTemp}
                  />
                ) : (
                  <div className="flex h-32 w-full justify-center items-center">
                    <span className="text-xs text-[#15151360]">
                      No Template Available
                    </span>
                  </div>
                )}
              </div>
            </>
          }
        </ModalContent>
      </Modal>
    </div>
  );
};

export default TemplateViewModel;
