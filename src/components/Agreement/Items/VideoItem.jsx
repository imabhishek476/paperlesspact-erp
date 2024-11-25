import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Tooltip, useDisclosure } from '@nextui-org/react';
import React from 'react';
import { formatDate } from "@/Utils/dateTimeHelpers";
import { Play, Video } from 'lucide-react';



const VideoItem = ({item, setUpdate, setItems,setSelectedFieldItem,selectedSignee,signees,colors}) => {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    console.log(item?.link)
  return (
    <>
<Modal isOpen={isOpen} onOpenChange={onOpenChange} size='xl'>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader  className="flex flex-col gap-1">Video</ModalHeader>
              <ModalBody>
                <div className='flex justify-center'>

                {item.link &&
                    <video className='rounded-xl' autoPlay controls width={500} height={300} poster={item?.thumbnailLink || item?.thumbnailLink}>
                    <source src={item?.link}/>
                    {/* <source src="movie.ogg" type="video/ogg"> */}
                    Your browser does not support the video tag.
                  </video>
                }
                </div>
              </ModalBody>
              <ModalFooter>
                <Button color="secondary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <div
        // key={item.id}
        style={{
          top: item.top || item.position.y,
          left: item.left || item.position.x,
          width: "250px",
          height: "250px",
          backgroundColor:
            colors[
              signees.findIndex(
                (ele) => ele.fullname === item?.signee?.fullname
              ) % 3
            ]?.color,
        backgroundImage :  item.thumbnailLink && `url(${item?.thumbnailLink})`,
        backgroundRepeat:"no-repeat",
        backgroundPosition:"center",
        objectFit:"contain",
          cursor: "pointer"
        }}
        onClick={onOpen}
        className={`absolute z-[20] bg-[#15151350] p-1 lg:p-3 text-[#151513] rounded-sm md:rounded-lg hover:text-white transition-all hover:cursor-pointer`}
      >
        <div
          className="w-full h-full relative flex items-center justify-center "
          id={item.id}
        >
        <span className='bg-[#05686E] text-white rounded-full p-5 hover:bg-white hover:text-[#05686e] transition-all'>
        <Play size={40}/>
          
        </span>
        </div>
      </div>
    </>
  );
};

export default VideoItem;
