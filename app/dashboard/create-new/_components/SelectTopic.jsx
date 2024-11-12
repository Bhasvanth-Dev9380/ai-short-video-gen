"use client"
import React, { useState } from 'react'

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "E:/ai short video gen/ai-short-video-generator/@/components/ui/select.jsx"

import {Textarea} from 'E:/ai short video gen/ai-short-video-generator/@/components/ui/textarea.jsx'

function SelectTopic({onUserSelect}) {
    const options = ['Custom Prompt', 'Random AI Story', 'Scary Story','Historical Facts','Bed Time Story','Motivational','Fun Facts'];
    const [selectedOpton,setSelectedOption]=useState();
    return (
        <div>
            <h2 className='font-bold text-2xl text-primary'>
                Content
            </h2>
            <p className='text-gray-500'>What is the topic of your video</p>

            <Select onValueChange={(value)=>{setSelectedOption(value)
                value!='Custom Prompt' && onUserSelect('topic',value)
            }}>
                <SelectTrigger className="w-full mt-2 p-6 text-lg">
                    <SelectValue placeholder="Content Type" />
                </SelectTrigger>
                <SelectContent >
                {options.map((item, index) => (
    <SelectItem className="w-full px-4 py-2 hover:bg-gray-100 cursor-pointer bg-white" key={index} value={item}>{item} </SelectItem>
))}
                </SelectContent>
            </Select>
            {selectedOpton=='Custom Prompt' && <div>
                <Textarea className ='mt-3' onChange={(e)=>onUserSelect('topic',e.target.value)}placeholder="Write prompt on which you want to generate video"/>
            </div>
                }

        </div>
    )
}

export default SelectTopic