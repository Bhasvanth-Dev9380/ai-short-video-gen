import textToSpeech from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";
import { storage } from "../../configs/FireabaseConfig";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

// Initialize the Text-to-Speech client
const client = new textToSpeech.TextToSpeechClient({
    apiKey: process.env.GOOGLE_API_KEY
});

// Custom timeout function
const timeout = (ms) => new Promise((_, reject) => setTimeout(() => reject(new Error("Request Timeout")), ms));

export async function POST(req) {
    const { text, id } = await req.json();
    const storageRef = ref(storage, 'ai-short-video-files/' + id + '.mp3');

    const request = {
        input: { text },
        voice: { languageCode: 'en-US', ssmlGender: 'MALE' },
        audioConfig: { audioEncoding: 'MP3' },
    };

    try {
        // Add a timeout to the Text-to-Speech request
        const [response] = await Promise.race([
            client.synthesizeSpeech(request),
            timeout(10000) // 10 seconds timeout
        ]);

        // Convert the response to a Buffer
        const audioBuffer = Buffer.from(response.audioContent, 'binary');

        // Upload the audio to Firebase Storage
        await uploadBytes(storageRef, audioBuffer, { contentType: 'audio/mp3' });

        // Get the download URL
        const downloadUrl = await getDownloadURL(storageRef);
        console.log(downloadUrl);

        return NextResponse.json({ Result: 'Success', downloadUrl });

    } catch (error) {
        console.error("Error generating audio file:", error.message);
        return NextResponse.json({ Result: 'Failed', error: error.message });
    }
}
