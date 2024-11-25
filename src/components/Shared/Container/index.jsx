export const MainContainer = ({children})=>{
    return (
        <section className="w-full">
        <div className="px-4 md:px-[40px] mx-auto max-w-7xl">
            {children}
        </div>
        </section>
    );
}