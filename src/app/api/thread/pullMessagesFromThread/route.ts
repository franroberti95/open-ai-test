import OpenAI from "openai";
import {NextRequest, NextResponse} from "next/server";

const API_KEY = process.env.API_KEY;
const ASSISTANT_ID = 'asst_pRH9M4KmkCPW4q50VHOEgZD9';

const openai = new OpenAI({
    apiKey: API_KEY
});

export async function POST(req: NextRequest) {
    try {
        const {threadId} = await req.json();

        const threadMessages = await openai.beta.threads.messages.list(threadId);

        return NextResponse.json(threadMessages);
    } catch (e) {
        return NextResponse.json(e);
    }
}
