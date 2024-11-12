import textToSpeech from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";
import { storage } from "../../configs/FireabaseConfig";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

const client = new textToSpeech.TextToSpeechClient();

// Helper function for timeout
function withTimeout(promise, ms, errorMessage = "Operation timed out") {
    return Promise.race([
        promise,
        new Promise((_, reject) => setTimeout(() => reject(new Error(errorMessage)), ms))
    ]);
}

export async function POST(req) {
    const { text, id } = await req.json();
    const storageRef = ref(storage, `ai-short-video-files/${id}.mp3`);

    // Configure request for Text-to-Speech
    const request = {
        input: { text },
        voice: { languageCode: 'en-US', ssmlGender: 'MALE' },
        audioConfig: { audioEncoding: 'MP3' },
    };

    try {
        // Set timeout for Google Text-to-Speech (e.g., 15 seconds)
        const [response] = await withTimeout(client.synthesizeSpeech(request), 15000, "Text-to-Speech service timed out");

        // Convert audio content to Buffer and upload to Firebase with a timeout (e.g., 10 seconds)
        const audioBuffer = Buffer.from(response.audioContent, 'base64');
        await withTimeout(uploadBytes(storageRef, audioBuffer, { contentType: 'audio/mp3' }), 10000, "Firebase upload timed out");

        // Get the download URL
        const downloadUrl = await getDownloadURL(storageRef);

        return NextResponse.json({ Result: 'Success', downloadUrl });
    } catch (error) {
        console.error("Error in generate-audio:", error);
        return NextResponse.json({ Result: 'Error', message: error.message }, { status: 500 });
    }
}
