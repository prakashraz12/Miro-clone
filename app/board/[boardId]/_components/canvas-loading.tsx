'use client';

import { Loader } from 'lucide-react'
import React from 'react'
import { Participantsskeletons } from './participants'
import { Toolbarskeleton } from './toolbar'
import { InfoSkeleton } from './info'

export const Canvasloading = () => {
  return (
    <main className='h-full w-full relative bg-neutral-100 touch-none flex items-center  justify-center'>
      <Loader className='h-6 w-6 text-muted-foreground animate-spin' />
      <InfoSkeleton />
      <Participantsskeletons />
      <Toolbarskeleton />
    </main>
  )
}

