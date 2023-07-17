export async function getHFImage(prompt) {
    let data = {
        inputs: prompt,
        options: {
            wait_for_model: true,
            use_cache: false,
        },
    };

    const response = await fetch("https://generativeaac.uc.r.appspot.com/hugging-face-api", {
        method: "POST",
        body: JSON.stringify(data),
    });

    const result = await response.blob();
    return result;
}
