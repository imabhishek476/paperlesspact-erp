import { Select, SelectItem } from '@nextui-org/react'
import React, { useEffect, useState } from 'react'
import Carousel from '../../Carousel/Carousel'
import { getAllCategory } from '../../../Apis/template';
import GlobalTemplateTabs from './GlobalTemplateTabs';
export const animals = [
    { label: "Rental Agreement", value: "rental" },
    { label: "Loan Agreement", value: "loan" },
    { label: "Sales Contract", value: "sales" },
    { label: "Service Agreement", value: "service" },
    { label: "Non-Disclosure Agreement", value: "non-disclosure" },
    { label: "Job Offer Letter", value: "job-offer" },
];
const images = [
    {
        link: "https://www.coolfreecv.com/images/modern_resume_template_word_free.jpg",
    },
    {
        link: "https://www.coolfreecv.com/images/cv-template-06.jpg",
    },
    {
        link: "https://www.coolfreecv.com/images/cv_templates_with_photo.jpg",
    },
    {
        link: "https://www.coolfreecv.com/images/cv-template-0002.jpg",
    },
    {
        link: "https://www.coolfreecv.com/images/cv-template-0006.jpg",
    },
    {
        link: "https://www.coolfreecv.com/images/cv-template-0004.jpg",
    },
    {
        link: "https://www.coolfreecv.com/images/cv-template-0011.jpg",
    },
    {
        link: "https://www.coolfreecv.com/images/resume_coolfreecv_ats_02.jpg",
    },
];
const GlobalTemplateUse = ({data,fromTab,handleFileChange}) => {
    const [categories, setCategories] = useState(null)
    const [value, setValue] = React.useState("");
    const handleSelectionChange = (e) => {
        setValue(e.target.value);
    };
    const getcategory = async () => {
        const res = await getAllCategory(null, null, "1")
        if (res) {
            console.log(res)
            setCategories(res?.data?.ref)
        }
    }
    useEffect(() => {
        getcategory()
    }, [])
    console.log(categories)
    return (
      <div className="flex flex-col w-full gap-5 px-3">
        {/* <div className="flex flex-row gap-2 items-center">
                    <span className="text-[14px]">
                        Select Template Type
                    </span>
                    <Select
                        // label="Select Template"
                        labelPlacement="outside-left"
                        variant="bordered"
                        size="sm"
                        radius="sm"
                        placeholder="Select Template"
                        selectedKeys={[value]}
                        className="max-w-[200px]"
                        onChange={handleSelectionChange}
                    >
                        {categories?.map((item) => (
                            <SelectItem key={item?._id} value={item?._id}>
                                {item?.name}
                            </SelectItem>
                        ))}
                    </Select>
                </div> */}
        <div className="w-full">
          <GlobalTemplateTabs templateId={data?._id} fromTab={fromTab} handleFileChange={handleFileChange}/>
        </div>
      </div>
    );
}

export default GlobalTemplateUse
