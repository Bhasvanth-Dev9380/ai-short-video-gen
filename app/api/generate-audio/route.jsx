import textToSpeech from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";
import { storage } from "E:/ai short video gen/ai-short-video-generator/app/configs/FireabaseConfig.js";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";

// Initialize the Text-to-Speech client
const client = new textToSpeech.TextToSpeechClient({
    apiKey:process.env.GOOGLE_API_KEY
});

export async function POST(req) {
    const { text, id } = await req.json();
    const storageRef = ref(storage, 'ai-short-video-files/' + id + '.mp3');

    const request = {
        input: { text: text },
        voice: { languageCode: 'en-US', ssmlGender: 'FEMALE' },
        audioConfig: { audioEncoding: 'MP3' },
    };

    // Perform the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);

    // Convert the response to a Buffer
    const audioBuffer = Buffer.from(response.audioContent, 'binary');

    // Upload the audio to Firebase Storage
    await uploadBytes(storageRef, audioBuffer, { contentType: 'audio/mp3' });

    // Get the download URL
    const downloadUrl = await getDownloadURL(storageRef);
    console.log(downloadUrl);

    return NextResponse.json({ Result: 'Success', downloadUrl });
}
