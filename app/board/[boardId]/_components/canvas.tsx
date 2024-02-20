'use client';


import { nanoid } from "nanoid"
import { useCallback, useMemo, useState } from "react";
import { Info } from "./info";
import { Participants } from "./participants";
import { Toolbar } from "./toolbar";

import { useCanRedo, useCanUndo, useHistory, useMutation, useOthersMapped, useStorage } from "@/liveblocks.config";
import { Camera, CanvasMode, CanvasState, Color, LayerType, Point, Side, XYWH } from "@/types/canvas";
import { CursorPresence } from "./cursor-presence";
import { connectionIdToColor, pointerEventToCanvasPoint, resizeBounds } from "@/lib/utils";
import { MAX_LAYER } from "@/config/toast-messages";
import { LiveObject } from "@liveblocks/client";
import { LayerPreview } from "./layerPreview";
import { SelectionBox } from "./selection-box";
import { SelectionTools } from "./selection-tools";



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

    const translateSelectedLayers = useMutation(({ storage, self }, point: Point) => {
        if (canvasState.mode !== CanvasMode.Translating) {
            return;
        }

        const offSet = {
            x: point.x - canvasState.current.x,
            y: point.y - canvasState.current.y
        };

        const liveLayers = storage.get("layers");

        for (const id of self.presence.selection) {
            const layer = liveLayers.get(id);

            if (layer) {
                layer.update({
                    x: layer.get("x") + offSet.x,
                    y: layer.get("y") + offSet.y
                })
            }
        }
        setCanvasState({ mode: CanvasMode.Translating, current: point });
    }, [canvasState]);

    const unselectLayers = useMutation(({ self, setMyPresence }) => {
        if (self.presence.selection.length > 0) {
            setMyPresence({ selection: [] }, { addToHistory: true })
        }
    }, [])

    const resizeSelectLayers = useMutation(({ storage, self }, point: Point) => {
        if (canvasState.mode !== CanvasMode.Resizing) {
            return;
        }

        const bounds = resizeBounds(canvasState.initialBounds, canvasState.corner, point)
        const liveLayers = storage.get("layers");
        const layer = liveLayers.get(self.presence.selection[0]);

        if (layer) {
            layer.update(bounds);
        };
    }, [canvasState])


    const onWheel = useCallback((e: React.WheelEvent) => {
        setCamera((camera) => ({
            x: camera.x - e.deltaX,
            y: camera.y - e.deltaY,


        }));


    }, [])

    const onPointerMove = useMutation(({ setMyPresence }, e: React.PointerEvent) => {
        const current = pointerEventToCanvasPoint(e, camera);

        if (canvasState.mode === CanvasMode.Translating) {
            translateSelectedLayers(current);
        } else if (canvasState.mode === CanvasMode.Resizing) {
            resizeSelectLayers(current)
        }

        setMyPresence({ cursor: current });

    }, [canvasState, resizeSelectLayers, camera, translateSelectedLayers])

    const onPointerLeave = useMutation(({ setMyPresence }) => {

        setMyPresence({ cursor: null })
    }, [])

    const onPointerDown = useCallback((e: React.PointerEvent) => {
        const point = pointerEventToCanvasPoint(e, camera);

        if (canvasState.mode === CanvasMode.Inserting) {
            return;
        }

        //

        setCanvasState({ origin: point, mode: CanvasMode.Pressing })
    }, [camera, canvasState.mode, setCanvasState])

    const onPointerUp = useMutation(({ }, e) => {
        const point = pointerEventToCanvasPoint(e, camera);

        if (canvasState.mode === CanvasMode.None || canvasState.mode === CanvasMode.Pressing) {
            unselectLayers();

            setCanvasState({
                mode: CanvasMode.None
            });
        }

        if (canvasState.mode === CanvasMode.Inserting) {
            insertlayer(canvasState.layerType, point)
        } else {
            setCanvasState({
                mode: CanvasMode.None
            })
        }

        history.resume();
    }, [
        camera, canvasState, history, insertlayer, unselectLayers
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

    const onResizeHandlePointerDown = useCallback((corner: Side, initialBounds: XYWH) => {
        history.pause();
        setCanvasState({
            mode: CanvasMode.Resizing,
            initialBounds, corner
        })
    }, [])


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
            <SelectionTools camera={camera} setLastUsedColor={setLastUsedColor}/>
            <svg className="h-[100vh] w-[100vw]" onPointerUp={onPointerUp} onWheel={onWheel} onPointerLeave={onPointerLeave} onPointerMove={onPointerMove} onPointerDown={onPointerDown}>
                <g style={{
                    transform: `translate(${camera.x}px, ${camera.y}px)`
                }}>
                    {layerIds.map((layerId) => (
                        <LayerPreview key={layerId} id={layerId} onLayerPointerDown={onLayerPointerDown} selectionColor={layerIdsColorSelection[layerId]} />
                    ))}
                    <SelectionBox onResizeHandlePointerDown={onResizeHandlePointerDown} />

                    <CursorPresence />
                </g>
            </svg>
        </main>
    )
}

