import React from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../../@/components/ui/select"

function SelectDuration({onUserSelect}) {
  return (
    <div className='mt-7'>
            <h2 className='font-bold text-2xl text-primary'>
                Select the duration of your video
            </h2>
            <p className='text-gray-500'></p>

            <Select onValueChange={(value)=>{
                value!='Custom Prompt' && onUserSelect('duration',value)
            }}>
                <SelectTrigger className="w-full mt-2 p-6 text-lg">
                    <SelectValue placeholder="Select Duration" />
                </SelectTrigger>
                <SelectContent >
                
    <SelectItem className="w-full px-4 py-2 hover:bg-gray-100 cursor-pointer bg-white" value='30 Seconds'>30 Seconds </SelectItem>
    <SelectItem className="w-full px-4 py-2 hover:bg-gray-100 cursor-pointer bg-white" value='60 Seconds'>60 Seconds </SelectItem>
                </SelectContent>
            </Select></div>
  )
}

export default SelectDuration