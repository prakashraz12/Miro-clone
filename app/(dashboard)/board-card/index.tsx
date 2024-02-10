'use client';

import Image from "next/image";
import Link from "next/link";
import { OverLay } from "./overlay";
import { useAuth } from "@clerk/nextjs";
import { formatDistanceToNow } from "date-fns";
import { Footer } from "./footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Action } from "@/components/action";
import { MoreHorizontalIcon } from "lucide-react";


interface BoardCardProps {
    id: string,
    authorId: string,
    imageUrl: string,
    title: string,
    createdAt: number,
    orgId: string,
    isFavorite: boolean,
    authorName: string
}

export const BoardCard = ({ id, authorId, imageUrl, title, createdAt, orgId, isFavorite, authorName }: BoardCardProps) => {
    const { userId } = useAuth()
    const authorLabel = userId === authorId ? "You" : authorName;
    const createdAtLabel = formatDistanceToNow(createdAt, { addSuffix: true })
    return (
        <Link href={`/board/${id}`}>
            <div className="group aspect-[100/127] border rounded-lg flex flex-col justify-between overflow-hidden">
                <div className="relative flex-1 bg-amber-50">
                    <Image src={imageUrl} alt={title} fill className="object-fit" />
                    <OverLay />
                    <Action id={id} title={title} side="right">
                        <button className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity px-3 py-2 outline-none">
                           <MoreHorizontalIcon className="text-white opacity-75 hover:opacity-100 transition-opacity"/>
                        </button>
                    </Action>
                </div>
                <Footer isFavorite={isFavorite} title={title
                } authorLabel={authorLabel}
                    createdAtLabel={createdAtLabel}
                    onClick={() => { }} disabled={false} />

            </div>
        </Link>
    )
}

BoardCard.Skeleton = function BoardCardSkeleton() {
    return (
        <div className=" aspect-[100/127] rounded-lg overflow-hidden">
            <Skeleton className="h-full w-full" />
        </div>
    )
}