export function pageWithNumber(pages) {
    console.log(pages)
    const pagesLength = pages?.length
    let newPagesData = []
    for (let i = 0; i < pagesLength; i++) {
        let page=pages[i]
        newPagesData.push({...page,pageNo: i+1 })
    }
    console.log(newPagesData)
return newPagesData?.filter((page) => page?.visibility === true)
}