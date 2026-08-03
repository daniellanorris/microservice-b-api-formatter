export function formatMoodRequest(data){

    const {
        mood_name,
        note
    } = data;


    return {
        url:
        "https://router.huggingface.co/hf-inference/models/j-hartmann/emotion-english-distilroberta-base",

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: {
            inputs:
            `Mood: ${mood_name}. Note: ${note}`
        }
    };
}