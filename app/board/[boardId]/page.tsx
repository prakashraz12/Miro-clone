import { Canvas } from "./_components/canvas";
import { Room } from "@/components/room";
import { Canvasloading } from "./_components/canvas-loading";

interface BoardIdPageProps {
    params: {
        boardId: string;
    }
}


const BoardIdPage = ({ params }: BoardIdPageProps) => {
    return (
        <>
            {/* <Canvasloading/> */}
            <Room roomId={params?.boardId} fallback={<Canvasloading />}>
                <Canvas boardId={params.boardId} />
            </Room></>
    )
}

export default BoardIdPage;