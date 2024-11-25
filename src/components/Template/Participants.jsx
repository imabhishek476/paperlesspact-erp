import { getTemplate, sendColabInvite, updateTemplate } from '@/Apis/template';
import { TextField } from '@mui/material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { createPortal } from 'react-dom';
import {
  Button,
  Checkbox,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Radio,
  RadioGroup,
  useDisclosure,
} from '@nextui-org/react';
import Cookies from 'js-cookie';
import { PencilLine, Plus, User, UserPlus, Users } from 'lucide-react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import ParticipantCard from './ParticipantCard';
import { Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Doc, YArray, Text } from "yjs";
import { WebsocketProvider } from "y-websocket";
import { createContact } from "@/Apis/contacts";
import { useTabsStore } from './stores/useDocTabsStore';
import { usePageDataStore } from './stores/usePageDataStore';

export const RecipientModal = ({ onClose, id,doc,participants,setParticipants }) => {
  const [signingMethod, setSigningMethod] = useState('email');
  const [signerRole, setSignerRole] = useState('Signer');
  const [loading, setLoading] = useState(false);
  const [isSaveContact, setIsSaveContact] = useState(true);
  // const {participants,setParticipants}=useTabsStore()
  console.log(participants)
  const onAddHandler = async (values) => {
    setLoading(true)
    console.log(id);
    console.log(values);
    const accessToken = Cookies.get('accessToken');   
    const folderRes = await updateTemplate(
      accessToken,
      {
        participants: {
          collablorators: participants?.collablorators || [],
          recipients: [
            ...participants?.recipients || [],
            {
              email: values.email,
              isRecipient: true,
              fullname: values.fullname,
              signingMethod,
              signerRole,
            },
          ],
        },
      },
      id
    );
    console.log(folderRes);
    if (folderRes) {
      if(isSaveContact){
        const response = await createContact({
          signersEmail: values.email,
          lang: "en",
          fullname: values.fullname,
          signerRole: signerRole,
          signerMethod: "email",
        });
      }
    setLoading(false)
   
      // console.log(res);
      if(doc){
        const yarray=doc.getArray('recipients');
        doc.transact(()=>{
          yarray.push([{
            email: values.email,
            isRecipient: true,
            fullname: values.fullname,
            signingMethod,
            signerRole,
          }]);
        })
      }
      else{
        setParticipants(folderRes?.data?.participants);
      }
      onClose();
    }
  };
  // const validation = Yup.object().shape({
  //   fullname: Yup.string().required('Fullname is required').nullable(),
  //   aadhar:
  //     signingMethod === 'aadhar'
  //       ? Yup.string()
  //           .required('Aadhar is required')
  //           .min(12, 'Aadhar should be 12 digits exactly')
  //           .max(12, 'Aadhar should be 12 digits exactly')
  //       : Yup.string()
  //           .min(12, 'Aadhar should be 12 digits exactly')
  //           .max(12, 'Aadhar should be 12 digits exactly'),
  //   email: Yup.string()
  //     .required('Email is required')
  //     .email('Invalid Email')

  //     .nullable()
  //     .test(
  //       'same email test',
  //       'Recipient with same email address exists',
  //       function (value) {
  //         let check = false;
  //         if (participants?.recipients?.length > 0) {
  //           check = participants?.recipients?.some((reci) => {
  //             return !(reci?.email === value);
  //           });
  //         } else {
  //           check = true;
  //         }
  //         return check;
  //       }
  //     ),
  // });
  const validation = Yup.object().shape({
    fullname: Yup.string().required('Fullname is required').nullable(),
    aadhar: signingMethod === 'aadhar'
      ? Yup.string()
          .required('Aadhar is required')
          .length(12, 'Aadhar should be 12 digits exactly') // Use length for exact length check
      : Yup.string().nullable(), // If aadhar isn't required for other methods, make it nullable.
    email: Yup.string()
      .required('Email is required')
      .email('Invalid Email')
      .nullable()
      .test(
        'unique-email',
        'Recipient with the same email address already exists',
        function(value) {
          if (!value) return true; 
          const isUnique = !participants?.recipients?.some(recipient => recipient.email === value);
          return isUnique;
        }
      ),
  });
  return (
    <>
      <ModalHeader className="flex flex-col gap-1 border-b">
        Add Recipient
      </ModalHeader>
      <Formik
        initialValues={{ fullname: '', email: '' }}
        onSubmit={onAddHandler}
        validationSchema={validation}
        enableReinitialize
      >
        {({
          values,
          handleBlur,
          handleChange,
          setFieldValue,
          handleSubmit,
          setFieldError,
          errors,
          touched,
        }) => (
          <Form
            onSubmit={(e) => {
              e.preventDefault();
              handleSubmit(e);
            }}
          >
            <ModalBody>
              <TextField
                sx={{ width: '100%' }}
                id="outlined-basic"
                label="Fullname*"
                // required
                name="fullname"
                placeholder="Fullname"
                color="secondary"
                variant="outlined"
                value={values.fullname}
                onBlur={handleBlur}
                onChange={handleChange}
                error={errors.fullname && touched.fullname}
                helperText={
                  errors.fullname && touched.fullname ? errors.fullname : ''
                }
              />
              <TextField
                fullWidth
                id="outlined-basic"
                label="Email*"
                name="email"
                // required
                placeholder="Email"
                type="email"
                color="secondary"
                variant="outlined"
                value={values.email}
                onBlur={handleBlur}
                onChange={handleChange}
                error={errors.email && touched.email}
                helperText={errors.email && touched.email ? errors.email : ''}
              />
              {signingMethod === 'aadhar' && (
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Aadhar"
                  onInput={(e) => {
                    e.target.value = e.target.value.replace(/\D/g, '');
                    if (e.target.value.length > 0) {
                      e.target.value = Math.max(0, parseInt(e.target.value))
                        .toString()
                        .slice(0, 12);
                    }
                  }}
                  name="aadhar"
                  required
                  placeholder="Aadhar"
                  color="secondary"
                  variant="outlined"
                  value={values.aadhar}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  error={errors.aadhar && touched.aadhar}
                  helperText={
                    errors.aadhar && touched.aadhar ? errors.aadhar : ''
                  }
                />
              )}

              <div className="grid grid-cols-3 gap-2">
                <div className="flex">
                  <RadioGroup
                    label="Select signing method."
                    orientation="horizontal"
                    color="secondary"
                    value={signingMethod}
                    onValueChange={setSigningMethod}
                  >
                    <Radio value="email">Email</Radio>
                    {/* <Radio value="aadhar">Aadhar</Radio> */}
                  </RadioGroup>
                </div>
                <div className="flex">
                  <RadioGroup
                    label="Select recipient role."
                    orientation="horizontal"
                    color="secondary"
                    value={signerRole}
                    onValueChange={setSignerRole}
                  >
                    <Radio value="Signer">Signer</Radio>
                    <Radio value="CC">CC</Radio>
                  </RadioGroup>
                </div>
                <div className="flex">
                <Checkbox
                  isSelected={isSaveContact}
                  onValueChange={setIsSaveContact}
                  // isDisabled={disabledApprover}
                  color="secondary"
                  size="sm"
                  className="p-0 m-0"
                >
                  Save Contacts?
                </Checkbox>
                </div>
              </div>
            </ModalBody>
            <ModalFooter className="border-t">
              <Button
                className="border-[#05686E] text-[#05686E]"
                radius="sm"
                variant="bordered"
                onPress={onClose}
              >
                Close
              </Button>
              <Button
                className="bg-[#05686E] text-[#FFF]"
                radius="sm"
                type="submit"
                isLoading={loading}
                // onPress={() => onAddHandler(id)}
              >
                Add Recipient
              </Button>
            </ModalFooter>
          </Form>
        )}
      </Formik>
    </>
  );
};

