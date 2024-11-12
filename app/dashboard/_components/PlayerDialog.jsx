import React, { useEffect, useState } from 'react';
import { Player } from '@remotion/player';
import RemotionVideo from './RemotionVideo';
import { Button } from '../../../@/components/ui/button';
import { VideoData } from '../../configs/schema';
import { db } from '../../configs/db';
import { eq } from 'drizzle-orm';
import { useRouter } from 'next/navigation';
import loadingGif from '../../../public/loading_dashboard.gif'; // Import the GIF

function PlayerDialog({ playVideo, videoId }) {
    const [openDialog, setOpenDialog] = useState(false);
    const [durationInFrame, setDurationInFrame] = useState(100);
    const [videoData, setVideoData] = useState(null); // Initially null
    const [loading, setLoading] = useState(true); // Loading state
    const router = useRouter();

    useEffect(() => {
        if (playVideo && videoId) {
            setOpenDialog(true);
            GetVideoData();
        }
    }, [playVideo, videoId]);

    const GetVideoData = async () => {
        setLoading(true); // Start loading
        const result = await db.select().from(VideoData)
            .where(eq(VideoData.id, videoId));

        setVideoData(result[0]);
        setLoading(false); // Stop loading
    };

    const closeDialog = () => setOpenDialog(false);

    return (
        <>
            {openDialog && (
                <div className="dialog-overlay" onClick={closeDialog}>
                    <div className="dialog-content" onClick={(e) => e.stopPropagation()}>
                        <div className="dialog-header">
                            <h2 className="dialog-title">Your video is Ready!...🤟</h2>
                            <button className="close-button" onClick={closeDialog}>×</button>
                        </div>
                        <div className="dialog-body">
                            {loading ? ( // Conditionally render a loading GIF
                                <img src={loadingGif.src} alt="Loading video..." style={{ width: 100, height: 100 }} />
                            ) : (
                                <Player
                                    component={RemotionVideo}
                                    durationInFrames={Number(durationInFrame.toFixed(0))}
                                    compositionWidth={300}
                                    compositionHeight={450}
                                    fps={30}
                                    controls={true}
                                    inputProps={{
                                        ...videoData,
                                        setDurationInFrame: (frameValue) => setDurationInFrame(frameValue),
                                    }}
                                />
                            )}
                        </div>
                        <div className="dialog-footer">
                            <Button variant="ghost" onClick={() => { router.replace('/dashboard'); setOpenDialog(false); }}>Cancel</Button>
                            <Button>Export</Button>
                        </div>
                    </div>
                </div>
            )}

            {/* Inline CSS */}
            <style jsx>{`
                .dialog-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }

                .dialog-content {
                    background: white;
                    width: 80%;
                    max-width: 500px;
                    border-radius: 8px;
                    overflow: hidden;
                    box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.15);
                    position: relative;
                    padding: 20px;
                }

                .dialog-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding-bottom: 10px;
                    border-bottom: 1px solid #e0e0e0;
                }

                .dialog-title {
                    font-size: 1.5rem;
                    font-weight: bold;
                    margin: 0;
                }

                .close-button {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: #555;
                }

                .dialog-body {
                    margin-top: 20px;
                    display: flex;
                    justify-content: center;
                }

                .dialog-footer {
                    display: flex;
                    justify-content: center;
                    gap: 50px;
                    margin-top: 20px;
                    padding-top: 10px;
                    border-top: 1px solid #e0e0e0;
                }
            `}</style>
        </>
    );
}

export default PlayerDialog;
