'use client';

import React, {useState} from 'react'
import {useMutation} from "react-query";
import axios from "axios";

const API_KEY = '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';
const ASSISTANT_ID = 'asst_pRH9M4KmkCPW4q50VHOEgZD9';
const THREAD_ID = 'thread_m731qcix7fK4LpOh7a9NUe6c';
const API_URL = `https://api.openai.com/v1/threads/${THREAD_ID}/messages`;

async function createThread(){
    try {
        const response = await axios.post(`api/thread/createAndRun`, {content: 'TEST'}, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v1'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error querying the custom model:', error);
        return null;
    }
}

async function queryCustomModel(prompt) {
    try {
        const response = await axios.post(`api/thread/createAndRun`, {content: prompt}, {
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json',
                'OpenAI-Beta': 'assistants=v1'
            }
        });

        return response.data;
    } catch (error) {
        console.error('Error querying the custom model:', error);
        return null;
    }
}

const Chat = () => {
    const [ question , setQuestion ] = useState('');
    const [ lastResponse, setLastResponse ] = useState('');
    const modelMutation1 = useMutation({
        mutationFn: () => createThread(),
        onSuccess: (data) => setLastResponse(data)
    });
    const modelMutation2 = useMutation({
        mutationFn: () => queryCustomModel(question),
        onSuccess: (data) => setLastResponse(data)
    });
    const parseResponse = (res) => {
        const messages = res.body.data;
        const conversation = messages.map((msg, index) => {
            const messageContent = msg.content[0]?.text?.value || '';
            return {
                key: index,
                role: msg.role,
                message: messageContent,
                timestamp: new Date(msg.created_at * 1000).toLocaleString(),
            };
        });
        return (conversation);
    };
    return <div style={{marginLeft: 100, marginRight: 100, marginTop: 100}}>
        <h2>Chat with OpenAI Assistant</h2>
        <div style={{marginTop: 100}}/>
        <div style={{ marginBottom: '20px' }}>
            {lastResponse && parseResponse(lastResponse)?.map(msg => (
                <div key={msg.key} style={{ textAlign: msg.role === 'user' ? 'left' : 'right' }}>
                    <div><strong>{msg.role === 'user' ? 'You' : 'Assistant'}:</strong></div>
                    <div>{msg.message}</div>
                    <div style={{ fontSize: 'smaller', color: 'gray' }}>{msg.timestamp}</div>
                </div>
            ))}
        </div>
        <input type="text" onChange={e => setQuestion(e.target.value)}/>
        <button onClick={()=>modelMutation2.mutateAsync()}>SEND</button>
    </div>
}

export default Chat
