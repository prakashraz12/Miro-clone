'use client';

import Image from "next/image";
import { useOrganization, useOrganizationList } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import { TooltipComponent } from "../tooltip-hint";


interface OrgItemProps {
    id: string,
    name: string,
    imageUrl: string
}

export const OrgItem = ({ id, name, imageUrl }: OrgItemProps) => {
    const { organization } = useOrganization();
    const { setActive } = useOrganizationList();

    const isActive = organization?.id === id;

    const onclick = () => {
        if (!setActive) return;

        setActive({ organization: id })
    }

    return (
        <div className="aspect-square relative">
            <TooltipComponent label={name} side="right" align="start" sideOffset={18}>
                <Image fill src={imageUrl} onClick={onclick} alt={name} className={cn("rounded-md cursor-pointer opacity-75 hover:opacity-100 transition", isActive && "opacity-100")} />
            </TooltipComponent>
        </div>
    )

}