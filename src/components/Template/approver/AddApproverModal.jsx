import { TextField } from '@mui/material';
import {
  Button,
  Checkbox,
  ModalBody,
  ModalFooter,
  ModalHeader,
  Tooltip,
} from '@nextui-org/react';
import React, { useState } from 'react';
import ApproverCard from './ApproverCard';
import * as Yup from 'yup';

import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from '@dnd-kit/core';
import { createPortal } from 'react-dom';
import { addApprover } from '../../../Apis/template';
import { Form, Formik } from 'formik';
const AddApproverModal = ({
  onClose,
  id,
  setApprovers,
  approvers,
  isSequential,
  setIsSequential,
  data
}) => {
  const [activeId, setActiveId] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  const onAddHandler = async (values,{resetForm}) => {
    const newApprovers = [...approvers,{
      fullname: values.fullname,
      email: values.email,
      // status : "Invited, Yet To Review, Reviewing, Approved, Rejected, On hold, Change Suggested"
      status: 'Invited',
    } ]
    // console.log(res)
    console.log(newApprovers);
    setApprovers(newApprovers);
    resetForm();
    // onClose()
  };
  const validation = Yup.object().shape({
    fullname: Yup.string().required('Fullname is required').nullable(),
    email: Yup.string()
       .email('Invalid Email')
      .required('Email is required')
      .nullable()
      .test(
        'same email test',
        'Approver with same email address exists',
        function (value) {
          let check = false;
          // debugger;
          if (approvers.length > 0) {
            check = !(approvers?.some((reci) => {
              // debugger;
              return (reci?.email === value);
            }));
          } else {
            check = true;
          }
          return check;
        }
      ),
  });
  return (
    <>
      <ModalHeader className="flex flex-col gap-1 border-b">
        Add Approver
      </ModalHeader>
      <ModalBody className="py-10">
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
            <div  className="flex h-full gap-4">
              <TextField
                sx={{ width: '100%' }}
                id="outlined-basic"
                size='small'
                label="Fullname*"
                name="fullname"
                placeholder="Fullname"
                color="secondary"
                variant="outlined"
                value={values.fullname}
                // onBlur={handleBlur}
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
                placeholder="Email"
                type="email"
                size='small'
                color="secondary"
                variant="outlined"
                value={values.email}
                // onBlur={handleBlur}
                onChange={handleChange}
                error={errors.email && touched.email}
                helperText={errors.email && touched.email ? errors.email : ''}
              />
               <Button
            className="bg-[#05686E] text-[#FFF] text-[12px] break-words"
            radius="sm"
            size="md"
           type='submit'
          >
            Add
          </Button>
            </div>
          </Form>
        )}
      </Formik>
        
        {approvers.length > 1 && (
          <div className="flex w-full border-b-2 pb-1 justify-end items-center">
            <Tooltip
              content="Drag And Drop to adjust sequence of approval."
              placement="bottom"
            >
              <div>
                <Checkbox
                  isSelected={isSequential}
                  onValueChange={setIsSequential}
                  color="secondary"
                  size="sm"
                  className="p-0 m-0"
                >
                  Sequential Approval
                </Checkbox>
              </div>
            </Tooltip>
          </div>
        )}
        {isSequential ? (
          <div className="flex flex-col w-full pt-4 px-4 gap-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              onDragStart={handleDragStart}
            >
              <SortableContext
                items={approvers}
                strategy={verticalListSortingStrategy}
              >
                {approvers.map((el, index) => (
                  <ApproverCard
                    approver={el}
                    index={index}
                    key={index}
                    type={'approver'}
                    isSequential={isSequential}
                  />
                ))}
              </SortableContext>
              {createPortal(
                <DragOverlay>
                  {activeId && (
                    <ApproverCard
                      approver={approvers.find(
                        (item) => item.email === activeId
                      )}
                      index={approvers.findIndex(
                        (item) => item.email === activeId
                      )}
                      type={'approver'}
                      isSequential={isSequential}
                    />
                  )}
                </DragOverlay>,
                document.body
              )}
            </DndContext>
          </div>
        ) : (
          <div className="flex flex-col w-full pt-4 px-4 gap-4">
            {approvers?.map((el, index) => (
              <ApproverCard
                approver={el}
                index={index}
                key={index}
                type={'approver'}
                isSequential={isSequential}
              />
            ))}
          </div>
        )}
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
      </ModalFooter>
    </>
  );
  function handleDragStart(event) {
    const { active } = event;
    setActiveId(active.id);
  }
  async function handleDragEnd(event) {
    const { active, over } = event;
    console.log(active, over);

    if (active.id !== over.id) {
      setApprovers((items) => {
        // const oldIndex = items.indexOf(active.id);
        const oldIndex = items.findIndex((el) => el.email === active.id);
        const newIndex = items.findIndex((el) => el.email === over.id);
        const newApprovers = arrayMove(items, oldIndex, newIndex)
        return newApprovers;
      });
    }
  }
};

export default AddApproverModal;
