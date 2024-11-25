import { create } from "zustand";
import {pageSetupOptions} from '@/lib/constants/page';
import { devtools } from "zustand/middleware";
let tempDate = new Date()
  tempDate.setFullYear(tempDate.getFullYear() + 1)
  tempDate = tempDate.toISOString().split('T')[0]

const initialValue = {
    participants: null,
    isApprover: false,
    isActiveUpload:false,
    update: true,
    variableUpdate:false,
    variables:[],
    pageSetup:{
        orientation:'portrait',
        size:pageSetupOptions[0]
    },
    enableAutoReminder:false,
    enableRenewal:false,
    enableStamp:false,
    renewalDate: tempDate,
    stampFile:null,
    
}

export const useTabsStore = create(devtools((set) => ({
    participants: null,
    isApprover: false,
    isActiveUpload:false,
    update: true,
    variableUpdate:false,
    variables:[],
    pageSetup:{
        orientation:'portrait',
        size:pageSetupOptions[0]
    },
    enableAutoReminder:false,
    enableRenewal:false,
    enableStamp:false,
    renewalDate: tempDate,
    stampFile:null,

    setActiveUpload:(item)=>{
        set(()=>({isActiveUpload:item}))
    },
    setParticipants:(item)=>{
        set(()=>({participants:item}))
    },
    setApprover:(item)=>{
        set(()=>({isApprover:item}))
    },
    setUpdate:(item)=>{
        set((item)=>({update:item}))
    },
    updateVariables:()=>{
        set((state)=>{
            // console.log(!state.variableUpdate)
            return {variableUpdate:!state.variableUpdate}; 
        });
    },
    setVariables:(variables)=>{
        set(()=>{
            return {variables:[...variables]};
        })
    },
    resetTabStore:()=>{
        set(()=>initialValue);
    },
    setPageOrientation:(orientation)=>{
        set((state)=>{
            return {
                pageSetup:{
                    ...state.pageSetup,
                    orientation:orientation
                }
            }
        })
    },
    setPageSize:(index)=>{
        set((state)=>{
            return {
                pageSetup:{
                    ...state.pageSetup,
                    size:pageSetupOptions[index]
                }
            }
        })
    },
    setPageSetup:(pageSetup)=>{
        set(()=>{
            return {pageSetup:pageSetup}
        })
    },
    setEnableAutoReminder:(reminder)=>{
        set(()=>{
            return {enableAutoReminder:reminder}
        })
    },
    setEnableRenewal:(renewal)=>{
        set(()=>{
            return {enableRenewal:renewal}
        })
    },
    setRenewalDate:(renewalDate)=>{
        set(()=>{
            return {renewalDate:renewalDate}
        })
    },
    setEnableStamp:(stamp)=>{
        set(()=>{
            return {enableStamp:stamp}
        })
    },
    setStampFile:(file)=>{
        set(()=>{
            return {stampFile:file}
        })
    }

    
})))