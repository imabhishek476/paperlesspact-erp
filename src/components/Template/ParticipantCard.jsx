import { Avatar, Chip, Divider, Tooltip } from '@nextui-org/react';
import { Grip, GripVertical, Mail, PenLine, ShieldCheck, User, Users } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import React from 'react';

const ParticipantCard = ({ participant, userDetails, type, index, isSigningOrder }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
  useSortable({ id: participant?.email });
const style = {
  transform: CSS.Transform.toString(transform),
  transition,
};
  if (participant?.isRecipient) {
    // console.log(isSigningOrder);
 
   return  <Tooltip
      content={
        <div className="flex flex-col gap-2 w-full p-3">
          <span className="text-[18px] font-semibold mb-1 truncate">
            {participant?.fullname}
          </span>
          <span className="text-[14px] pb-2 border-b-2">
            <Mail className="inline text-[#05686E] me-1 w-5 h-5" />{' '}
            {participant?.email}
          </span>
          <span className="text-[14px] capitalize">
            <PenLine className="inline text-[#05686E] me-1 w-5 h-5" />{' '}
            Signing Method: &nbsp;
            {participant?.signingMethod}
          </span>
          <span className="text-[14px] capitalize">
            <User className="inline text-[#05686E] me-1 w-5 h-5" />{' '}
            Role: &nbsp;
            {participant?.signerRole}
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
      draggable={isSigningOrder}
        className={`flex items-center w-full py-2 px-3 gap-3 hover:cursor-pointer rounded-lg border border-[#05686E]`}
        // onClick={() => setSelectedSignee(signee)}
      >
        <div>
          <Avatar
            isBordered
            // color="primary"
            className="bg-[#05686E] text-white ring-[#05686E]"
            src={participant?.profileImgUrl}
            size="sm"
          />
        </div>
        <div className="flex gap-2 w-full h-full">
          <div className="flex flex-col w-full">
            <span className="flex w-full justify-between">
              <span className="text-[14px] font-semibold truncate max-w-[165px]">
                {isSigningOrder && `${index}. `} {participant?.fullname}
              </span>
              {participant?.id === userDetails?.id && (
                <Chip
                  variant="bordered"
                  className="border-[#05686E] text-[#05686E]"
                >
                  You
                </Chip>
              )}
            </span>
              <span className="text-[12px]">
                <User className="inline text-[#05686E] me-1 w-5 h-5" />
                {participant.signerRole}
              </span>
          </div>
          {isSigningOrder && <div className='flex h-full items-center'>
            <GripVertical />
          </div>
            }

        </div>
      </div>
    </Tooltip>;
  }
  if (!participant?.hasAccepted && type !== 'owner') {
    return (
      <div
        className={`flex items-center p-3 gap-3 hover:cursor-pointer rounded-lg border`}
        // onClick={() => setSelectedSignee(signee)}
      >
        <div>
          <Avatar
            isBordered
            // color="primary"
            className=" text-white"
            src={participant?.profileImgUrl}
            size="sm"
          />
        </div>
        <div className="flex flex-col items-start gap-2 justify-between w-full">
          <span className="w-full break-all text-[14px]">
            {participant?.email}
          </span>
          <div className="w-full flex justify-end">
            <Chip size="sm" variant="shadow" className="text-white">
              Invited
            </Chip>
          </div>
        </div>
      </div>
    );
  }
  return (
    <Tooltip
      content={
        <div className="flex flex-col w-full p-3">
          <span className="text-[18px] font-semibold mb-1">
            {participant?.fullname}
          </span>
          <span className="text-[14px]">
            <Mail className="inline text-[#05686E] me-1 w-5 h-5" />{' '}
            {participant?.email}
          </span>
        </div>
      }
      placement="left"
      radius="sm"
    >
      <div
        className={`flex items-center py-2 px-3 gap-3 hover:cursor-pointer rounded-lg border border-[#05686E]`}
        // onClick={() => setSelectedSignee(signee)}
      >
        <div>
          <Avatar
            isBordered
            // color="primary"
            className="bg-[#05686E] text-white ring-[#05686E]"
            src={participant?.profileImgUrl}
            size="sm"
          />
        </div>
        <div className="flex gap-2 w-full">
          <div className="flex flex-col  w-full">
            <span className="flex w-full justify-between">
              <span className="text-[14px] font-semibold">
                {participant?.fullname}
              </span>
              {participant?.id === userDetails?.id && (
                <Chip
                  variant="bordered"
                  className="border-[#05686E] text-[#05686E]"
                >
                  You
                </Chip>
              )}
            </span>
            {type === 'collaborator' && (
              <span className="text-[12px]">
                <Users className="inline text-[#05686E] me-1 w-5 h-5" />
                Collaborator
              </span>
            )}
            {type === 'owner' && (
              <span className="text-[12px]">
                <ShieldCheck className="inline text-[#05686E] me-1 w-5 h-5" />
                Owner
              </span>
            )}
            {type === 'recipient' && (
              <span className="text-[12px]">
                <PenLine className="inline text-[#05686E] me-1 w-5 h-5" />
                Recipient
              </span>
            )}
          </div>
        </div>
      </div>
    </Tooltip>
  );
};

export default ParticipantCard;
