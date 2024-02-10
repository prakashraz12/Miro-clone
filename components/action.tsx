'use client';

import { DropdownMenu, DropdownMenuContentProps, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem } from "./ui/dropdown-menu";
import { Link2, PencilIcon, Trash } from "lucide-react";
import { toast } from "sonner";
import { DELETE, FAILED_TO_DELETE, FAILED_TO_LINK_COPIED, LINK_COPIED } from "@/config/toast-messages";
import { useApiMutation } from "@/hook/use-api-mutation";
import { api } from "@/convex/_generated/api";
import { AlertConfirm } from "@/app/(dashboard)/_components/confirm-alert";
import { Button } from "./ui/button";
import { useRenameModal } from "@/store/use-rename-modal";

interface ActionProps {
    children: React.ReactNode;
    side?: DropdownMenuContentProps['side'];
    sideOffSet?: DropdownMenuContentProps["sideOffset"];
    id: string;
    title: string
}


export const Action = ({ children, side, sideOffSet, id, title }: ActionProps) => {
    const {onOpen} = useRenameModal();

    const { mutate, pending } = useApiMutation(api.api.board.remove);

    const onCopyLink = () => {
        navigator.clipboard.writeText(
            `${window.location.origin}/board/${id}`,
        ).then(() => toast.success(LINK_COPIED)).catch((e) => toast.error(FAILED_TO_LINK_COPIED))
    };

    const handleDelete = () => {
        mutate({ id }).then(() => toast.success(DELETE)).catch((e) => toast.error(FAILED_TO_DELETE))
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                {children}
            </DropdownMenuTrigger>
            <DropdownMenuContent onClick={(e) => e.stopPropagation()} side={side} sideOffset={sideOffSet} className="w-60">
                <DropdownMenuItem className="p-3 cursor-pointer" onClick={onCopyLink}>
                    <Link2 className="h-4 w-4 mr-2" />Copy board link
                </DropdownMenuItem>
                <DropdownMenuItem className="p-3 cursor-pointer" onClick={()=>{onOpen(id, title)}}>
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Rename
                </DropdownMenuItem>
                <AlertConfirm header="Delete board?" description="This will delete the board and all of its contents." disabled={pending} onConfirm={handleDelete}>
                    <Button variant={"ghost"} className="p-3 cursor-pointer text-sm w-full justify-start font-normal">

                        <Trash className="h-4 w-4 mr-2" />Delete

                    </Button>
                </AlertConfirm>

            </DropdownMenuContent>
        </DropdownMenu>
    )
}