import React from 'react';
import { render, screen } from '@testing-library/react';
import ChatInterface from '../components/ChatInterface';
import { Message } from '../types';

const makeMsg = (overrides?: Partial<Message>): Message => ({
  id: overrides?.id ?? '1',
  text: overrides?.text ?? 'hello',
  sender: overrides?.sender ?? 'user',
  timestamp: overrides?.timestamp ?? new Date('2024-01-01T00:00:00Z'),
});

describe('ChatInterface', () => {
  it('renders messages with avatars and timestamps', () => {
    const msgs: Message[] = [
      makeMsg({ id: 'u1', text: 'Hi', sender: 'user' }),
      makeMsg({ id: 'a1', text: 'Hello, how can I help?', sender: 'ai' }),
    ];

    render(<ChatInterface messages={msgs} isProcessing={false} conversationId="conv_abc123" />);

    expect(screen.getByText(/Conversation/i)).toBeInTheDocument();
    expect(screen.getByText(/ID:/i)).toBeInTheDocument();
    expect(screen.getByText('Hi')).toBeInTheDocument();
    expect(screen.getByText('Hello, how can I help?')).toBeInTheDocument();
  });

  it('shows processing indicator when isProcessing is true', () => {
    const { container } = render(
      <ChatInterface messages={[]} isProcessing conversationId={undefined} />
    );
    expect(container.querySelector('.typing-indicator')).toBeTruthy();
  });
});
