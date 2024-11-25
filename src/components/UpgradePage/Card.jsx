import { Drawer } from "@mui/material";
import { Button } from "@nextui-org/react";
import { CheckCircle2, DollarSign } from "lucide-react";
import React, { useState } from "react";
import ContactForm from "./ContactForm";
import { useRouter } from "next/router";

const CTA = ({
  title,
  cta,
  sidebarType,
  sidebar,
  setSidebar,
  setSidebarType,
}) => {
  const router = useRouter();
  // const [plan, setPlan] = useState(null);
  const handleClick = (sidebarType, plan) => {
    if (sidebarType === "free") {
      router.push("/dashboard");
    } else {
      // setPlan(plan);
      setSidebarType(sidebarType);
      setSidebar(true);
    }
  };
  return (
    <>
      <Button
        onPress={() => handleClick(sidebarType)}
        className="capitalize rounded-full text-white font-[600] bg-[#056a70ff]"
      >
        {cta}
      </Button>
      <Drawer anchor={"right"} open={sidebar} onClose={() => setSidebar(false)}>
        <div className="h-full flex flex-col justify-center items-center lg:min-w-[550px]">
          <ContactForm setSidebar={setSidebar} plan={title} />
        </div>
      </Drawer>
    </>
  );
};

const Card = ({ item, quoteType, index, setSnackbarMsg, setSnackbarOpen }) => {
  const [sidebar, setSidebar] = useState(false);
  const [sidebarType, setSidebarType] = useState(null);

  if (item?.isPopular) {
    return (
      <div className="flex grid-span-2 flex-col md:max-w-[300px] h-full p-4 border-2 border-[#05686E] rounded-lg  shadow-sm">
        <h2 className="text-[12px] font-semibold h-5 text-[#05686E]">
          Most Popular
        </h2>
        <div className="min-h-[220px] flex flex-col gap-4">
          <h2 className="text-[24px] font-bold">{item?.title}</h2>
          <span className="text-[14px] font-medium">{item?.description}</span>
          <span className="flex items-center text-[24px] font-bold">
            <DollarSign />
            {quoteType === "Monthly" ? item?.monthlyCost : item?.yearlyCost} USD
          </span>
          <CTA
            cta={item?.cta}
            sidebarType={"payment"}
            sidebar={sidebar}
            setSidebar={setSidebar}
            setSidebarType={setSidebarType}
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMsg={setSnackbarMsg}
            title={item?.title}
          />
        </div>
        <div className="flex flex-col gap-2 items-start justify-start">
          <h6 className="font-semibold text-[14px]">{item?.featureTitle}</h6>
          {item?.features.map((feature, index) => {
            return (
              <div
                key={index}
                className="flex justify-start items-center gap-2"
              >
                <span className="min-w-6 flex justify-start items-center">
                  <CheckCircle2 className="min-w-5 min-h-5 max-w-5 max-h-5 text-[14px] text-[#05686E]" />
                </span>
                <span className="text-[14px] flex justify-start items-center gap-2">
                  {" "}
                  {feature}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
  if (item?.title === "Free") {
    return (
      <div className="flex grid-span-2 flex-col md:max-w-[300px] h-full p-4 border-2 border-[#05696e3a] rounded-lg">
        <h2 className="text-[12px] font-semibold h-5 text-[#05686E]">
          Current Plan
        </h2>
        <div className="min-h-[220px] flex flex-col gap-4">
          <h2 className="text-[24px] font-bold">{item.title}</h2>
          <span className="text-[14px] font-medium">{item.description}</span>
          <span className="flex items-center text-[24px] font-bold">
            <DollarSign />
            {quoteType === "Monthly" ? item.monthlyCost : item.yearlyCost} USD
          </span>
          <CTA
            cta={item?.cta}
            sidebarType={"free"}
            sidebar={sidebar}
            setSidebar={setSidebar}
            setSidebarType={setSidebarType}
            setSnackbarOpen={setSnackbarOpen}
            setSnackbarMsg={setSnackbarMsg}
            title={item?.title}
          />
        </div>
        <div className="flex flex-col gap-2 items-start">
          <h6 className="font-semibold text-[14px]">{item.featureTitle}</h6>
          {item.features.map((feature, index) => {
            return (
              <div
                key={index}
                className="flex justify-start items-center gap-2"
              >
                <span className="min-w-6 flex justify-start items-center">
                  <CheckCircle2 className="min-w-5 min-h-5 max-w-5 max-h-5 text-[14px] text-[#05686E]" />
                </span>
                <span className="text-[14px] flex justify-start items-center gap-2">
                  {" "}
                  {feature}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex grid-span-2 flex-col md:max-w-[300px] h-full p-4 border-2 rounded-lg">
      <div className="min-h-[220px] flex flex-col gap-4 md:mt-5">
        <h2 className="text-[24px] font-bold">{item.title}</h2>
        <span className="text-[14px] font-medium">{item.description}</span>
        <span className="flex items-center text-[24px] font-bold">
          <DollarSign />
          {quoteType === "Monthly" ? item.monthlyCost : item.yearlyCost} USD
        </span>
        <CTA
          cta={item?.cta}
          sidebarType={index === 3 ? "contact" : "payment"}
          sidebar={sidebar}
          setSidebar={setSidebar}
          setSidebarType={setSidebarType}
          setSnackbarOpen={setSnackbarOpen}
          setSnackbarMsg={setSnackbarMsg}
          title={item?.title}
        />
      </div>
      <div className="flex flex-col gap-2 items-start">
        <h6 className="font-semibold text-[14px]">{item.featureTitle}</h6>
        {item.features.map((feature, index) => {
          return (
            <div key={index} className="flex justify-start items-center gap-2">
              <span className="min-w-6 flex justify-start items-center">
                <CheckCircle2 className="min-w-5 min-h-5 max-w-5 max-h-5 text-[14px] text-[#05686E]" />
              </span>
              <span className="text-[14px] flex justify-start items-center gap-2">
                {" "}
                {feature}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Card;
