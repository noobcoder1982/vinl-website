import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const test = async () => {
    try {
        const resp = await axios.post(
            'https://integrate.api.nvidia.com/v1/chat/completions',
            {
                model: "meta/llama-3.1-405b-instruct",
                messages: [{role: 'user', content: 'Say "AI Connected"'}],
                max_tokens: 10
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                }
            }
        );
        console.log('Result:', resp.data.choices[0].message.content);
    } catch (err) {
        console.log('Error:', err.response?.data || err.message);
    }
}
test();
