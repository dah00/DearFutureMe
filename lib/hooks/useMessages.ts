// lib/hooks/useMessages.ts

import { useEffect, useState, useCallback } from "react";
import { getMessages, createMessage, updateMessage, deleteMessage } from "@/lib/api";
import type { MessagePayload, MessageResponse, ApiResponse } from "@/lib/api";

export function useMessages() {
  const [messages, setMessages] = useState<MessageResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadMessages = useCallback(async () => {
    setIsLoading(true);
    const response = await getMessages();
    if (response.success && response.data) {
      setMessages(response.data);
      setError(null);
    } else {
      setError(response.error ?? "Failed to load messages");
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  const createMessageHandler = async (payload: MessagePayload) => {
    const response = await createMessage(payload);
    if (!response.success || !response.data) {
        return { success: false, error: response.error };
    }
    const newMessage: MessageResponse = response.data;
    setMessages(prev => [newMessage, ...prev]);
  
    return { success: true };
  };

  const updateMessageHandler = async (id: number, payload: Partial<MessagePayload>) => {
    const response = await updateMessage(id, payload);
    if (response.success && response.data) {
      setMessages((prev) =>
        prev.map((message) => (message.id === id ? response.data! : message))
      );
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  const deleteMessageHandler = async (id: number) => {
    const response = await deleteMessage(id);
    if (response.success) {
      setMessages((prev) => prev.filter((message) => message.id !== id));
      return { success: true };
    }
    return { success: false, error: response.error };
  };

  return {
    messages,
    isLoading,
    error,
    reload: loadMessages,
    createMessage: createMessageHandler,
    updateMessage: updateMessageHandler,
    deleteMessage: deleteMessageHandler,
  };
}