import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Avatar,
} from "@nextui-org/react";
import { useFormik, Formik, Form } from "formik";

import React, { useState, useEffect, use } from "react";
import * as Yup from "yup";
import { TextField } from "@mui/material";
import { Nunito } from "next/font/google";
const nunito = Nunito({ subsets: ["latin"] });
import { createTeam, getTeamListById, updateTeam } from "../../Apis/team";

import Cookies from "js-cookie";
import { useRouter } from "next/router";

const CreateTeamModal = ({
  editMode,
  isOpen,
  setSnackMessage,
  setSnackOpen,
  setSnackSuccess,
  setUpdate,
  teamData,
  teamId,
  setEditMode,
  onOpen,
  fromDash,
  setTeamId,
}) => {
  const router = useRouter();
  const [file, setFile] = useState();
  const [data, setData] = useState();
  const [initialValue, setInitialValue] = useState({ name: "" });
  const createTeamvalidator = Yup.object().shape({
    name: Yup.string()
      .required("Name is required!")
      .test("same name test", "Team with same name exists", function (value) {
        let check = false;
        if (!editMode && teamData?.length > 0) {
          check = teamData?.some((reci) => {
            console.log(reci?.name === value);
            return reci?.name === value;
          });
          if (check) {
            return false;
          }
        }
        return true;
      }),
  });
  const accessToken = Cookies.get("accessToken");
  const handleFileUpload = (e) => {
    console.log(e);
    const newFile = e.target.files[0];
    setFile(newFile);
  };
  const getTeamById = async () => {
    const res = await getTeamListById(teamId, accessToken);
    console.log(res);
    if (res) {
      setData(res?.userTeam);
    }
  };
  useEffect(() => {
    if (teamId && editMode) {
      getTeamById();
    }
  }, [teamId]);
  useEffect(() => {
    setInitialValue({ name: data?.name });
  }, [data]);
  const HandleonClose = () => {
    onOpen(false);
    if (editMode) {
      setEditMode(false);
      setTeamId("");
    }
  };
  console.log(initialValue);
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={HandleonClose}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {editMode ? "Edit Team" : "Create Team"}
              </ModalHeader>

              <ModalBody>
                <Formik
                  onSubmit={async (values) => {
                    console.log(values);
                    let body;
                    console.log(file);
                    if (editMode) {
                      body = {
                        teamName: values?.name,
                        isActive: 1,
                      };
                      if (file) {
                        body.file = file;
                      } else {
                        body.file = data?.teamIcon;
                      }
                      console.log(body);
                      const res = await updateTeam(body, teamId);
                      if (res) {
                        setUpdate((prev) => !prev);
                        setSnackOpen(true);
                        setSnackSuccess("success");
                        setSnackMessage(`Updated SuccessFully`);
                        HandleonClose();
                      } else {
                        setSnackOpen(true);
                        setSnackSuccess("warning");
                        setSnackMessage(`Something Went Wrong`);
                      }
                      setEditMode(false);
                      setTeamId("");
                    } else {
                      body = { teamName: values?.name };
                      if (file) {
                        body.file = file;
                      }
                      const res = await createTeam(body);
                      if (res) {
                        setUpdate((prev) => !prev);
                        setSnackOpen(true);
                        setSnackSuccess("success");
                        setSnackMessage(`Created SuccessFully`);
                        HandleonClose();
                      } else {
                        setSnackOpen(true);
                        setSnackSuccess("warning");
                        setSnackMessage(`Something Went Wrong`);
                      }
                    }
                    if (fromDash) {
                      router.push("/team");
                    }
                  }}
                  enableReinitialize
                  initialValues={initialValue}
                  validationSchema={createTeamvalidator}
                >
                  {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                  }) => {
                    {
                      console.log(values);
                    }
                    return (
                      <Form onSubmit={handleSubmit}>
                        <div className="flex flex-col gap-4">
                          <TextField
                            fullWidth
                            type="text"
                            className="border py-1"
                            label={`Team Name`}
                            // size="small"
                            onBlur={handleBlur}
                            value={values?.name}
                            onChange={handleChange}
                            name="name"
                            error={errors?.name && touched?.name}
                            helperText={
                              errors?.name && touched?.name && errors?.name
                            }
                            sx={{
                              "& .MuiInputBase-root": {
                                borderRadius: 0,
                                height: "45px",
                                backgroundColor: "white",
                              },
                              "& .MuiFormHelperText-root": {
                                marginLeft: 0,
                              },
                            }}
                          />
                          <div>
                            <div className="flex flex-row justify-between pb-5">
                              {editMode && (
                                <div className="flex flex-col w-full justify-center items-center">
                                  {editMode && file && <p>Old Icon</p>}
                                  <div className="h-[75px] w-[75px]">
                                    <Avatar
                                      showFallback
                                      name={data?.name
                                        ?.substring(0, 2)
                                        .toUpperCase()}
                                      className="bg-[#05686E] text-white border-white border-2 h-full w-full"
                                      src={data?.teamIcon}
                                      size="lg"
                                    />
                                  </div>
                                </div>
                              )}
                              {file && (
                                <div className="flex w-full flex-col justify-center items-center">
                                  {editMode && file && <p>New Icon</p>}
                                  <div className="h-[75px] w-[75px]">
                                    <Avatar
                                      showFallback
                                      name={file?.name
                                        ?.substring(0, 2)
                                        .toUpperCase()}
                                      className="bg-[#05686E] text-white border-white border-2 h-full w-full"
                                      src={URL.createObjectURL(file)}
                                      size="lg"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                            <div className="flex flex-col gap-2 items-center justify-center w-full">
                              <p className="self-start">
                                {file || editMode ? "Change " : "Upload "} Team
                                Icon
                              </p>
                              <label
                                htmlFor="dropzone-file"
                                className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
                              >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                  <svg
                                    className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 20 16"
                                  >
                                    <path
                                      stroke="currentColor"
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                                    />
                                  </svg>
                                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="font-semibold">
                                      {editMode || file
                                        ? "Click to change"
                                        : "Click to upload"}
                                    </span>
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">
                                    SVG, PNG, JPG or GIF (MAX. 800x400px)
                                  </p>
                                </div>

                                <input
                                  id="dropzone-file"
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={handleFileUpload}
                                />
                              </label>
                            </div>
                          </div>

                          <div className="w-full flex justify-end">
                            <Button
                              className="bg-[#05686E] text-white"
                              color="primary"
                              type="submit"
                              isLoading={isSubmitting}
                              // onPress={handleSubmit}
                            >
                              {editMode ? "Update" : "Create"}
                            </Button>
                          </div>
                        </div>
                      </Form>
                    );
                  }}
                </Formik>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
export default CreateTeamModal;
