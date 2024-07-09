const { GoogleGenerativeAI } = require("@google/generative-ai");
const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
    throw Error("OPENAI_API_KEY is not set");
}

const genAI = new GoogleGenerativeAI(apiKey);

export default genAI;

export async function getEmbedding(text: string) {
    const model = genAI.getGenerativeModel({ model: "embedding-001" });
    const result = await model.embedContent(text);
    const embedding = result.embedding;

    if (!embedding.values) throw Error("Error generating embedding.");
    return embedding.values;
}

export const getEmbedingsForNote = async (title: string, content: string) => {
    const embeddings = await getEmbedding(title + "\n" + content);
    return embeddings;
}