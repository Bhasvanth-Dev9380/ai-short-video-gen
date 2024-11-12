import textToSpeech from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";
import { storage } from "../../configs/FirebaseConfig";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

const client = new textToSpeech.TextToSpeechClient(); // Make sure to use service account auth

export async function POST(req) {
    const { text, id } = await req.json();
    const storageRef = ref(storage, `ai-short-video-files/${id}.mp3`);
    
    try {
        const request = {
            input: { text },
            voice: { languageCode: 'en-US', ssmlGender: 'MALE' },
            audioConfig: { audioEncoding: 'MP3' },
        };
        
        const [response] = await client.synthesizeSpeech(request);
        const audioBuffer = Buffer.from(response.audioContent, 'base64');

        await uploadBytes(storageRef, audioBuffer, { contentType: 'audio/mp3' });
        const downloadUrl = await getDownloadURL(storageRef);
        
        return NextResponse.json({ Result: 'Success', downloadUrl });
    } catch (error) {
        console.error("Error generating audio:", error);
        return NextResponse.json({ Result: 'Error', message: error.message }, { status: 500 });
    }
}
