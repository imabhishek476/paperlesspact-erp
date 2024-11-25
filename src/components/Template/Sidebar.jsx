import { Drawer } from '@mui/material';
import { Button, Tab, Tabs, Tooltip } from '@nextui-org/react';
import { FileClock, MessageSquare, Settings, Stamp, Users } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { getUserProfile } from '@/Apis/login';
import Cookies from 'js-cookie';
import Participants from './Participants';
import ChatComponent from './ChatComponent';
import ApproverTab from './approver/ApproverTab';
import StampComponent from './SideTabContents/Stamp';

const Sidebar = ({
  roomId,
  data,
  participants,
  setParticipants,
  isSigningOrder,
  setIsSigningOrder,
  userDetails,
  setUserDetails,
  approverSelection,
  approverSequence,
  disabledApprover,
  setApproverSelection,
  setApproverSequence
}) => {
  const [open, setOpen] = useState(false);
  const [approvers, setApprovers] = useState(data.approvers || []);

  const fetchUserProfile = async () => {
    try {
      const accessToken = Cookies.get('accessToken');
      const userProfile = await getUserProfile(accessToken); // Make the API call to getUserProfile
      setUserDetails(userProfile);
      console.log("User profile data fetched:", userProfile);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };
  useEffect(() => {
    fetchUserProfile();
  }, []);
  console.log(data)
  return (
    <>
      <Button
        size="md"
        // variant="secondary"
        color="secondary"
        className="absolute flex md:hidden top-[10%] right-0 rounded-e-none rounded-s-md"
        isIconOnly
        onPress={() => setOpen(true)}
      >
        <Settings />
      </Button>
      <Drawer
        anchor={'right'}
        open={open}
        onClose={() => setOpen(false)}
        // hideBackdrop
        variant="persistent"
        elevation={0}
        clip
        sx={{
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            marginTop: '100px',
            boxSizing: 'border-box',
          },
          zIndex: 49,
        }}
      >
        <div className="min-w-[100vw] md:min-w-[15vw] md:max-w-[15vw] h-[89vh] flex flex-col-reverse">
          <Tabs
            // aria-label="Dynamic tabs"
            classNames={{
              tabList: 'w-full rounded-none bg-transparent h-[44px] gap-0 p-0',
              base: 'w-full ',
              cursor: 'w-full border-2 border-[#05686E] rounded-none ',
              //   tab: "w-full",
              tab: 'border-1 rounded-none w-full h-full',
              tabContent: 'group-data-[selected=true]:text-[#05686E]',
              panel: 'h-full border-s-1 p-0',
            }}
          // items={tabs}
          >
            <Tab
              title={
                <Tooltip content="Participants">
                  <Users className="pe-1" />
                </Tooltip>
              }
            >
              <Participants
                userDetails={userDetails}
                roomId={roomId}
                participants={participants}
                setParticipants={setParticipants}
                data={data}
                isSigningOrder={isSigningOrder}
                setIsSigningOrder={setIsSigningOrder}
                disabledApprover={disabledApprover}
              />
            </Tab>
            <Tab
              title={
                <Tooltip
                  content={
                    !data?.participants?.length > 0
                      ? 'Please add participants to start chatting.'
                      : 'Chat'
                  }
                >
                  <MessageSquare className="pe-1" />
                </Tooltip>
              }
              isDisabled={!data?.participants?.length > 0}
            >
              <ChatComponent userDetails={userDetails} roomId={roomId} />
            </Tab>
            <Tab
              title={
                <Tooltip content="Workflow">
                  <Settings className="pe-1" />
                </Tooltip>
              }
            >
              <ApproverTab userDetails={userDetails} />
            </Tab>
          </Tabs>
        </div>
      </Drawer>
      <div className="min-w-[100vw] md:min-w-[15vw] mt-[33px] md:max-w-[15vw] h-[89vh] flex flex-col-reverse">
        <Tabs
          // aria-label="Dynamic tabs"

          classNames={{
            tabList: 'w-full rounded-none bg-transparent h-[44px] gap-0 p-0',
            base: 'w-full ',
            cursor: 'w-full border-2 border-[#05686E] rounded-none ',
            //   tab: "w-full",
            tab: 'border-1 rounded-none w-full h-full',
            tabContent: 'group-data-[selected=true]:text-[#05686E]',
            panel: 'h-full border-s-1 p-0',
          }}
        // items={tabs}
        >
          <Tab
            title={
              <Tooltip content="Participants">
                <Users className="pe-1" />
              </Tooltip>
            }
          >
            <Participants
              userDetails={userDetails}
              roomId={roomId}
              participants={participants}
              setParticipants={setParticipants}
              data={data}
              isSigningOrder={isSigningOrder}
              setIsSigningOrder={setIsSigningOrder}
            />
          </Tab>
          <Tab
            title={
              <Tooltip
                content={
                  !participants?.collaborators?.length > 0
                    ? 'Please add participants to start chatting.'
                    : 'Chat'
                }
              >
                <MessageSquare className="pe-1" />
              </Tooltip>
            }
            isDisabled={!participants?.collaborators?.length > 0}
          >
            <ChatComponent userDetails={userDetails} roomId={roomId} />
          </Tab>
          <Tab
            title={
              <Tooltip content="Workflow">
                <Settings className="pe-1" />
              </Tooltip>
            }
          >
          
            <ApproverTab
              userDetails={userDetails}
              data={data}
              approvers={approvers}
              setApprovers={setApprovers}
              disabledApprover={disabledApprover}
              approverSequence={approverSequence}
              setApproverSequence={setApproverSequence}
              approverSelection={approverSelection}
              setApproverSelection={setApproverSelection}
            />
          </Tab>
          <Tab
            title={
              <Tooltip content="Stamp">
                <Stamp className="pe-1" />
              </Tooltip>
            }
          >
            <StampComponent/>
          </Tab>
        </Tabs>
      </div>
    </>
  );
};

export default Sidebar;
