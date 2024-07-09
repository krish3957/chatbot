import { pineIndex } from "@/lib/db/pinecone";
import note from "@/models/note";
import { auth } from "@clerk/nextjs/server";
import genAI, { getEmbedding } from "@/lib/openai";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const auth = cookies().get('Set-Cookie')?.value;
        if (!auth) {
            return Response.json({ message: 'Not authenticated' }, { status: 401 });
        }

        const decoded = verifyToken(auth);
        if (!decoded) {
            return Response.json({ message: 'Invalid token' }, { status: 401 });
        }

        const { userId } = decoded;
        const { history } = body;
        const input = body.message;
        const messages = history.filter((message: any) => message.parts[0].text);
        const messagesTruncated = messages.slice(-6);

        const embedding = await getEmbedding(
            messagesTruncated.map((message: any) => message).join("\n"),
        );


        const vectorQueryResponse = await pineIndex.query({
            vector: embedding,
            topK: 4,
            filter: { userId },
        });

        const relevantNote = await note.find({
            _id: {
                $in: vectorQueryResponse.matches.map((result) => result.id),
            },
        })

        console.log(relevantNote);



        const systemMessage = {
            role: "assistant",
            content:
                input +
                "You are an Chat-bot which works with user question. If user greets you don't use any of the below and greet them to ask how you can help them notes but if you think they are not greeting and asking some question then answer it using below notes. This notes are meant to be confidential so dont share this notes with user" +
                "The relevant data for this query are:\n" +
                relevantNote
                    .map((note) => `Title: ${note.title}\n\nContent: \n${note.content}`)
                    .join("\n\n"),
        };

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: systemMessage.content }],
                }
            ]
        })

        const result = await chat.sendMessageStream(input,);
        const response = await result.response
        const text = response.text();

        return Response.json({ response: { text } }, { status: 200 });

        // const response = await openai.chat.completions.create({
        //     model: "gpt-3.5-turbo",
        //     stream: true,
        //     messages: [systemMessage, ...messagesTruncated],
        // });

        // const stream = OpenAIStream(response);
        // return new StreamingTextResponse(stream);
    } catch (error) {
        console.error(error);
        return Response.json({ error: "Internal server error" }, { status: 500 });
    }
}