export const CollaboratorModal = ({ onClose, id,participants,setParticipants }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  // const {participants,setParticipants}=useTabsStore()
  console.log(participants)
  const onAddHandler = async (id) => {
    setLoading(true)
    const body = { templateId: id, inviteeMail: email };
    // console.log(body);
    const accessToken = Cookies.get('accessToken');
    const res = await sendColabInvite(body);
    const folderRes = await updateTemplate(
      accessToken,
      {
        participants: {
          recipients: participants?.recipients || [],
          collaborators: [
            ...(participants.collaborators || []),
            { email: email, hasAccepted: false },
          ],
        },
      },
      id
    );
    if (res && folderRes) {
    setLoading(false)
      setParticipants(folderRes?.data?.participants);
      onClose();
    }
  };
  return (
    <>
      <ModalHeader className="flex flex-col gap-1 border-b">
        Add Collaborator
      </ModalHeader>
      <ModalBody className="py-10">
        <TextField
          sx={{ width: '100%' }}
          id="outlined-basic"
          label="Email"
          name="Email"
          placeholder="Email"
          color="secondary"
          type="Email"
          variant="outlined"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="w-full flex flex-col py-10">
          <div className="flex justify-center text-[18px] font-[600]">
            Collaborate with upto 10 users - free!
          </div>
          <div className="flex justify-center text-center text-[14px] font-[400]">
            Invite anyone within or even outside your organization - partners,
            contractors, consultants - to view and comment on your documents at
            no extra cost.
          </div>
        </div>
      </ModalBody>
      <ModalFooter className="border-t">
        <Button
          className="border-[#05686E] text-[#05686E]"
          radius="sm"
          variant="bordered"
          onPress={onClose}
        >
          Close
        </Button>
        <Button
          className="bg-[#05686E] text-[#FFF]"
          radius="sm"
          onPress={() => onAddHandler(id)}
          // type='submit'
          isLoading={loading}
        >
          Add Collaborator
        </Button>
      </ModalFooter>
    </>
  );
};

