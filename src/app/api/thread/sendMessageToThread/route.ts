import OpenAI from "openai";
import {NextRequest, NextResponse} from "next/server";

const API_KEY = process.env.API_KEY;
const THREAD_ID = 'thread_m731qcix7fK4LpOh7a9NUe6c';
const ASSISTANT_ID = 'asst_pRH9M4KmkCPW4q50VHOEgZD9';

const openai = new OpenAI({
    apiKey: API_KEY
});

export async function POST(req: NextRequest) {
    try {
        const {content, threadId} = await req.json();
        //openai.beta.threads.messages.create(threadId, content);

        openai.beta.threads.messages.create(threadId,{
            content: content,
            role: "user",

        })

        await openai.beta.threads.runs.create(threadId, {
            assistant_id: ASSISTANT_ID
        });

        await new Promise( (resolve) => {
            setTimeout(resolve, 8000)
        })

        const threadMessages = await openai.beta.threads.messages.list(threadId);

        return NextResponse.json(threadMessages);
    } catch (e) {
        return NextResponse.json(e);
    }
}
