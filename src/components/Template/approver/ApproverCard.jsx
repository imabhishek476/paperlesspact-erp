import { Avatar, Chip, Divider, Tooltip } from '@nextui-org/react';
import {
    CircleDashed,
  GripVertical,
  Mail,
  PenLine,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const ApproverCard = ({ approver, index, isSequential }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: approver?.email });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  return (
    <Tooltip
        content={
          <div className="flex flex-col w-full p-3">
            <span className="text-[18px] font-semibold mb-1 flex items-center gap-3">
            <Avatar
                  isBordered
                  // color="primary"
                  className="bg-[#05686E] text-white ring-[#05686E] h-4 w-4"
                  src={approver?.profileImgUrl}
                  size="sm"
                />
              {approver?.fullname}
            </span>
            <span className="text-[14px] border-b-1 pt-2 pb-3">
              <Users className="inline text-[#05686E] me-1 w-5 h-5" />{' '}
              {approver?.team}
            </span>
            
            <span className="text-[14px] py-2">
              <Mail className="inline text-[#05686E] me-1 w-5 h-5" />{' '}
              {approver?.email}
            </span>
            <span className="text-[14px] py-2">
              <CircleDashed className="inline text-[#05686E] me-1 w-5 h-5" />{' '}
              {approver?.status}
            </span>
          </div>
        }
        placement="left"
        radius="sm"
      >
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      draggable={isSequential}
      className={`flex items-center w-full py-2 px-3 gap-3 hover:cursor-pointer rounded-lg border border-[#05686E]`}
      // onClick={() => setSelectedSignee(signee)}
    >
      
        <div className="flex gap-2 w-full h-full items-stretch">
          <div className="flex justify-between w-full">
            <span className="flex flex-col w-full justify-between">
              <span className="text-[12px] font-semibold flex gap-4 mb-2 items-center justify-between">
                <div className='flex justify-start items-center gap-3'>
                    <div>

                <Avatar
                  isBordered
                  // color="primary"
                  className="bg-[#05686E] text-white ring-[#05686E] h-6 w-6"
                  src={approver?.profileImgUrl}
                  size="sm"
                />
                    </div>
                {isSequential ? `${index + 1}. ` : ''}
                {approver?.fullname}
                
                </div>
              <Chip size='sm'  className="text-[10px] bg-[#05686E] text-white capitalize">
                {/* <CircleDashed className="inline text-[#05686E] me-1 w-5 h-5" />{' '} */}
                {approver?.status}
                
                 {/* Yet To Review */}
              </Chip>
              </span>
            </span>
          </div>
          {isSequential && (
            <div className="h-full flex items-center">
              <GripVertical />
            </div>
          )}
        </div>
    </div>
      </Tooltip>
  );
};

export default ApproverCard;
