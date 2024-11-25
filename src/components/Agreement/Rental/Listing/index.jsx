import { Typography } from "@mui/material";
import AgreementList from "./AgreementList";

const RentalAgreementListingPage = () => {
  return (
    <section className="w-full">
      <div className="px-4 md:px-[40px] mx-auto max-w-7xl">
        <Typography
          sx={{ fontSize: "24px", fontWeight: 700, py: 2, color: "#eabf4e" }}
        >
          Rental Agreement
        </Typography>
        <div className="Search_card__30m7w border border-gray-100 rounded-lg text-white overflow-hidden transition duration-200 relative transform hover:scale-105 cursor-pointer px-5 sm:px-8 bg-gradient-to-r shadow-lg h-[10rem] sm:h-[12rem] from-yellow-50 via-yellow-100 to-logo-golden">
          <div className="w-full h-full flex flex-col justify-center items-start ">
            <h2 className="text:text-base w-full md:text-lg lg:text-xl font-medium text-left text-black">
              Create e-stamped rent agreement
            </h2>
            <h3 className="w-full text-xs md:text-sm text-left mt-1 mb-1 leading-5 md:leading-6 text-gray-700">
              Lowest Price Guaranteed! 
            </h3>
            <button className="flex items-center pb-1 text-xs md:text-sm mt-4 transition duration-200 font-medium text-gray-700 border-b border-gray-700">
              Create Now
            </button>
            <p className="text-gray-700 text-left text-xs mt-4 -mb-4 text-left">
              100% Legally Valid
            </p>
          </div>
        </div>
        <AgreementList/>
      </div>
    </section>
  );
};

export default RentalAgreementListingPage;
