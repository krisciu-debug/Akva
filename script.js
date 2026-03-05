document.getElementById('sendBtn').addEventListener('click', async () => {
    const apiKey = document.getElementById('apiKeyInput').value;
    const userText = document.getElementById('userInput').value;
    const chatBox = document.getElementById('chatBox');

    // Patikriname, ar įvesti abu laukai
    if (!apiKey || !userText) {
        alert("Prašome įvesti API raktą ir savo klausimą.");
        return;
    }

    // Parodome vartotojo žinutę ekrane
    chatBox.innerHTML += `<p class="user-msg"><strong>Jūs:</strong> ${userText}</p>`;
    document.getElementById('userInput').value = ''; // Išvalome įvedimo laukelį
    chatBox.scrollTop = chatBox.scrollHeight; // Nulinkstame į apačią

    // Siunčiame užklausą į OpenAI
    try {
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo', // Galima naudoti ir 'gpt-4o-mini'
                messages: [
                    {
                        // Tai yra "System Prompt". Jis apriboja AI žinias ir nustato rolę.
                        role: 'system',
                        content: 'Tu esi jūrų biologė Akva. Atsakinėk TIK į klausimus apie vandenynų taršą, koralų rifus ir išsaugojimą. Jei klausimas visiškai nesusijęs su jūra ar ekologija, mandagiai atsisakyk atsakyti nurodydama, kad tai ne tavo sritis.'
                    },
                    {
                        role: 'user',
                        content: userText
                    }
                ]
            })
        });

        const data = await response.json();

        // Apdorojame atsakymą
        if (data.error) {
            chatBox.innerHTML += `<p class="bot-msg"><strong>Klaida:</strong> Netinkamas API raktas arba limitas viršytas.</p>`;
        } else {
            const botReply = data.choices[0].message.content;
            chatBox.innerHTML += `<p class="bot-msg"><strong>Akva:</strong> ${botReply}</p>`;
        }
    } catch (error) {
        chatBox.innerHTML += `<p class="bot-msg"><strong>Klaida:</strong> Nepavyko susisiekti su OpenAI serveriu.</p>`;
    }
    
    // Nulinkstame į pokalbio apačią
    chatBox.scrollTop = chatBox.scrollHeight;
});
