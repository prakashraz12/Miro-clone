'use client';

import React, { memo } from "react";
import { useOthersConnectionIds, useOthersMapped } from "@/liveblocks.config";
import { Cursor } from "./cursor";
import { shallow } from "@liveblocks/client";
import { colorToCss } from "@/lib/utils";
import { Path } from "./path";


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

const Drafts = () => {
    const others = useOthersMapped((other) => ({
        pencilDraft: other.presence.pencilDraft,
        penColor: other.presence.penColor,
    }), shallow);

    return (
        <>
            {others.map(([key, other]) => {
                if (other.pencilDraft) {
                    return (
                        <Path
                            key={key}
                            x={0}
                            y={0}
                            points={other.pencilDraft}
                            fill={other.penColor ? colorToCss(other.penColor) : "#000"}
                        />
                    );
                }

                return null;
            })}
        </>
    )
}
export const CursorPresence = memo(() => {
    return (
        <React.Fragment>
            <Drafts />
            <Cursors />
        </React.Fragment>
    )
})

CursorPresence.displayName = "CursorPresence";