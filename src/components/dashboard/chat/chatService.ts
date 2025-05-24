

export const sendToN8NAgent = async (userMessage: string) => {
  try {
    const params = new URLSearchParams({
      message: userMessage,
      timestamp: new Date().toISOString(),
      context: 'financial-planning-chat'
    });

    const response = await fetch(`https://voluntus-long-term-capita.app.n8n.cloud/webhook-test/4840a04a-c61f-4b8a-8806-4413e2249f88?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('N8N webhook response:', data);
    
    // Handle different possible response formats from N8N
    let aiResponse = '';
    if (typeof data === 'string') {
      aiResponse = data;
    } else if (data.output) {
      aiResponse = data.output;
    } else if (data.response) {
      aiResponse = data.response;
    } else if (data.message) {
      aiResponse = data.message;
    } else if (data.text) {
      aiResponse = data.text;
    } else {
      aiResponse = "I received your message and I'm processing it. How else can I help you?";
    }

    return aiResponse;
  } catch (error) {
    console.error('Error calling N8N agent:', error);
    throw error;
  }
};

