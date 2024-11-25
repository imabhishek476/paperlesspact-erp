import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalContent,
  Switch,
  Tooltip,
  useDisclosure,
} from '@nextui-org/react';
import { GripHorizontal, Plus } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import AddApproverModal from './AddApproverModal';
import ParticipantCard from '../ParticipantCard';
import ApproverCard from './ApproverCard';

import WorkflowTimeline from '../WorkflowTimeline';
import { addApprover } from '../../../Apis/template';
import { usePageDataStore } from '../stores/usePageDataStore';

const ApproverTab = ({
  userDetails,
  data,
  approvers,
  setApprovers,
  approverSelection,
  approverSequence,
  disabledApprover,
  setApproverSelection,
  setApproverSequence,
  isActiveUpload,
}) => {
  const [isSequential, setIsSequential] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {serverData} = usePageDataStore();
  const addApprovers = async (id, body) => {
    const res = await addApprover({ id: serverData?._id, approvers: approvers });
    // console.log(res?.serverData)
  };
  console.log(serverData);
  useEffect(() => {
    if(approvers?.length>0){
      addApprovers({ id: serverData?._id, approvers: approvers });
    }
  }, [approvers]);
  return (
    <div className="h-full w-full flex flex-col">
      <div className="h-full flex flex-col items-center">
        <div className="flex w-full border-b-2 p-4 justify-between items-center h-[55px]">
          <span className="text-[14px] text-[#05686E]">Workflow</span>
          {/* <Dropdown>
            <DropdownTrigger>
              <Button
                variant="light"
                isIconOnly
                startContent={<GripHorizontal />}
              >
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Example with disabled actions">
              <DropdownItem
                key="recipient"
                as={Button}
                onPress={onOpen}
                isIconOnly
                variant="light"
                // color="success"
                startContent={<Plus />}
              >
                <span className="text-[14px] font-[700]">Add Approver</span>
                
              </DropdownItem>
              <DropdownItem
              // key="collaborator"
              >
                <Checkbox
                  isSelected={isSequential}
                  onValueChange={setIsSequential}
                  color="secondary"
                >
                  Sequential Approval
                </Checkbox>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown> */}
          <Button
            variant="light"
            color="success"
            startContent={<Plus size={10} />}
            isDisabled={disabledApprover}
            onPress={onOpen}
          >
            <span className="text-[12px]">Invite</span>
          </Button>
          <Modal size={'xl'} isOpen={isOpen} onClose={onClose}>
            <ModalContent>
              {(onClose) => (
                <AddApproverModal
                  onClose={onClose}
                  setApprovers={setApprovers}
                  approvers={approvers}
                  isSequential={approverSequence}
                  setIsSequential={setApproverSequence}
                  data={data}
                />
              )}
            </ModalContent>
          </Modal>
        </div>
        <div className="overflow-y-auto h-[calc(100vh-155px)]">
          <WorkflowTimeline onOpen={onOpen} approvers={approvers} disabledApprover={disabledApprover}
            approverSequence={approverSequence}
            setApproverSequence={setApproverSequence}
            approverSelection={approverSelection}
            setApproverSelection={setApproverSelection} isActiveUpload={isActiveUpload} />

        </div>
      </div>
    </div>
  );
};

export default ApproverTab;
