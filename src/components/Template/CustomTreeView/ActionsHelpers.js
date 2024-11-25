import { addToFav, createFolder, deleteNode } from "../../../Apis/folderStructure";

export async function handleFav(node,refreshParent,isFavourite) {
    try{
        console.log(node._id);
        const folder = await addToFav(node._id,isFavourite);
        console.log(folder);
        if (folder) {
            refreshParent(node);
        }

    }catch(err){
        console.log(err);
    }
    // console.log(folderName, levels);
}
export async function handleDelete(node,refreshParent) {
    try{
        console.log(node._id);
        const folder = await deleteNode(node._id);
        console.log(folder);
        if (folder) {
            refreshParent(node);
        }

    }catch(err){
        console.log(err);
    }
}

export async function handleCreate(folderName,parentId,isFile,refreshParent,refreshFolder,refreshRoot,node,setFolderName,type,pageSetup) {
    try{
        console.log(parentId);
        const folder = await createFolder(folderName, parentId, isFile,type,pageSetup);
        console.log(folder);
        if (folder) {
            // await fetchfolderStructure();
            // if(parentId!=='root'){
            //     await fetchfolderStructureByPath(parentId);
            // }
            if(parentId==='root'){
                refreshRoot();
            }
            if(node?.parent==='root'){
                refreshFolder(parentId);
            }
            refreshParent(node);
            setFolderName("");
            // setUpdate((prev) => !prev)
        }

    }catch(err){
        console.log(err);
    }
}