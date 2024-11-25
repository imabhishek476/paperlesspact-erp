import { createContext } from "react"

export const SignAgreementContext = createContext();

export const SignContextProvider = ({children})=>{
    return (
        <SignAgreementContext.Provider value={""}>
            {children}
        </SignAgreementContext.Provider>
    )
}