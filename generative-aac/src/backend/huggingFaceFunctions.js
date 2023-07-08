export async function getHFImage(prompt) {
    let data = {
        inputs: prompt,
        options: {
            wait_for_model: true,
        },
    };

    const response = await fetch(
        "https://api-inference.huggingface.co/models/jjcavallo5/generative_aac",
        {
            headers: { Authorization: `Bearer ${process.env.REACT_APP_HF_API_KEY}` },
            method: "POST",
            body: JSON.stringify(data),
        }
    );

    const result = await response.blob();
    return result;
}
