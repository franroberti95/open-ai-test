import OpenAI from "openai";
import {NextRequest, NextResponse} from "next/server";

const API_KEY = process.env.API_KEY;
const ASSISTANT_ID = 'asst_pRH9M4KmkCPW4q50VHOEgZD9';
const THREAD_ID = 'thread_m731qcix7fK4LpOh7a9NUe6c';
const API_URL = `https://api.openai.com/v1/threads/${THREAD_ID}/messages`;

const openai = new OpenAI({
    apiKey: API_KEY
});

export async function POST(req: NextRequest) {
    try {
        const {content, threadId} = (await req.json());
        const run = await openai.beta.threads.createAndRun({
            assistant_id: ASSISTANT_ID,
            thread: {
                messages: [
                    { role: "user", content},
                ],
            },
        });

        await new Promise( (resolve) => {
            setTimeout(resolve, 10000)
        })
        const threadMessages = await openai.beta.threads.messages.list(
            run.thread_id
        );

        return NextResponse.json({
            threadMessages,
            threadId: run.thread_id
        });
    } catch (e) {
        return NextResponse.json(e);
    }
}
