const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
});

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
};


export const chatSession = model.startChat({
    generationConfig,
    history: [
        {
            role: "user",
            parts: [
                { text: "Write a script to generate 30 seconds video on topic: Interesting historical story along with AI image prompt in Realistic format for each scene and give me result in JSON format with imagePrompt and ContentText as field" },
            ],
        },
        {
            role: "model",
            parts: [
                { text: "```json\n[\n  {\n    \"imagePrompt\": \"A bustling medieval marketplace, with people bartering for goods, colorful fabrics draped over stalls, and a blacksmith working in the background. Realistic style.\",\n    \"ContentText\": \"In the heart of medieval Europe, where life was a constant struggle against hunger and disease, a tale of resilience and ingenuity unfolded.\"\n  },\n  {\n    \"imagePrompt\": \"A young woman, dressed in simple peasant clothing, gazing determinedly at a book. The scene is lit by candlelight, with bookshelves overflowing with ancient texts. Realistic style.\",\n    \"ContentText\": \"Hildegarde, a young woman from a humble village, possessed a thirst for knowledge that burned brighter than any candle.\"\n  },\n  {\n    \"imagePrompt\": \"Hildegarde, dressed in monastic robes, surrounded by other nuns, teaching them about herbs and medicine. Realistic style.\",\n    \"ContentText\": \"Seeking knowledge, she joined a convent, where she excelled in herbal medicine, music, and theology.  Her intellect shone brighter than any gem.\"\n  },\n  {\n    \"imagePrompt\": \"A close-up of Hildegarde's hand writing in a large, illuminated manuscript. Realistic style.\",\n    \"ContentText\": \"Hildegarde became a visionary, receiving divine visions and recording them in her own hand.\"\n  },\n  {\n    \"imagePrompt\": \"Hildegarde, older and dignified, surrounded by people listening to her speak. A vibrant, medieval city in the background. Realistic style.\",\n    \"ContentText\": \"Her writings and teachings became influential across Europe, touching on medicine, science, and philosophy. She challenged the limitations of her time, paving the way for future generations.\"\n  },\n  {\n    \"imagePrompt\": \"A montage of scenes from Hildegarde's life: writing, teaching, interacting with people.  The final image is a close-up of Hildegarde's face, illuminated by a warm light. Realistic style.\",\n    \"ContentText\": \"Hildegarde, the remarkable woman who dared to dream, and whose legacy continues to inspire us today.\"\n  }\n]\n```\n\n**Explanation:**\n\nThis JSON structure provides a basic outline for a 30-second video about Hildegarde of Bingen. It features six scenes, each with a corresponding image prompt and content text:\n\n* **Scene 1:** Introduces the historical context of medieval Europe.\n* **Scene 2:** Introduces Hildegarde and her passion for knowledge.\n* **Scene 3:** Depicts Hildegarde's journey to a convent and her learning.\n* **Scene 4:** Highlights Hildegarde's visions and writing.\n* **Scene 5:** Shows Hildegarde's influence and impact.\n* **Scene 6:** Concludes with a montage and a final image of Hildegarde.\n\n**Note:**\n\n* You can adjust the content text and image prompts to your liking, adding more details or changing the focus.\n* You can use these prompts to generate images using AI tools like Midjourney or DALL-E 2.\n* The video editing software you use will dictate how you combine the generated images with the voiceover or text overlays. \n" },
            ],
        },
    ],
});

