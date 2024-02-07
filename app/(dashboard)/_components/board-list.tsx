'use client';

interface BoardListProps {
    orgId: string,
    query: {
        search?: string;
        favorites?: string
    }
}

export const BoardList = ({
    orgId,
    query
}: BoardListProps) => {
    const data = []

    if (!data?.length && query.search) {
        return (
            <div>
                Try searching
            </div>
        )
    }

    if (!data?.length && query.favorites) {
        return (
            <div>
                No favorites
            </div>
        )
    }

    if (!data?.length) {
        return (
            <div>
                no board
            </div>
        )
    }
    
    return (
        <div>
            {JSON.stringify(query)}
        </div>
    )
}