import React, { useEffect, useState } from "react";
import { getAvatars } from "../../../Apis/avatar";
import { Button, Skeleton } from "@nextui-org/react";
import AvatarCard from "./AvatarCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AvatarTab = () => {
  const [avatars, setAvatars] = useState(null);
  const [page, setPage] = useState(1);
  // const [page, setPage] = useState(1);

  useEffect(() => {
    const avatarList = async () => {
      const res = await getAvatars(page, 10);
      if (res?.data?.avatars) {
        console.log(res?.data);
        setAvatars(res?.data);
      }
    };
    avatarList();
  }, [page]);
  return (
    <div className="flex-col">
      <div className="p-4 flex justify-between border-b-2">
        <p className="text-[14px] text-[#05686e]">Avatar</p>
        <div className="flex gap-2">
          <Button
          isIconOnly
          variant="light"
          color="primary"
          isDisabled={page === 1}
          size="sm"
          startContent={<ChevronLeft size={14}/>}
          onPress={()=>setPage(prev=>prev-1)}
          />
          <Button
          isIconOnly
          isDisabled={page === avatars?.totalPages}
          variant="light"
          color="primary"
          size="sm"
          startContent={<ChevronRight size={14}/>}
          onPress={()=>setPage(prev=>prev+1)}
          />
        </div>
      </div>
      <div className="h-[calc(100vh-125px)]">
      <div className="grid grid-cols-2 gap-4 w-full justify-between items-center mt-4">
        {avatars && avatars?.avatars
          ? avatars?.avatars?.map((item, index) => <AvatarCard key={index} item={item} />)
          : Array.from(Array(10)).map((_, index) => (
              <Skeleton key={index} className="aspect-square rounded-md" />
            ))}
      </div>
      </div>
    </div>
  );
};

export default AvatarTab;
