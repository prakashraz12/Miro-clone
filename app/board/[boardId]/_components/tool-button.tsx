'use client';

import { Hint } from "@/components/Hint";
import { Button } from "@/components/ui/button";
import { LucideIcon } from "lucide-react";


interface ToolButtonProps {
    label: string;
    icon: LucideIcon;
    onClick: () => void;
    isActive?: boolean;
    isDisabled?: boolean
}


export const ToolButton = ({ label, icon: Icon, onClick, isActive, isDisabled }: ToolButtonProps) => {
    return (
        <Hint label={label} side="right" sideOffset={14}>
            <Button className="" disabled={isDisabled} onClick={onClick} variant={isActive ? "boardActive" : "board"}>
                <Icon />
            </Button>
        </Hint>
    )
}