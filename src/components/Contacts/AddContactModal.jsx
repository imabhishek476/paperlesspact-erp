import React from "react";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react";
import { TextField } from "@mui/material";
import {
    Button,
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@nextui-org/react";
import {
    ChevronDownIcon,
    FileSignature,
    Fingerprint,
    Mail,
} from "lucide-react";
import { Nunito } from "next/font/google";
const nunito = Nunito({ subsets: ["latin"] });
import { CheckBox } from "@mui/icons-material";

const AddContactModal = ({ openModel, onOpenChange, setOpenModel, formik, signers, setSigners, signerMethod, setSignerMethod,setDetails }) => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [isOpen1, setIsOpen1] = React.useState(false);
    // console.log("formik", formik.values)
    const language = [
        { label: "English", value: 'en' },
        { label: 'Hindi', value: "hn" }
    ]
    const getSignerRoleIcon = (role) => {
        if (role === "Role : Approver") {
            return (
                <CheckBox
                    sx={{
                        width: 18,
                        height: 18,
                    }}
                />
            );
        }
        if (role === "Role : Signer") {
            return <FileSignature size={18} />;
        }
        if (role === "Role : CC") {
            return <Mail size={18} />;
        }
        return <FileSignature size={18} />;
    };
    const getSignerMethodIcon = (role) => {

        if (role === "Aadhar") {
            return <Fingerprint size={18} />;
        }
        if (role === "Email") {
            return <Mail size={18} />;
        }
        return <Mail size={18} />;
    };
    const signerRoles = [
        {
            title: "Role : Signer",
            value: 'Signer',
            icon: <FileSignature size={18} />,
        },
        {
            title: "Role :  CC",
            value: 'CC',
            icon: <Mail size={18} />,
        },
        {
            title: "Role : Approver",
            value: 'Approver',
            icon: (
                <CheckBox
                    sx={{
                        width: 18,
                        height: 18,
                    }}
                />
            ),
        },
    ];
    const method = [{
        title: 'Sign using Email', value: "email", icon: <Mail size={18} />
    },
    {
        title: 'Sign using Aadhaar', value: "aadhaar", icon: <Fingerprint size={18} />
    },

    ]
    const handleClose = () => {
     
        setSigners(
            {
                signerRole: "Role : Signer",
                singerValue: "Signer"
            },
        );
        setSignerMethod(
            {
                selectedMethod: "Sign using email",
                mathodValue: "email"
            },
        );
        setDetails({
            fullname: "",
            signersEmail: "",
            lang: 'en',
            signerMethod: 'email',
            signerRole: 'singer',
            phone: ''
        })
        formik.resetForm()
        setOpenModel(false)
    }
    return (
        <Modal isOpen={openModel} onOpenChange={onOpenChange} onClose={() => handleClose()} >
            <ModalContent>
                <ModalHeader className="flex flex-col gap-1">Basic Information</ModalHeader>
                <ModalBody>
                    <TextField
                        fullWidth
                        type="text"
                        required
                        className="border py-1"
                        label="Full Name"
                        onBlur={formik?.handleBlur}
                        value={formik?.values?.fullname}
                        onChange={formik?.handleChange}
                        // onChange={(e)=>setCaseHeading(e.target.value)}
                        name="fullname"
                        error={formik?.errors?.fullname && formik?.touched?.fullname}
                        helperText={
                            formik?.errors?.fullname && formik?.touched?.fullname ? formik?.errors?.fullname : ""
                        }

                        sx={{
                            "& .MuiInputBase-root": {
                                borderRadius: 0,
                                height: '47px'
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        required
                        type="email"
                        className="border py-1"
                        onBlur={formik?.handleBlur}
                        value={formik?.values?.signersEmail}
                        onChange={formik?.handleChange}
                        // onChange={(e)=>setCaseHeading(e.target.value)}
                        name="signersEmail"
                        error={formik?.errors?.signersEmail && formik?.touched?.signersEmail}
                        helperText={
                            formik?.errors?.signersEmail && formik?.touched?.signersEmail ? formik?.errors?.signersEmail : ""
                        }
                        label="Email"
                        sx={{
                            "& .MuiInputBase-root": {
                                borderRadius: 0,
                                height: '47px'
                            },
                        }}
                    />
                    <TextField
                        fullWidth
                        type="text"
                        className="border py-1"
                        onBlur={formik?.handleBlur}
                        value={formik?.values?.phone}
                        onChange={formik?.handleChange}
                        // onChange={(e)=>setCaseHeading(e.target.value)}
                        name="phone"
                        error={formik?.errors?.phone && formik?.touched?.phone}
                        helperText={
                            formik?.errors?.phone && formik?.touched?.phone ? formik?.errors?.phone : ""
                        }
                        label="Mobile Number"
                        sx={{
                            "& .MuiInputBase-root": {
                                borderRadius: 0,
                                height: '47px'
                            },
                        }}
                    />
                    {/* <label>Language</label> */}
                    {/* <Select
                        size="sm"
                        radius='none'
                        variant="bordered"
                        classNames={{
                            trigger: "shadow-none",
                        }}
                        // label="Language"
                        // selectedKeys={lang}
                        // className="max-w-xs"
                        // onSelectionChange={setLang}
                        defaultSelectedKeys={["en"]}
                    >
                        {language.map((animal) => (
                            <SelectItem key={animal.value} value={animal.value}>
                                {animal.label}
                            </SelectItem>
                        ))}
                    </Select> */}
                    {/* <label>Signer Method</label> */}
                    <div

                        className="flex sm:items-stretch md:items-stretch items-start flex-wrap justify-between gap-5 mt-3  w-full "
                    >
                        <div className="flex flex-wrap sm:flex-row flex-col items-stretch gap-5 w-full ">
                            <Popover placement="bottom-start " isOpen={isOpen1} onOpenChange={(open) => setIsOpen1(open)}>
                                <PopoverTrigger>
                                    <button className="flex gap-5 h-[47px] bg-[#e3feff] w-full justify-between items-center border px-3 border-gray-500">
                                        <div className="flex gap-1 items-center sm:py-0 py-1 capitalize">
                                            {getSignerMethodIcon(signerMethod.selectedMethod)}{" "}
                                            {signerMethod.selectedMethod
                                                ? signerMethod.selectedMethod
                                                : "Signer method using email"}
                                        </div>
                                        <ChevronDownIcon size={18} />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className={`rounded-none ${nunito.className} bg-white text-foreground p-0 w-[300px] md:w-[375px]`}
                                >
                                    <ul className="py-2 self-start w-full">
                                        {method.map((e, index) => {
                                            return (
                                                <li
                                                    onClick={() => {
                                                        const clone = { ...signerMethod };
                                                        // clone[i].signerIcon = e.icon;
                                                        clone.selectedMethod = e.title;
                                                        clone.mathodValue = e.value;
                                                        setSignerMethod(clone);
                                                        setIsOpen1(false)
                                                    }}
                                                    key={index}
                                                    className="flex px-2 py-2 gap-1 cursor-pointer hover:bg-gray-300 w-full"
                                                >
                                                    {e.icon} {e.title}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </PopoverContent>
                            </Popover>
                        </div>

                    </div>

                    <div

                        className="flex sm:items-stretch md:items-stretch items-start flex-wrap justify-between gap-5 mt-3  w-full "
                    >
                        <div className="flex flex-wrap sm:flex-row flex-col items-stretch gap-5 w-full ">
                            <Popover placement="bottom-start " isOpen={isOpen} onOpenChange={(open) => setIsOpen(open)}>
                                <PopoverTrigger>
                                    <button className="flex gap-5 h-[47px] bg-[#e3feff] w-full justify-between items-center border px-3 border-gray-500">
                                        <div className="flex gap-1 items-center sm:py-0 py-1 capitalize">
                                            {getSignerRoleIcon(signers.signerRole)}{" "}
                                            {signers.signerRole
                                                ? signers.signerRole
                                                : "Role : Signer"}
                                        </div>
                                        <ChevronDownIcon size={18} />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className={`rounded-none ${nunito.className} bg-white text-foreground p-0 w-[300px] md:w-[375px]`}
                                >
                                    <ul className="py-2 self-start w-full">
                                        {signerRoles.map((e, index) => {
                                            return (
                                                <li
                                                    onClick={() => {
                                                        const clone = { ...signers };
                                                        // clone[i].signerIcon = e.icon;
                                                        clone.signerRole = e.title;
                                                        clone.singerValue = e.value;
                                                        setSigners(clone);
                                                        setIsOpen(false)
                                                    }}
                                                    key={index}
                                                    className="flex px-2 py-2 gap-1 cursor-pointer hover:bg-gray-300 w-full"
                                                >
                                                    {e.icon} {e.title}
                                                </li>
                                            );
                                        })}
                                    </ul>
                                </PopoverContent>
                            </Popover>
                        </div>

                    </div>

                </ModalBody>
                <ModalFooter>
                    <Button variant="light" onPress={() => handleClose()}>
                        Close
                    </Button>
                    <Button
                        // variant="bordered"
                        className="bg-[#05686e] text-background"
                        onPress={formik.handleSubmit}
                    >
                        Save
                    </Button>

                </ModalFooter>
            </ModalContent>
        </Modal>
    )
}

export default AddContactModal