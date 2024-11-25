import React,{useState} from 'react'
import Timeline from '@mui/lab/Timeline';
import TimelineItem, { timelineItemClasses }  from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';
import {Card, CardHeader, CardBody, CardFooter, Switch, Button, Badge} from "@nextui-org/react";
import { CheckCheck, Eye, X } from 'lucide-react';

const WorkflowTimeline = ({onOpen,approvers,approverSelection,
  approverSequence,
  disabledApprover,
  setApproverSelection,
  setApproverSequence,
  isActiveUpload
}
  ) => {
    console.log(isActiveUpload)
  return (
    <div className='w-full'>
    <Timeline sx={{
        [`& .${timelineItemClasses.root}:before`]: {
          flex: 0,
          padding: 0,
        },
      }}>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="secondary" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent>
            <p className='font-semibold text-[#05686E] text-[14px]'>Draft</p>
            <span   className='text-[12px] text-[#151513]'>Document has been created</span>
        </TimelineContent>
      </TimelineItem>
      <Card radius='none' className='my-2'>
      <CardBody>
        <div className='flex flex-col gap-2'>
            <div className='flex justify-between'>
                <span className='font-semibold text-[#05686E] text-[14px]'>Approver</span>
                <Switch 
            isDisabled={disabledApprover || isActiveUpload}
            isSelected={approverSelection} onValueChange={setApproverSelection} size='sm' color='secondary'>
                    <span className='text-[12px] text-[#151513]'>
                {approverSelection ? "On" : "Off"}
                    </span>
                </Switch> 
            </div>
            {!approvers?.length > 0 &&
                <span className='text-[10px]' style={{
                    color: approverSelection ? "red" : "#151513"
                }}>
                    No approvers added
                </span>
            }
            <span className='text-[12px] text-[#151513]'>
            Require document's approval before it can be sent to recipients
            </span>
            <div className='flex w-full justify-between'>  
            <Button onPress={onOpen} className='border-[#05686E]' variant="bordered" isDisabled={!approverSelection} radius='sm' size='sm'>
                Setup Approvers
            </Button>
            {/* <Badge content={approvers?.length} size="md" variant='flat'>
              <CheckCheck  className='m-1' size={16}/>
            </Badge>
            <Badge content={approvers?.length} size="md" variant='flat'>
              <X className='m-1' size={16}/>

            </Badge> */}
            {approvers?.length>0 &&
            <Badge content={approvers?.length} size="md" color="secondary">
              <Button onPress={onOpen} isIconOnly className='bg-[#05686E]' isDisabled={!approverSelection} radius='sm' size='sm'>
                  <Eye className='text-white' size={18}/>
              </Button>
            </Badge>
            }
                 </div>
        </div>
      </CardBody>
    </Card>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="secondary" />
          <TimelineConnector />
        </TimelineSeparator>
        <TimelineContent> <p className='font-semibold text-[#05686E] text-[14px]'>Sent</p>
            <span   className='text-[12px] text-[#151513]'>The document has been sent to recipients</span></TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="secondary" />
          <TimelineConnector />

        </TimelineSeparator>
        <TimelineContent> <p className='font-semibold text-[#05686E] text-[14px]'>Viewed</p>
            <span   className='text-[12px] text-[#151513]'>Recipient has viewed the document</span></TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineSeparator>
          <TimelineDot color="secondary" />
        </TimelineSeparator>
        <TimelineContent> <p className='font-semibold text-[#05686E] text-[14px]'>Signed</p>
            <span   className='text-[12px] text-[#151513]'>The document has been accepted or signed by all recipients</span></TimelineContent>
      </TimelineItem>
    </Timeline>
    </div>
  )
}

export default WorkflowTimeline