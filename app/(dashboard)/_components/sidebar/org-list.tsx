'use client';

import { useOrganizationList } from "@clerk/nextjs";
import { OrgItem } from "./org-item";

export const OrgList = () => {
    const { userMemberships } = useOrganizationList({
        userMemberships: {
            infinite: true
        }
    })

    if (!userMemberships.data?.length) return null;

    return (
        <ul className="space-y-4">
            {userMemberships.data?.map((item, i) => (
                <OrgItem id={item.id} name={item.organization.name} imageUrl={item.organization.imageUrl} key={i} />
            ))}
        </ul>
    )
}