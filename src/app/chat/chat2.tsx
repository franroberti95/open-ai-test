import { Avatar, AvatarImage, AvatarFallback } from "@/app/components/Avatar/Avatar";
import { Textarea } from "@/app/components/TextArea/TextArea";
import { Button } from "@/app/components/Button/Button";
import styled from 'styled-components';
import React, {useState} from "react";
import {useMutation} from "react-query";
import axios from "axios";

// Define styled components for other elements
const Main = styled.main`
  display: flex;
  flex-direction: column;
  height: 100vh; // Example, adjust as needed
  background-color: #ffffff; // Example, adjust as needed
  // Add more styling as needed
`;

const Header = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
  border-bottom: 1px solid #e5e7eb; // Example, adjust as needed
  // Add more styling as needed
`;

const ChatContainer = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  // Add more styling as needed
`;

const MessageGroup = styled.div`
  display: flex;
  align-items: end;
  gap: 0.5rem; // Example, adjust as needed
  // Add more styling as needed
`;

const Message = styled.div`
  padding: 0.5rem;
  border-radius: 0.5rem;
  // Add more styling as needed
`;

const Footer = styled.div`
  border-top: 1px solid #e5e7eb; // Example, adjust as needed
  padding: 1rem;
  // Add more styling as needed
`;
const API_KEY = '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';

async function queryCustomModel(prompt:any) {
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
async function sendMessage(threadId: any, prompt:any) {
    try {
        const response = await axios.post(`api/thread/sendMessageToThread`, {content: prompt, threadId}, {
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

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  // Add more styling as needed
`;
export default function Component() {
    const [ question , setQuestion ] = useState('');
    const [ lastResponse, setLastResponse ] = useState('');
    const [ threadId, setThreadId ] = useState(null);

    const createThreadMutation = useMutation({
        mutationFn: () => queryCustomModel(question),
        onSuccess: (data) => {
            setLastResponse(data.threadMessages);
            setThreadId(data.threadId);
        }
    });
    const sendMessageMutation = useMutation({
        mutationFn: () => sendMessage(threadId, question),
        onSuccess: (data) => setLastResponse(data)
    });
    const onSend = () => {
        console.log(threadId);
        if(threadId)
            sendMessageMutation.mutateAsync();
        else
            createThreadMutation.mutateAsync();
    }
    const parseResponse = (res: any) => {
        const messages = res.body.data;
        const conversation = messages.map((msg: any, index:any) => {
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
    return (
        <Main>
            <Header>
                <h1>Chat</h1>
            </Header>
            <ChatContainer>
                {lastResponse && parseResponse(lastResponse)?.map( (msg: any) =>
                    msg.role === 'user' ?
                        <MessageGroup key={msg.key}>
                            <Avatar>
                                <AvatarImage alt="User avatar" src="/placeholder-avatar.jpg" />
                                <AvatarFallback>You</AvatarFallback>
                            </Avatar>
                            <Message>
                                <p>{msg.message}</p>
                                <div style={{ fontSize: 'smaller', color: 'gray' }}>{msg.timestamp}</div>
                            </Message>
                        </MessageGroup>:
                        <MessageGroup key={msg.key}>
                            <Message className="from-user">
                                <p>{msg.message}</p>
                                <div style={{ fontSize: 'smaller', color: 'gray' }}>{msg.timestamp}</div>
                            </Message>
                            <Avatar>
                                <AvatarImage alt="User avatar" src="/placeholder-avatar.jpg" />
                                <AvatarFallback>Assistant</AvatarFallback>
                            </Avatar>
                        </MessageGroup>)}

            </ChatContainer>
            <Footer>
                <InputGroup>
                    <Textarea onChange={e => setQuestion(e.target.value)} placeholder="Type your message..." />
                    <Button disabled={createThreadMutation.isLoading || sendMessageMutation.isLoading} onClick={onSend}>{
                        createThreadMutation.isLoading || sendMessageMutation.isLoading ? 'Loading...' : 'Send'
                    }</Button>
                </InputGroup>
            </Footer>
        </Main>
    )
}
