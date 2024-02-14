"use client";

import React from 'react'
import { UserAvatar } from './user-avatar';
import { useOthers, useSelf } from '@/liveblocks.config';

const MAX_SHOWN_USER = 2
export const Participants = () => {
  const users = useOthers();
  const currentUser = useSelf()

  const hasMoreUser = users?.length > MAX_SHOWN_USER

  return (
    <div className='absolute h-12 top-2 right-2 bg-white rounded-md p-3 flex items-center shadow-md'>
      
      <div className="flex gap-x-2">
        {users.slice(0, MAX_SHOWN_USER).map(({ connectionId, info }) => {
          return (
            <UserAvatar src={info?.picture} key={connectionId} name={info?.name} fallback={info?.name?.[0] || "T"} />
          )
        })}
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
