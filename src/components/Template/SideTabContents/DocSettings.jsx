import { Checkbox, Tooltip } from "@nextui-org/react";
import { HelpCircle, Info } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Nunito } from "next/font/google";
import { saveInfo } from "../../../Utils/Contstant";
import { useTabsStore } from "../stores/useDocTabsStore";
import { usePageDataStore } from "../stores/usePageDataStore";
import { useEditor } from "../../LexicalTemplatePlayground/lexical-playground/src/context/EditorProvider";
function formatRenewalDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
}
const nunito = Nunito({ subsets: ["latin"] });
const DocSettings = ({
  setdocumnetSettings,
  documentSettings,
  docDetails,
  setDocDetails,
  isApprover
}) => {
  const [isChecked, setIsChecked] = useState(false);
  let tempDate = new Date();
  const { isEditable } = usePageDataStore();
  tempDate.setFullYear(tempDate.getFullYear() + 1)
  tempDate = tempDate.toISOString().split('T')[0]
  const [date, setDate] = useState(tempDate)
  const oneMonthAfter = new Date();
  oneMonthAfter.setMonth(oneMonthAfter.getMonth() + 1);

  const { enableAutoReminder, setEnableAutoReminder, enableRenewal, setEnableRenewal, renewalDate, setRenewalDate, serverData } = useTabsStore()
  // console.log(serverData)

  useEffect(() => {
    setEnableAutoReminder(docDetails.autoReminder)
    if (docDetails?.settings?.isRenewed === "1") {
      setEnableRenewal(true)
    }
    if (docDetails?.settings?.renewalDate) {
      const date=formatRenewalDate(docDetails?.settings?.renewalDate)
      console.log(date)
      setRenewalDate(date)
    }
  }, [docDetails?.settings])
  const handleReminderChange = (event) => {
    setEnableAutoReminder(event.target.checked)
    setDocDetails({
      ...docDetails,
      settings: {
        ...docDetails?.settings,
        autoReminder: event.target.checked,
      }
    })
  }
  const handleRenewalChange = (event) => {
    setEnableRenewal(event.target.checked)
    setDocDetails(
      {
        ...docDetails,
        settings: {
          ...docDetails.settings,
          ...(enableRenewal && { isRenewed: '0' }),
          ...(!enableRenewal && { isRenewed: '1', isCronRenew: '0', renewalDate: renewalDate })
        }
      }
    )
  }
  const handleRenewalDateChange = (event) => {
    setRenewalDate(event.target.value)
    console.log(event.target.value)
    setDocDetails({
      ...docDetails,
      settings: {
        ...docDetails.settings,
        // renewalDate:tempDate.toISOString(),
        renewalDate: event?.target?.valueAsDate?.toISOString(),
        isCronRenew: '0',
        isRenewed: '1'
      }
    })
  }

  return (
    <div className="w-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <div className="flex justify-between w-full items-center gap-3">
            <span className="text-[14px] text-[#05686E]">Settings</span>
            <span className=" text-[#05686E] ">
              <Tooltip
                placement="top"
                size="md"
                className={`w-[250px]  bg-[#e3feff] p-3 ${nunito.className}`}
                content={saveInfo}
              >
                <Info size={17} />
              </Tooltip>
            </span>
          </div>
        </div>
      </div>
      <div className="p-4  border-b flex flex-col gap-2 ">
        <div className="flex items-start flex-row-reverse  justify-between gap-2">
          <Tooltip
            placement="top"
            size="md"
            className={`w-[250px] bg-[#e3feff] p-3 ${nunito.className}`}
            content="Enable automatic reminder emails for this document. Reminder schedules can be adjusted in Business Settings > Expiration & Reminders"
          >
            <HelpCircle size={16} />
          </Tooltip>

          <Checkbox
            isDisabled={!isEditable}
            onChange={handleReminderChange}
            isSelected={enableAutoReminder}
            classNames={{
              label: "w-full text-[14px]",
            }}
          >
            Enable auto reminders{" "}
          </Checkbox>

        </div>
        <div className="flex items-start flex-row-reverse lg:justify-end justify-between gap-2">
          <Tooltip
            placement="top"
            size="md"
            className={`w-[250px]  bg-[#e3feff] p-3 ${nunito.className}`}
            content="If this option is enabled, all signer must sign this document in order to complete it. If at least one signer declines to sign, this document will be cancelled."
          >
            <HelpCircle size={20} />
          </Tooltip>
          <Checkbox
            onChange={
              (event) =>
                setDocDetails({
                  ...docDetails,
                  settings: {
                    ...docDetails?.settings,
                    requiredAllSigners: event.target.checked,
                  },
                })
              // setdocumnetSettings({
              //     ...documentSettings,
              //     requiredAllSigners: event.target.checked,
              // })
            }
            checked={true}
            isDisabled
            classNames={{
              label: "w-4/5 text-[14px]",
            }}
          >
            Require all signers to sign to complete document{" "}
          </Checkbox>

        </div>
      </div>
      <div className="p-4 border-b flex justify-between lg:justify-start items-center gap-5 ">
        <label className="text-[14px]" htmlFor="doctitle">
          Expire Document After
        </label>
        <select
          disabled={!isEditable}
          name=""
          id=""
          onChange={
            (event) =>
              setDocDetails({
                ...docDetails,
                settings: {
                  ...docDetails?.settings,
                  expires: event.target.value,
                },
              })
            // setdocumnetSettings({
            //     ...documentSettings,
            //     expires: event.target.value,
            // })
          }
          value={docDetails?.settings?.expires}
          className="w-fit border py-2 px-2 bg-[#e3feff] text-[14px]"
          defaultValue={"1d"}
        >
          <option value="1d">1 Day</option>
          <option value="3d">3 Day</option>
          <option value="7d">7 Day</option>
          {/* <option value="2w">2 Weeks</option>
							<option value="1m">1 Month</option>
							<option value="3m">3 Months</option> */}
        </select>
      </div>
      <div className="p-4  border-b flex flex-col gap-4 ">
        <div className="flex items-start flex-row-reverse lg:justify-end justify-between gap-2">

          <Checkbox
            isDisabled={!isEditable}
            // isChecked={isChecked} 
            isSelected={enableRenewal}
            // onValueChange={setIsChecked}
            onChange={handleRenewalChange}
            classNames={{
              label: "w-4/5 text-[14px]",
            }}
          >
            Enable renewal{" "}
          </Checkbox>

        </div>
        {enableRenewal && (
          <div className="flex items-start flex-row-reverse lg:justify-end justify-between gap-2">

            <input
              disabled={!isEditable}
              type="date"
              name="dueDate"
              value={renewalDate}
              min={oneMonthAfter.toISOString().split('T')[0]}
              className="peer h-full w-full rounded-[7px] border border-blue-gray-200 bg-transparent px-3 py-2.5 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-isCheckedn:border placeholder-isCheckedn:border-blue-gray-200 placeholder-isCheckedn:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50 "
              onChange={handleRenewalDateChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DocSettings;
