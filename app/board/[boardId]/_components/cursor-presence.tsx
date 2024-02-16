'use client';

import React, { memo } from "react";
import { useOthersConnectionIds } from "@/liveblocks.config";
import { Cursor } from "./cursor";


const Cursors = () => {
    const ids = useOthersConnectionIds();

    return (
        <React.Fragment>
            {
                ids?.map((connectionId) => (
                    <Cursor key={connectionId} connectionId={connectionId} />
                ))
            }
        </React.Fragment>
    )
}
export const CursorPresence = memo(() => {
    return (
        <React.Fragment>
            <Cursors />
        </React.Fragment>
    )
})

CursorPresence.displayName = "CursorPresence";