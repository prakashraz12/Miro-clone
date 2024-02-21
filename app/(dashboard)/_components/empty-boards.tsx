"use client";

import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hook/use-api-mutation";
import { useOrganization } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export const EmptyBoards = () => {
    const router = useRouter();
    const { organization } = useOrganization();
    const { mutate, pending } = useApiMutation(api.api.board.create);

    const onCLick = () => {
        if (!organization) return;
        mutate({
            orgId: organization.id,
            title: "untitled"
        }).then((id)=>{
            toast.success("Board Created");
            router.push(`/board/${id}`);
        }).catch((error)=> toast.error("Something went wrong!"));
    }

    return (
        <div className="h-full flex flex-col items-center justify-center">
            <Image src={"/note.svg"} height={110} width={110} alt="empty" />
            <h2 className="text-2xl font-semibold mt-6">Create your first board!</h2>
            <p className="text-muted-foreground text-sm mt-2">
                Start by creating a board for your organization
            </p>
            <div className="mt-6">
                <Button size={"lg"} onClick={onCLick} disabled={pending}>
                    Create board
                </Button>
            </div>
        </div>
    )
}