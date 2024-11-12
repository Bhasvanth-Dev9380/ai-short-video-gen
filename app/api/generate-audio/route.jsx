import textToSpeech from "@google-cloud/text-to-speech";
import { NextResponse } from "next/server";
import { storage, firestore } from "../../configs/FireabaseConfig";
import { ref, getDownloadURL, uploadBytes } from "firebase/storage";
import { doc, setDoc, getDoc } from "firebase/firestore";

const client = new textToSpeech.TextToSpeechClient();

export async function POST(req) {
    const { text, id } = await req.json();
    const storageRef = ref(storage, 'ai-short-video-files/' + id + '.mp3');
    const jobRef = doc(firestore, "audio_jobs", id);

    // Immediately set a pending job in Firestore
    await setDoc(jobRef, {
        status: "pending",
        downloadUrl: null
    });

    // Start async processing for text-to-speech
    generateAudioJob(text, id, storageRef, jobRef);

    // Return the job ID for the client to poll
    return NextResponse.json({ jobId: id, status: "pending" });
}

// Asynchronous function to generate audio and update job status
async function generateAudioJob(text, id, storageRef, jobRef) {
    const request = {
        input: { text },
        voice: { languageCode: 'en-US', ssmlGender: 'MALE' },
        audioConfig: { audioEncoding: 'MP3' },
    };

    try {
        // Generate the speech audio
        const [response] = await client.synthesizeSpeech(request);
        const audioBuffer = Buffer.from(response.audioContent, 'binary');

        // Upload audio to Firebase Storage
        await uploadBytes(storageRef, audioBuffer, { contentType: 'audio/mp3' });

        // Get download URL
        const downloadUrl = await getDownloadURL(storageRef);

        // Update job status in Firestore
        await setDoc(jobRef, {
            status: "completed",
            downloadUrl: downloadUrl
        }, { merge: true });
    } catch (error) {
        console.error("Error generating audio:", error);
        // Set the job status to failed in Firestore in case of an error
        await setDoc(jobRef, { status: "failed" }, { merge: true });
    }
}
