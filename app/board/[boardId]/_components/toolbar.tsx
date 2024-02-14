import React from 'react'

export const Toolbar = () => {
  return (
    <div className='absolute top-[50%] -translate-y-[50%] left-2 flex flex-col gap-y-4'>
        <div className='bg-white rounded-md p-1.5 flex gap-y-1 flex-col items-center shadow-md'>
            <div>Pencile</div>
            <div>Squre</div>
            <div>Squre</div>
            <div>Squre</div>
            <div>Squre</div>
            <div>Squre</div>
           
        </div>
        <div className='bg-white rounded-md p-1.5 flex flex-col items-center shadow-md'>
                <div>Undo</div>
                <div>redo</div>
            </div>
    </div>
  )
}



export const Toolbarskeleton = function ToolbarSkeletons(){

  return(
    <div className='absolute shadow-md top-[50%] -translate-y-[50%] left-2 flex rounded-sm flex-col gap-y-4 bg-white h-[360px] w-[52px]'>

   
</div>
  )
}