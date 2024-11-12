"use client";
import React, { useContext, useEffect, useState } from 'react';
import { Button } from 'E:/ai short video gen/ai-short-video-generator/@/components/ui/button.jsx';
import EmptyState from './_components/EmptyState';
import Link from 'next/link';
import { db } from '../configs/db';
import { eq } from 'drizzle-orm';
import { useUser } from '@clerk/nextjs';
import { VideoData } from '../configs/schema';
import VideoList from '../dashboard/_components/VideoList';
import loadingGif from '../../public/loading_videodata.gif'; // Import the GIF file

function Dashboard() {
  const [videoList, setVideoList] = useState([]);
  const [loading, setLoading] = useState(true); // Loading state
  const { user } = useUser();

  useEffect(() => {
    if (user) {
      GetVideoList();
    }
  }, [user]);

  const GetVideoList = async () => {
    setLoading(true); // Start loading
    const result = await db.select().from(VideoData)
      .where(eq(VideoData?.createdBy, user?.primaryEmailAddress?.emailAddress));

    console.log(result);

    setVideoList(result);
    setLoading(false); // End loading
  };

  return (
    <div>
      <div className='flex justify-between items-center'>
        <h2 className='font-bold text-2xl text-primary'>Dashboard</h2>
        <Link href={'/dashboard/create-new'}>
          <Button>+ Create New</Button>
        </Link>
      </div>

      {/* Show loading GIF if data is still being fetched */}
      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <img 
            src={loadingGif.src} 
            alt="Loading..." 
            style={{ width: 150, height: 150 }} 
          />
        </div>
      ) : (
        <>
          {/* Show empty state or video list based on the fetched data */}
          {videoList?.length === 0 ? (
            <EmptyState />
          ) : (
            <VideoList videoList={videoList} />
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
