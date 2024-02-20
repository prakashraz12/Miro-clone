import { useSelf, useMutation } from "@/liveblocks.config";

export const useDeleteLays = ()=>{
    const selection = useSelf((me)=> me.presence.selection);

    return useMutation(({storage, setMyPresence})=>{
        const livelayers = storage.get("layers");
        const liveLayersIds = storage.get("layerIds");

        for(const id of selection){
            livelayers.delete(id);

            const index = liveLayersIds.indexOf(id);

            if(index !== -1){
                liveLayersIds.delete(index)
            }
        }

        setMyPresence({selection:[]}, {addToHistory:true})
    },[selection])
}