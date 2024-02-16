'use client';

import { useStorage } from "@/liveblocks.config";
import { LayerType } from "@/types/canvas";
import React, { memo } from "react";
import { RectLayer } from "./rect-layer";


interface LayerPreviewProprs {
    id: string;
    onLayerPointerDown: (e:React.PointerEvent, layerId:string) => void;
    selectionColor?: string
}


export const LayerPreview = memo(({ id, onLayerPointerDown, selectionColor }: LayerPreviewProprs) => {
    const layer = useStorage((root)=> root.layers.get(id));

    if(!layer){
        return null;
    }

    switch(layer.type){
        case LayerType.Rectangle:return(
           <RectLayer id={id}
           layer={layer}
           onPointerDown={onLayerPointerDown}
           selectionColor={selectionColor}/>
        );
        default:
            return null
    }
   
})


LayerPreview.displayName = "LayerPreview"