const Participants = ({ disabledApprover,userDetails,isContactSave,setIsContactSave, participants, setParticipants, data,isSigningOrder, setIsSigningOrder,roomId ,docDetails,setDocDetails,doc,setDoc,isApprover}) => {
  // console.log(participants);
  const [activeId, setActiveId] = useState(null);
  const [tAction,setTAction] = useState(null);
  const {isEditable} = usePageDataStore();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const actionModal = useDisclosure();
  const [modalType, setModalType] = useState(null);
  // const [doc,setDoc] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  useEffect(() => {

    const createWebsocketProvider = () => {
      const ydoc = new Doc();
      const wsProvider = new WebsocketProvider(
        "wss://20.204.17.85:4001",
        `participants-${roomId}`,
        ydoc
      );
      // console.log(roomId);

      wsProvider.on("status", (event) => {
        if (event.status === "connected") {
          console.log(event.status);
          setDoc(wsProvider.doc);
        }
      });

      wsProvider.on("error", (error) => {
        console.error("Websocket error:", error);
        setTimeout(() => {
          wsProvider.destroy();
          createWebsocketProvider();
        }, 3000);
      });

      return wsProvider;
    };
    let wsProvider = null;
    if(!doc&&participants?.collaborators&&participants?.collaborators?.length>0){
      wsProvider = createWebsocketProvider();
    }

    return () => {
      if(wsProvider){
        wsProvider.destroy();
      }
    };
  }, [participants?.collaborators]);

  useEffect(() => {
    if (doc) {
      const yarray = doc.getArray("recipients");
      // console.log(yarray.toArray());
      const updateMessages = () => {
        setParticipants((prev)=>{
          return {
            ...prev,
            recipients:yarray.toArray()
          }
        });
      };

      yarray.observe(updateMessages);

      return () => {
        yarray.unobserve(updateMessages);
      };
    }
  }, [doc]);
  useEffect(()=>{
    if(doc){
      setParticipants((prev)=>{
        return {
          ...prev,
          recipients:doc.getArray('recipients').toArray()
        }
    });
    }
  },[doc])
  const handleOpenModal = (modalType) => {
    if (modalType === 'collaborator') {
      setModalType(
        <CollaboratorModal
          onClose={onClose}
          id={id}
          participants={participants}
          setParticipants={setParticipants}
        />
      );
    }
    if (modalType === 'recipient') {
      setModalType(
        <RecipientModal
          onClose={onClose}
          id={id}
          participants={participants}
          setParticipants={setParticipants}
          doc={doc}
        />
      );
    }
    onOpen();
  };
  console.log(docDetails)
  // const [actions, setAction] = useState(null);
  const actionLink = [
		{
			icon: <User className="lg:w-[20px] w-24 " />,
			title: "Only Me",
			action: "only-me",
			description: "I am the sole signer",
		},
		{
			icon: (
				<div className="flex items-center gap-2">
					<User className="lg:w-[20px] w-6 " />
					<Users className="lg:w-[20px] w-6 " />
				</div>
			),

			title: "Me & Others",
			action: "me-others",
			description: "Others and I will sign",
		},
		{
			icon: (
				<div className="flex items-center gap-2">
					<Users className="lg:w-[20px] w-6 " />
					<Users className="lg:w-[20px] w-6 " />
				</div>
			),
			title: "Others only",
			action: "others",
			description: "Others will sign",
		},
	];
  const onAddHandler = async(values)=>{
    console.log(id);
    console.log(values);
    const accessToken = Cookies.get('accessToken');   
    const folderRes = await updateTemplate(
      accessToken,
      {
        participants: {
          collablorators: participants?.collablorators || [],
          recipients: values?[
            {
              email: values.email,
              isRecipient: true,
              fullname: values.fullname,
              signingMethod:values.signingMethod,
              signerRole:values.signerRole,
            },
          ]:[],
        },
      },
      id
    );
    console.log(folderRes);
    if (folderRes) {
   
      // console.log(res);
      if(doc){
        const yarray=doc.getArray('recipients');
        doc.transact(()=>{
          yarray.push([{
            email: values.email,
            isRecipient: true,
            fullname: values.fullname,
            signingMethod:values.signingMethod,
            signerRole:values.signerRole,
          }]);
        })
      }
      else{
        setParticipants(folderRes?.data?.participants);
      }
      // onClose();
    }
  }

  const handleAddActionRecipients = async(action,onClose)=>{
    let values = {
      signerMethod:'email',
      signerRole:'Signer'
    }
    if(userDetails?.data?.fullname && userDetails?.data?.email){
      switch (action){
        case 'only-me':
          values = {
            ...values,
            fullname:userDetails?.data?.fullname,
            email:userDetails?.data?.email
          }
          break;
        case 'me-others':
            values = {
              ...values,
              fullname:userDetails?.data?.fullname,
              email:userDetails?.data?.email
            }
            handleOpenModal('recipient');
            break; 
            case 'others':   
            values = null;
            handleOpenModal('recipient');
            break;
      }
    }else{
      handleOpenModal('recipient');
      return;
    }
    await onAddHandler(values);
    if(onClose){
      onClose();
    }
    setDocDetails({...docDetails,participantType:action});
      if(isApprover){
        handleOpenModal('recipient');
      }
    setTAction(null);
  }

  const handleActionClick = async(action)=>{
    setTAction(action);
    if(participants?.recipients.length>0){
      actionModal.onOpen();
    }else{
      await handleAddActionRecipients(action);
    }
  }
  return (
    <>
    <Modal isOpen={actionModal.isOpen} onOpenChange={actionModal.onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">Add Participants</ModalHeader>
              <ModalBody>
                <p>Choosing participants after adding recipients will remove your existing recipients and all the fillable fields assigned to them.Are you sure you want to continue?</p>
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={()=>handleAddActionRecipients(tAction,onClose)}>
                  Continue
                </Button>
                <Button color="primary" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    <div className="h-full w-full flex flex-col">
      <div className="h-full flex flex-col items-center">
        
       { <div className="flex w-full border-b-2 items-center justify-between p-4 h-[55px]">
       <span className="text-[14px] text-[#05686E]">Participants</span>
          <Dropdown>
            <DropdownTrigger>
              <Button isDisabled={disabledApprover || isApprover || !isEditable} variant="light" color="success" startContent={<Plus size={12} />}>
                <span className="text-[12px]">Invite</span>
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Example with disabled actions" disabledKeys={["collaborator"]}>
              <DropdownItem
                key="recipient"
                as={Button}
                isDisabled = {data?.scope === "global"}
                onPress={() => {
                  handleOpenModal('recipient');
                }}
                startContent={<PencilLine />}
                variant="light"
              >
                <div className="flex w-full flex-col items-start">
                  <span className="text-[14px] font-[700]">Add Recipient</span>
                  <span className="text-[12px] font-[500]">
                    Can sign document and recieve a copy
                  </span>
                </div>
              </DropdownItem>
              <DropdownItem
                key="collaborator"
                as={Button}
                onPress={() => {
                  handleOpenModal('collaborator');
                }}
                startContent={<UserPlus />}
                variant="light"
              >
                <div className="flex w-full flex-col items-start">
                  <span className="text-[14px] font-[700]">
                    Add Collaborator
                  </span>
                  <span className="text-[12px] font-[500]">
                    Can edit, view and comment on documents
                  </span>
                </div>
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>}
        <div className="flex flex-col w-full  gap-4 overflow-y-scroll h-[calc(100vh-178px)]">
          {data?.scope !== "global" &&
            <div className="lg:grid flex pt-2  grid-cols-1 gap-2 px-4">
              {actionLink.map((e, i) => {
                return (
                  <div
                    key={i}
                    onClick={() => {
                      if(!isEditable) return;
                      handleActionClick(e.action);
                    }}
                    className={`${
                      docDetails && docDetails?.participantType == e.action
                        ? "bg-[#3db1b7] text-gray-100 border-[#05686E] shadow-lg"
                        : "text-gray-600"
                    } flex lg:flex-row  flex-col w-full items-center lg:px-5 lg:p-1 py-1 px-1 md:gap- gap-2 lg:aspect-[2/.5] border rounded-lg cursor-pointer ${!isApprover ? 'hover:bg-[#3db1b7] hover:text-gray-100 hover:border-[#05686E] hover:shadow-lg': ""}`}
                  >
                    {e.icon}

                    <div className="">
                      <h1 className="font-bold md:text-[16px] text-sm lg:text-left text-center">
                        {e.title}
                      </h1>
                      <p className="text-[12px] lg:text-left text-center">
                        {e?.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          }
          {/* <span className="text-[14px] text-[#05686E]">Participants</span> */}
          <span className="text-[14px] text-[#e8713d] border-b border-t px-4 py-2">Collaborators</span>

          <div className='px-4'>
          <ParticipantCard
            participant={data?.createdByUser}
            userDetails={userDetails?.data}
            type={'owner'}
          />
          </div>
          
          {participants?.collaborators?.length > 0 && (
            <>
              {/* <span className="text-[14px] text-[#e8713d] border-b border-t p-2">Collaborators</span> */}
              <div className="flex flex-col p-4 pt-0 w-full gap-4 ">
              {participants?.collaborators?.map((el, index) => {
                return(
                <ParticipantCard
                  participant={el}
                  userDetails={userDetails?.data}
                  key={index}
                  type={'collaborator'}
                />
              )})}
              </div>
            </>
          )}
          	
          {data?.scope !== "global" && participants?.recipients?.length > 0 && (
            <>
            {}
              <div className="flex justify-between border-b py-2 px-4 border-t">
                <span className="text-[14px] text-[#e8713d] ">Recipients</span>
                <div className='flex flex-col gap-1'>
                {participants?.recipients?.length > 1 &&
                  <Checkbox
                    isSelected={isSigningOrder}
                    onValueChange={setIsSigningOrder}
                    isDisabled={disabledApprover}
                    color="secondary"
                    size="sm"
                    className="p-0 m-0"
                  >
                    Signing Order
                  </Checkbox>
                }
                
                </div>
              </div>
              {isSigningOrder ? (
                <div className="flex flex-col p-4 pt-0 w-full gap-4 ">
                  <DndContext
                    sensors={sensors}
                    collisionDetection={closestCenter}
                    onDragEnd={handleDragEnd}
                    onDragStart={handleDragStart}
                  >
                    <SortableContext
                      items={participants.recipients}
                      strategy={verticalListSortingStrategy}
                    >
                      {participants?.recipients?.map((el, index) => {
                        console.log(userDetails?.data);
                        console.log(el);
                        return (
                        <ParticipantCard
                          participant={el}
                          userDetails={userDetails?.data}
                          key={index}
                          index={index + 1}
                          isSigningOrder={isSigningOrder}
                          type={'collaborator'}
                        />
                      )})}
                    </SortableContext>
                    {createPortal(
                      <DragOverlay>
                        {activeId && (
                          <ParticipantCard
                            participant={participants.recipients.find(
                              (item) => item.email === activeId
                            )}
                            index={participants.recipients.findIndex(
                              (item) => item.email === activeId
                            )}
                            userDetails={userDetails?.data}
                            isSigningOrder={isSigningOrder}
                          />
                        )}
                      </DragOverlay>,
                      document.body
                    )}
                  </DndContext>
                </div>
              ) : (
                <div className="flex flex-col w-full gap-4 p-4 pt-0">
                  {participants.recipients.map((el, index) => (
                    <ParticipantCard
                      participant={el}
                      userDetails={userDetails?.data}
                      isSigningOrder={isSigningOrder}
                      key={index}
                      type={'collaborator'}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex w-full justify-end p-3"></div>
        <Modal size={'xl'} isOpen={isOpen} onClose={onClose}>
          <ModalContent>{(onClose) => <>{modalType || <></>}</>}</ModalContent>
        </Modal>
      </div>
    </div>
    </>
  );
  function handleDragStart(event) {
    const { active } = event;
    setActiveId(active.id);
  }
  function handleDragEnd(event) {
    const { active, over } = event;
    console.log(active, over);

    if (active.id !== over.id) {
      setParticipants((items) => {
        // const oldIndex = items.indexOf(active.id);
        const recipients = items.recipients;
        const oldIndex = recipients.findIndex((el) => el.email === active.id);
        const newIndex = recipients.findIndex((el) => el.email === over.id);
        console.log(oldIndex, newIndex);
        const newRecipients = arrayMove(recipients, oldIndex, newIndex);
        return {
          ...items,
          recipients: newRecipients,
        };
      });
    }
  }
};

export default Participants;
