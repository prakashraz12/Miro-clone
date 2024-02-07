'use client';


import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import React from "react";

export interface TooltipHintProps {
    label: string,
    children: React.ReactNode;
    side?: "top" | "bottom" | "left" | "right";
    align?: "start" | "center" | "end";
    sideOffset?: number;
    alignOffSet?: number
}


export const TooltipComponent = ({ label, children, side, align, alignOffSet, sideOffset }: TooltipHintProps) => {
    return (
        <TooltipProvider>
            <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                    {children}
                </TooltipTrigger>
                <TooltipContent className="text-white bg-black border-black" side={side} align={align} alignOffset={alignOffSet} sideOffset={sideOffset}>
                    <p className="font-semibold">{label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    )

}