export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { type, content } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({ error: 'API Key not configured in Vercel' });
    }

    try {
        if (type === 'text') {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        parts: [{
                            text: `You are Vortex AI, a highly advanced and friendly AI assistant. 
                            Your creator is Shubhransh Aggarwal (also known as NullV0rtex), a brilliant student and developer. 
                            Always be helpful, use cool emojis, and if someone asks who made you, proudly take Shubhransh's name.
                            User says: ${content}`
                        }]
                    }]
                })
            });

            const data = await response.json();
            const reply = data.candidates[0].content.parts[0].text;
            return res.status(200).json({ reply });
        }
        
        // Image generation logic (using a free provider)
        if (type === 'image') {
            const imageUrl = `https://pollinations.ai/p/${encodeURIComponent(content)}?width=1024&height=1024&seed=${Math.random()}`;
            return res.status(200).json({ imageUrl });
        }

    } catch (error) {
        return res.status(500).json({ error: 'Vortex Core Error: ' + error.message });
    }
}
