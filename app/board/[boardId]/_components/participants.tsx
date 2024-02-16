"use client";

import React from 'react'
import { UserAvatar } from './user-avatar';
import { useOthers, useSelf } from '@/liveblocks.config';
import { connectionIdToColor } from '@/lib/utils';

const MAX_SHOWN_USERS = 2
export const Participants = () => {
  const users = useOthers();
  const currentUser = useSelf()

  const hasMoreUsers = users?.length > MAX_SHOWN_USERS

  return (
    <div className='absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md'>

      <div className="flex gap-x-2">
        {users.slice(0, MAX_SHOWN_USERS).map(({ connectionId, info }) => {

          return (
            <UserAvatar borderColor={connectionIdToColor(connectionId)} src={info?.picture} key={connectionId} name={info?.name} fallback={info?.name?.[0] || "T"} />
          )
        })}
        {
          currentUser && (
            <UserAvatar borderColor={connectionIdToColor(currentUser?.connectionId)} src={currentUser.info?.picture} name={`${currentUser?.info?.name} (You)`}
            />
          )
        }
        {hasMoreUsers && (
          <UserAvatar
            name={`${users.length - MAX_SHOWN_USERS} more`}
            fallback={`+${users.length - MAX_SHOWN_USERS}`}
          />
        )}

      </div>
    </div>
  )
}

export const Participantsskeletons = function ParticipantsSkeletions() {
  return (
    <div className='absolute h-12 w-[100px] top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md'>

    </div>
  )
}
