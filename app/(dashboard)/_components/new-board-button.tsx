
"use client";

import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { useApiMutation } from "@/hook/use-api-mutation";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";

interface NewBoardprop {
    orgId: string;
    disabled?: boolean;
}
export const NewBoardButton = ({ orgId, disabled }: NewBoardprop) => {
    const { mutate, pending } = useApiMutation(api.api.board.create);

    const handleCreateBoard = () => {
        mutate({
            orgId,
            title: "Org"
        }).then((id) => {
            toast.success("Board Created Successfylly!")
        }).catch((error) => toast.error("OPS,Failed to created board!"))
    }

    return (
        <button onClick={handleCreateBoard} disabled={disabled || pending} className={cn("col-span-1 aspect-[100/127] bg-blue-600 rounded-lg hover:bg-blue-800 flex flex-col items-center justify-center py-6", (disabled || pending) && "opacity-75 hover:bg-blue-600 cursor-not-allowed")}>
            <div></div>
            <Plus className="h-12 w-12 text-white stroke-1" />
            <p className="text-sm text-white font-light">
                New board
            </p>
        </button>
    )
}

