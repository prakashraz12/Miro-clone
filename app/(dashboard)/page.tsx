'use client';

import { BoardList } from "./_components/board-list";
import { EmptyOrg } from "./_components/empty-org";
import { useOrganization } from "@clerk/nextjs";

interface DashBoardPageProps {
  searchParams: {
    search?: string,
    favorites?: string
  }
}
const DashBoard = ({ searchParams }: DashBoardPageProps) => {
  const { organization } = useOrganization();

  return (
    <div className=" flex-1 h-[calc(100%-80px)] p-6">
      {!organization ?
        <EmptyOrg /> : <BoardList query={searchParams} orgId={organization.id} />
      }
    </div>
  );
}

export default DashBoard;
