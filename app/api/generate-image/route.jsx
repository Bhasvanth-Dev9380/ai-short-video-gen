import { NextResponse } from "next/server";
import Replicate from "replicate";
import axios from "axios"; // Import axios for making HTTP requests
import { storage } from "E:/ai short video gen/ai-short-video-generator/app/configs/FireabaseConfig.js";
import { ref, getDownloadURL, uploadString } from "firebase/storage";

export async function POST(req) {
    try {
        const { prompt } = await req.json();
        const replicate = new Replicate({
            auth: process.env.REPLICATE_API_TOKEN
        });

        const input = {
            prompt: prompt,
            height: 1280,
            width: 1024,
            num_outputs: 1
        };

        // Run the model to generate an image
        const output = await replicate.run("bytedance/sdxl-lightning-4step:5599ed30703defd1d160a25a63321b4dec97101d98b4674bcc56e41f62f35637", { input });
        
        // Convert the image to base64 format
        const base64Image = await ConvertImage(output[0]);
        
        if (!base64Image) {
            throw new Error("Failed to convert image to base64.");
        }

        const dataUrl = `data:image/png;base64,${base64Image}`;
        const fileName = `ai-short-video-files/${Date.now()}.png`;
        const storageRef = ref(storage, fileName);

        // Upload the base64 image to Firebase Storage
        await uploadString(storageRef, dataUrl, 'data_url');

        // Get the download URL
        const downloadUrl = await getDownloadURL(storageRef);
        console.log(downloadUrl);

        return NextResponse.json({ result: downloadUrl });

    } catch (e) {
        console.error("Error:", e);
        return NextResponse.json({ error: e.toString() });
    }
}

// Helper function to convert an image URL to base64 format
const ConvertImage = async (imageUrl) => {
    try {
        const resp = await axios.get(imageUrl, { responseType: 'arraybuffer' });
        const base64Image = Buffer.from(resp.data).toString('base64');
        return base64Image;
    } catch (e) {
        console.error("Error converting image to base64:", e);
        return null;
    }
};
