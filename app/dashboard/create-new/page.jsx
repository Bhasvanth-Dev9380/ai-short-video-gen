"use client"
import React, { useContext, useEffect, useState } from 'react'
import SelectTopic from './_components/SelectTopic'
import SelectStyle from './_components/SelectStyle'
import SelectDuration from './_components/SelectDuration'
import { Button } from "../../../@/components/ui/button.jsx";
import axios  from 'axios'
import CustomLoading from './_components/CustomLoading'
import {v4 as uuidv4} from 'uuid'
import { text } from 'drizzle-orm/mysql-core'
import { VideoDataContext } from '../../_context/VideoDataContext'
import { useUser } from '@clerk/nextjs'
import {db} from '../../configs/db'
import{VideoData} from "../../configs/schema"
import PlayerDialog from '../_components/PlayerDialog'
import { useRouter } from 'next/router'
import { UserDetailContext } from '../../_context/UserDetailContext'
import { Users } from '../../configs/schema';
import { eq } from 'drizzle-orm';





function CreateNew() {



  const [formData,setFormData]=useState();
  const [loading,setLoading]=useState(false);
  const [videoScript,setVideoScript]=useState();
  const [audioFileUrl,setAudioFileUrl]=useState();
  const [captions,setCaptions]=useState();
  const [imageList,setImageList]=useState();
  const[playVideo,setPlayVideo]=useState();
  const[videoId,setVideoid]=useState();
  const {videoData,setVideoData}=useContext(VideoDataContext);
  const {userDetail,setUserDetail}=useContext(UserDetailContext);
  const {user}=useUser();
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");


  const onHandleInputChange= (fieldName,fieldValue)=>{
    console.log(fieldName,fieldValue)

    setFormData(prev=>({
      ...prev,
      [fieldName]:fieldValue
    }))
  }

  const showCustomToast = (message) => {
    setToastMessage(message);
    setShowToast(true);
  };


  const onCreateClickHandler=()=>{
    // if(!userDetail?.credits>=0){
    //   showCustomToast("You dont have enough credits")
    //   return;
    // }
    GetVideoScript();
  }

  //Get Video Script 

  const GetVideoScript=async()=>{
    setLoading(true)
    const prompt="Write a script to generate "+formData.duration+" video on topic: Interesting "+formData.topic+" along with AI image prompt in "+formData.imageStyle+" format for each scene and give me result in JSON format with imagePrompt and ContentText as field"
    console.log(prompt)
    const resp = await axios.post('/api/get-video-script',{
      prompt:prompt
    })
    if(resp.data.result){
      setVideoData(prev=>({
        ...prev,
        'videoScript':resp.data.result

      }));
      setVideoScript(resp.data.result)
      await GenerateAudioFile(resp.data.result)
    }
  
  
  }

  const GenerateAudioFile = async (videoScriptData) => {
    try {
        setLoading(true);
        let script = '';
        const id = uuidv4();

        // Concatenate all ContentText fields from videoScriptData
        videoScriptData.forEach(item => {
            script += item.ContentText + ' ';
        });

        console.log("Generated Script:", script);

        // Make the API request to generate audio
        const response = await axios.post('/api/generate-audio', {
            text: script,
            id: id
        });

        setVideoData(prev=>({
          ...prev,
          'audioFileUrl':response.data.downloadUrl
  
        }));
        // Check if the response contains the expected download URL
        if (response.data && response.data.downloadUrl) {
            console.log("Audio File URL:", response.data.downloadUrl);
            setAudioFileUrl(response.data.downloadUrl);

            // Pass the download URL to GenerateAudioCaption
            GenerateAudioCaption(response.data.downloadUrl,videoScriptData);
        } else {
            console.error("No download URL found in response:", response);
        }
    } catch (error) {
        console.error("Error generating audio file:", error);
    } 
};




  const GenerateAudioCaption=async (fileUrl,videoScriptData)=>{
    setLoading(true)

    await axios.post('/api/generate-caption',{
      audioFileUrl:fileUrl
    }).then(resp=>{
      console.log(resp.data.result);
      setCaptions(resp?.data.result);
      setVideoData(prev=>({
        ...prev,
        'captions':resp.data.result

      }));
      resp.data.result&&GenerateImage(videoScriptData);
    });
    
  }

  const GenerateImage=async(videoScriptData)=>{
    setLoading(true)
    let images=[];
    for(const element of videoScriptData){
      try{
        const resp=await axios.post('/api/generate-image',{
          prompt:element.imagePrompt
        });
        console.log(resp.data.result);
        images.push(resp.data.result);
      }catch(e){
        console.log('error:'+e)
      }
    }
    setVideoData(prev=>({
      ...prev,
      'imageList':images

    }));
    setImageList(images)
    setLoading(false);
  }






  useEffect(()=>{
    console.log(videoData);
    if (videoData?.videoScript && videoData?.audioFileUrl && videoData?.captions && videoData?.imageList) {
      SaveVideoData(videoData);
  }
  },[videoData])


  const SaveVideoData = async (videoData) => {
    setLoading(true);

    try {
        const result = await db.insert(VideoData).values({
            script: videoData.videoScript || '',
            audioFileUrl: videoData.audioFileUrl || '',
            captions: videoData.captions || '',
            imageList: videoData.imageList || '',
            createdBy: user?.primaryEmailAddress.emailAddress || ''
        }).returning({id:VideoData?.id});

        await UpdateUserCredits();
        setVideoid(result[0].id);
        setPlayVideo(true)
        console.log("Inserted Video Data ID:", result);
    } catch (error) {
        console.error("Error saving video data:", error);
    } finally {
        setLoading(false);
    }
};


const UpdateUserCredits=async ()=>{
  const  result = await db.update(Users).set({
    credits:userDetail?.credits-10
  }).where(eq(Users?.email,user?.primaryEmailAddress?.emailAddress))
  console.log(result);
  setUserDetail(prev=>({
    ...prev,
    "credits":userDetail?.credits-10
  }))

  setVideoData(null);
}



  return (
    <div className='md:px-20'>
      <h2 className='font-bold text-4xl text-primary text-center'>Create New</h2>

      <div className='mt-10 shadow-md p-10'>
        {/* Select Topic*/}
        <SelectTopic onUserSelect={onHandleInputChange}/>
        {/* Select Style*/}
        <SelectStyle onUserSelect={onHandleInputChange}/>
        {/* Select Duration*/}
        <SelectDuration onUserSelect={onHandleInputChange}/>

        {/* Create BUtton*/}

        <Button className='mt-10 w-full' onClick={onCreateClickHandler}>Create Short Video</Button>
         
      </div>

      <CustomLoading loading={loading}/>
      
      <PlayerDialog playVideo ={playVideo} videoId={videoId}/>
    </div>
  )
}

export default CreateNew