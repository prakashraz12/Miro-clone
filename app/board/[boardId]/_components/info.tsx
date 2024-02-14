
'use clinet';

import Image from "next/image";
import { useQuery } from "convex/react";
import { Poppins } from "next/font/google";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Link from "next/link";
import { useRenameModal } from "@/store/use-rename-modal";
import { Action } from "@/components/action";
import { Menu } from "lucide-react";

interface InfoProps {
    boardId: string
}

const font = Poppins({
    subsets: ['latin'],
    weight: ['600']
})

export const TabBraker = () => {
    return (
        <div className="text-neutral-300 px-1.5">
            |
        </div>
    )
}

export const Info = ({ boardId }: InfoProps) => {

    const { onOpen } = useRenameModal();

    const data = useQuery(api.api.board.get, {
        id: boardId as Id<"boards">
    })

    if (!data) {
        return <InfoSkeleton />
    }

    return (
        <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center
         shadow-md">
            <Button variant={"board"} className="px-2" asChild>
                <Link href={"/"}> <Image src={"/logo.svg"} alt="border-logo" height={40} width={40} />
                    <span className={cn("text-xl font-bold ml-2 text-black", font.className)}>
                        Lumiar
                    </span>
                </Link>
            </Button>
            <TabBraker />
            <Button variant={"board"} className="text-base font-normal px-2" onClick={() => { onOpen(data?._id, data?.title) }}>
                {data?.title}
            </Button>
            <TabBraker />
            <Action
                id={data?._id}
                title={data?.title}
                side="bottom"
                sideOffSet={10}
            >
                <div>
                    <Button size={"icon"} variant={"board"}>
                        <Menu />
                    </Button>
                </div>
            </Action>
        </div>
    )
}


export const InfoSkeleton = function InfoSkeleton() {
    return (
        <div className="absolute top-2 left-2 bg-white rounded-md px-1.5 h-12 flex items-center
        shadow-md w-[300px]">
        </div>
    )
}