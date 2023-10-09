import OpenAI from "openai";
import Configuration from "openai";


export const getCompletion = async (apiKey, message) => {

    const configuration = new Configuration({ apiKey: apiKey });
    const openai = new OpenAI(configuration);

    try {
        const response = await openai.chat.completions.create({
            messages: message,
            // "This model was trained for Diet Doctor. As training data, 30 
            // questions were used, obtained with artificial intelligence from 
            // the data on the https://www.dietdoctor.com/about page.
            model: "ft:gpt-3.5-turbo-0613:personal::86RYT5jQ",
        })
        return response.choices[0].message.content

    } catch (error) {
        return error.message || 'An unknown error occurred'
    }
}