'use client';


import { nanoid } from "nanoid"
import { useCallback, useMemo, useState } from "react";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";

import { useCanRedo, useCanUndo, useHistory, useMutation, useOthersMapped, useStorage } from "@/liveblocks.config";
import { Camera, CanvasMode, CanvasState, Color, LayerType, Point } from "@/types/canvas";
import { CursorPresence } from "./cursor-presence";
import { connectionIdToColor, pointerEventToCanvasPoint } from "@/lib/utils";
import { MAX_LAYER } from "@/config/toast-messages";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layerPreview";



interface CanvasProps {
    boardId: string
}

export const Canvas = ({ boardId }: CanvasProps) => {
    const layerIds = useStorage((root) => root.layerIds
    );

    const [canvasState, setCanvasState] = useState<CanvasState>({
        mode: CanvasMode.None
    });

    const [camera, setCamera] = useState<Camera>({ x: 0, y: 0 });
    const [lastUsedColor, setLastUsedColor] = useState<Color>({
        r: 255,
        g: 255,
        b: 255
    });

    const history = useHistory();
    const canUndo = useCanUndo();
    const canRedo = useCanRedo();

    const insertlayer = useMutation(({
        storage, setMyPresence
    }, layerType: LayerType.Ellipse | LayerType.Rectangle | LayerType.Text | LayerType.Note, position: Point) => {
        const liveLayers = storage.get("layers");
        if (liveLayers.size >= MAX_LAYER) {
            return;
        }

        const liveLayerIds = storage.get("layerIds");
        const layerId = nanoid();
        const layer = new LiveObject({
            type: layerType,
            x: position.x,
            y: position.y,
            height: 100,
            width: 100,
            fill: lastUsedColor
        });

        liveLayerIds.push(layerId);
        liveLayers.set(layerId, layer);

        setMyPresence({ selection: [layerId] }, { addToHistory: true });
        setCanvasState({ mode: CanvasMode.None });


    }, [lastUsedColor])


    const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera((camera) => ({
            x: camera.x - e.deltaX,
            y: camera.y - e.deltaY,


        }));

    }, [])

    const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
        const current = pointerEventToCanvasPoint(e, camera);

        setMyPresence({ cursor: current })
    }, [])

    const onPointerLeave = useMutation(({ setMyPresence }) => {

        setMyPresence({ cursor: null })
    }, [])

    const onPointerUp = useMutation(({ }, e) => {
        const point = pointerEventToCanvasPoint(e, camera);

        if (canvasState.mode === CanvasMode.Inserting) {
            insertlayer(canvasState.layerType, point)
        } else {
            setCanvasState({
                mode: CanvasMode.None
            })
        }

        history.resume();
    }, [
        camera, canvasState, history, insertlayer
    ])

    const selections = useOthersMapped((other) => other.presence.selection);

    const onLayerPointerDown = useMutation(({
        self, setMyPresence
    }, e: React.PointerEvent, layerId: string) => {
        if (canvasState.mode === CanvasMode.Pencil || canvasState.mode === CanvasMode.Inserting) {
            return;
        }

 
        history.pause();
        e.stopPropagation();

        const point = pointerEventToCanvasPoint(e, camera);

        if (!self.presence.selection.includes(layerId)) {
            setMyPresence({ selection: [layerId] }, { addToHistory: true });
        }

        setCanvasState({ mode: CanvasMode.Translating, current: point });
    }, [setCanvasState, camera, history, canvasState.mode])

    const layerIdsColorSelection = useMemo(() => {
        const layerIdsColorSelection: Record<string, string> = {};

        for (const user of selections) {
            const [connectionId, selection] = user;

            for (const layerId of selection) {
                layerIdsColorSelection[layerId] = connectionIdToColor(connectionId)
            }
        }

        return layerIdsColorSelection;
    }, [selections])


    return (
        <main className="h-full w-full bg-netural-100 touch-none">
            <Info boardId={boardId} />
            <Participants />
            <Toolbar
                canvasState={canvasState}
                setCanvasState={setCanvasState}
                canRedo={canRedo}
                canUndo={canUndo}
                undo={history?.undo}
                redo={history?.redo}
            />
            <svg className="h-[100vh] w-[100vw]" onPointerUp={onPointerUp} onWheel={onWheel} onPointerLeave={onPointerLeave} onPointerMove={onPointerMove}>
                <g style={{
                    transform: `translate(${camera.x}px, ${camera.y}px)`
                }}>
                    {layerIds.map((layerId) => (
                        <LayerPreview key={layerId} id={layerId} onLayerPointerDown={onLayerPointerDown} selectionColor={layerIdsColorSelection[layerId]} />
                    ))}
                    <CursorPresence />
                </g>
            </svg>
        </main>
    )
}

