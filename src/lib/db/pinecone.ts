import { Pinecone } from '@pinecone-database/pinecone';

const apiKey = process.env.PINECONE_API_KEY;
if (!apiKey) {
    throw new Error('Please define the PINECONE_API_KEY environment variable inside .env');
}
const pc = new Pinecone({
    apiKey
});
export const pineIndex = pc.index('chatbot');