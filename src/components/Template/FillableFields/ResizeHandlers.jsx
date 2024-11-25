const ResizeHandlers = () => {
  return (
    <>
      {/* north */}
      <span className="absolute rounded-full top-[-5px] left-[47%] w-[20px] h-[10px] border border-gray-300 bg-white shadow-sm" />
      {/* ne */}
      <span className="absolute rounded-full top-[-8px] right-[-8px] w-[16px] h-[16px] border bg-white shadow-sm" />

      <span className="absolute rounded-full bottom-[calc(50%-10px)] right-[-5px] w-[10px] h-[20px] border bg-white shadow-sm" />

      <span className="absolute rounded-full bottom-[-8px] right-[-8px] w-[16px] h-[16px] border bg-white shadow-sm" />

      <span className="absolute rounded-full bottom-[-5px] left-[47%] w-[20px] h-[10px] border bg-white shadow-sm" />

      <span className="absolute rounded-full bottom-[-8px] left-[-8px] w-[16px] h-[16px] border bg-white shadow-sm" />

      <span className="absolute rounded-full bottom-[calc(50%-10px)] left-[-5px] w-[10px] h-[20px] border bg-white shadow-sm" />
      <span className="absolute rounded-full top-[-8px] left-[-8px] w-[16px] h-[16px] border bg-white shadow-sm" />
    </>
  );
};

export default ResizeHandlers;
