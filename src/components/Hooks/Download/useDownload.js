export const useDownload = ()=>{
    const downloadS3Link = (link)=>{
        if(link){
            window.location.href = link
        }
    }
    return {
        downloadS3Link
    }
}