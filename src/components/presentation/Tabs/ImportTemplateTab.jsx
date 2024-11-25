import React, { useEffect, useState } from "react";
import { usePageStore } from "../stores/usePageStore";
import { getcompletedTemplateList } from "../../../Apis/legalAgreement";
import {
  Button,
  Card,
  CardBody,
  Modal,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Skeleton,
  useDisclosure,
} from "@nextui-org/react";
import { ChevronLeft } from "lucide-react";
import { useItemStore } from "../stores/useItemStore";
import ItemRenderer from "../PageComponent/ItemRenderer";

const PresentationPreviewCard = ({
  data,
  setSelectedTemplate,
  fromSingle,
  index,
}) => {
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();
  const { pages, setPages, selectedPage } = usePageStore();
  const {items, setItems } = useItemStore();
  const handleAdd =() =>{
    const newPageItems = data?.items?.filter(
        (item) => item.pageIndex === index
    );
    const newItems = items.map((item) => {
      if (item.pageIndex <= selectedPage.pageIndex) {
        return item;
      }
      if (item.pageIndex > selectedPage.pageIndex) {
        return {
          ...item,
          pageIndex: item.pageIndex + 1,
        };
      }
    });
    setItems([...newItems,...newPageItems.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
        pageIndex: selectedPage?.pageIndex +1,
      }))])
      const newPage = data?.pages[index]
    const newPages = [...pages]
    newPages.splice(selectedPage?.pageIndex,0,newPage)
    setPages(newPages)
    onClose()
  }
  const handleReplace = () => {
    const newPageItems = data?.items?.filter(
      (item) => item.pageIndex === index
    );
    const newItems = items.filter(
      (item) => item.pageIndex !== selectedPage?.pageIndex
    );
    const newPage = data?.pages[index]
    const newPages = [...pages]
    newPages.splice(selectedPage?.pageIndex,1,newPage)
    setPages(newPages)
    setItems([
      ...newItems,
      ...newPageItems.map((item) => ({
        ...item,
        id: crypto.randomUUID(),
        pageIndex: selectedPage?.pageIndex,
      })),
    ]);
    onClose()

  };
  return (
    <>
      <Modal
        size="sm"
        backdrop="transparent"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Add Template As New Page?
              </ModalHeader>
              <ModalFooter>
                <Button color="primary" variant="light" onPress={handleReplace}>
                  Replace current page
                </Button>
                <Button color="primary" onPress={handleAdd}>
                  Add as new page
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <Card
        className="cursor-pointer aspect-video rounded-none"
        style={{
          border: "2px solid #05686E70",
        }}
        isPressable
        onPress={() => {
          if (fromSingle) {
            onOpen();
          } else {
            setSelectedTemplate(data);
          }
        }}
      >
        <CardBody className="overflow-hidden p-0">
          <div>
            <div
              className=" origin-top-left scale-[0.12] relative"
              style={{
                minHeight:
                  data.pageSetup.orientation === "landscape"
                    ? data.pageSetup?.size?.height
                    : data.pageSetup?.size?.width,
                minWidth:
                  data.pageSetup.orientation === "landscape"
                    ? data.pageSetup?.size?.width
                    : data.pageSetup?.size?.height,
              }}
            >
              {data.items
                ?.filter((item) => item?.pageIndex === (fromSingle ? index : 0))
                ?.map((item, index) => {
                  item.id = crypto.randomUUID();
                  return (
                    <ItemRenderer
                      key={`fromsingle${index}`}
                      item={item}
                      fromOverlay={true}
                      fromPreview={true}
                      fromImport={true}
                    />
                  );
                })}
            </div>
          </div>
        </CardBody>
      </Card>
    </>
  );
};

const ImportTemplateTab = () => {
  const [templates, setTemplates] = useState({});
  const [loading,setLoading]=useState(true)
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const { pageSetup, setPages } = usePageStore();
  const { setItems } = useItemStore();
  const getTemplate = async (_mode) => {
    let filter = {
      isPublished: 1,
      isGlobal: 1,
      pageOrientation: _mode,
      type: "presentation",
    };
    if (filter?.pageOrientation) {
      const res = await getcompletedTemplateList(filter, 1, 20);
      console.log(res);
      setTemplates(res);
      setLoading(false)
    }
  };
  const handleApplyAllPages = (e) => {
    // e.preventDefault();
    setPages([...selectedTemplate?.pages]);
    setItems([...selectedTemplate?.items]);
  };
  useEffect(() => {
    getTemplate(pageSetup?.orientation);
  }, []);
  if (selectedTemplate) {
    return (
      <>
        <div className="flex flex-col">
          <div className="p-4 border-b-2 flex justify-between items-center">
            <span className="text-[14px] text-[#05686e]">Templates</span>
            <Button
              size="sm"
              onPress={() => setSelectedTemplate(null)}
              variant="light"
              className="text-[14px] text-[#05686e] h-4 min-w-8"
            >
              <ChevronLeft size={16} />
            </Button>
          </div>
          <div className="flex w-full justify-center">
            <Button
              onPress={handleApplyAllPages}
              color="primary"
              fullWidth
              className="mt-2"
            >{`Apply all ${selectedTemplate?.pages?.length} pages.`}</Button>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-4">
            {selectedTemplate.pages.map((page, index) => {
              return (
                <PresentationPreviewCard
                  key={`pages-${index}`}
                  data={selectedTemplate}
                  fromSingle={true}
                  index={index}
                />
              );
            })}
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col">
      <div className="p-4 border-b-2 ">
        <p className="text-[14px] text-[#05686e]">Templates</p>
      </div>
      <div className="h-[calc(100vh-120px)] overflow-scroll ">
      <div className="grid grid-cols-2 gap-4 pt-4">
        {templates && templates?.ref?.length > 0
          ? templates?.ref?.map((data, index) => {
              return (
                <PresentationPreviewCard
                  key={`first-${index}`}
                  data={data}
                  setSelectedTemplate={setSelectedTemplate}
                />
              );
            })
          : loading ? Array.from(Array(16)).map((_, index) => (
              <Skeleton key={index} className="aspect-video rounded-md" />
            )):<div className="col-span-2 flex justify-center">No Template Available</div>}
      </div>

      </div>
    </div>
  );
};

export default ImportTemplateTab;
