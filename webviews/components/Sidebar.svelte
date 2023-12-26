<script lang="ts">
    import { onMount } from 'svelte';
    import { marked } from 'marked';

    let loading = false;
    let text = "";
    const API_KEY = "";

    const getTypingEffect = (result : string) => {
        // Wait for 1 second before typing
        text = "";

        const interval = setInterval(() => {
                            text = result.substring(0, text.length + 1);
                            if (text === result) {
                                clearInterval(interval);
                            }
                        }, 20);
    }

    onMount(() => {
        window.addEventListener('message', event => {
            const message = event.data; 
            let result = ""

            switch (message.type) {
                case 'explain-selection':
                    
                    if(message.value.text.length > 0){
                        text = message.value.text;
                        const language = message.value.language;

                        generateContent(language,text).then(data => {
                            loading = false;
                            result = data.candidates[0].content.parts[0].text;
                            getTypingEffect(result);
                        });
                    }
                    else {
                        result = "Please select a code block to explain.";
                        getTypingEffect(result);
                    }
                    break;
            }
        });
    })

    const generateContent = async (language: string, code : string) => {
        loading = true;
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    // Write a promt to explain the given code provided the language of the code for an AI
                                    text: `Given the programming language ${language} and the following code snippet: ${code} summarize the overall meaning and functionality of the code. In your explanation, try to write in a non-technical manner. Do not describe what each line does in the code, but rather provide a high-level understanding of the overall functionality of the code snippet and the purpose it serves within the context of the program."`
                                }
                            ]
                        }
                    ]
                })
            }
        );

        const data = await response.json();
        return data;
    }

</script>

<style>
    .markdown-container {
        position: relative;
        margin: 5px;
        padding-top: 10px;
        border: 1px solid var(--vscode-input-border);   
        background-color: var(--vscode-editor-background);
    }

    .logo {
        width: 24px;
        height: 24px;
    }

    .header {
        display: flex;
        align-items: center;
        margin-top: 10px;
        padding: 0px 10px;
    }

    h1 {
        font-size: 20px;
        margin-right: 2px;
        font-weight: bold;
    }

    .preview {
		box-sizing: border-box;
		display: block;
		width: 100%;
		height: 75%;
        font-size: 14px;
        line-height: 2rem;
		margin: 2px;
        padding: 10px;
	}
    
    .divider {
        width: 100%;
        background-color: var(--vscode-input-border); 
        height: 1px;
        margin-bottom: 15px;
    }

    .copy-btn {
        all: unset;
        position: absolute;
        top: 5px;
        right: 5px;
        padding: 5px;
        border-radius: 4px;
        background-color: var(--vscode-checkbox-background);
        color: var(--vscode-checkbox-foreground);
        border: 1px solid var(--vscode-checkbox-border);
        font-size: 12px;
        cursor: pointer;
    }

    .copy-btn:hover {
        border: 1px solid var(--vscode-checkbox-selectBorder);
        background-color: var(--vscode-checkbox-selectBackground);
    }

</style>


<div class="header">
    <h1>Quix.AI</h1>
    <div>
    <svg class="logo" width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M5.558 2.642a3.698 3.698 0 0 0-.123-.01A1.47 1.47 0 0 0 3.999 1.52v1.307a4.898 4.898 0 0 0-2.993 3.587v.39c.459.836 1.906 1.13 2.154 1.18.027.006.04.009.035.009-2.419.32-2.19 2.249-2.19 2.249a1 1 0 0 0 1 .93c.272-.019.538-.08.79-.18h2.06a3 3 0 0 0-.36 1h-.32a2.55 2.55 0 0 0-2.17 2.528.42.42 0 0 0 .39.48h6.677a3.76 3.76 0 0 0 3.929-4.158 3.649 3.649 0 0 0-.75-2.09l-.11-.14c-.43-.55-.68-.909-.55-1.289.13-.38.365-.4.365-.4s.185-.03.455.09c.22.128.46.22.71.27a1.58 1.58 0 0 0 1.736-.905c.095-.208.143-.435.143-.664.006-.718-.33-1.455-.725-2.088a4.998 4.998 0 0 0-1.554-1.57 3.998 3.998 0 0 0-2.639-.4 3.049 3.049 0 0 0-1.67.89 3.56 3.56 0 0 0-.779 1.359 4.358 4.358 0 0 0-.636-.747v-.159A1.47 1.47 0 0 0 5.558 1.52v1.122zm5.304 8.739c.111.741.22 1.821-.867 2.442-.296.103-.608.16-.923.167H3.215a1 1 0 0 1 .92-1h1.279v-.499a1.79 1.79 0 0 1 1.653-1.825l-.626-.887c-.236.067-.463.153-.577.233H2.655a.754.754 0 0 0-.264.07c-.138.055-.274.109-.396.03-.2-.13.11-1.12 1.01-1.12h1c.49 0 .57-.54.57-.54l.28-1.129a3.389 3.389 0 0 1-2.85-.93 3.389 3.389 0 0 1 3.14-2.658l.083.002c.26.008.435.014.776.168.93.42 2.149 2.469 2.149 2.469l.06.09h.17v-.07c-.06-.443-.02-1.464.116-1.89.137-.424.367-.814.673-1.14a2.349 2.349 0 0 1 1.3-.659 2.639 2.639 0 0 1 1.86.29c.46.284.85.67 1.139 1.127.289.457.476.836.535 1.374-.001.02 0 .047.002.081.007.143.02.39-.128.547-.127.135-.448.23-.67.18a1.57 1.57 0 0 1-.45-.18 1.33 1.33 0 0 0-1.139-.13 1.42 1.42 0 0 0-.94 1 2.318 2.318 0 0 0 .64 2.238l.11.14c.347.434.546.966.57 1.52a2.999 2.999 0 0 1-.306 1.425 2.708 2.708 0 0 0-.464-1.304l-.37.368zM4.24 5a.5.5 0 1 0 0 1 .5.5 0 0 0 0-1z"/></svg>
</div>    
</div>

<div class="preview">{@html marked(
"**Welcome to Quix AI!** I'm here to assist you in accomplishing tasks faster.\n \n Powered by AI, I'm designed to enhance efficiency, though surprises and errors may occur. Please verify any generated code or suggestions."
)}</div>

<div>
    <div class="preview">{@html marked(
        "- Explain Selection - Ctrl+Shift+E"
        )}</div>
</div>

<!-- Add a small div at top right corner of markdown-container with a copy button. On click, copy the text to clipboard. -->

{#if text.length > 0}

    <div class="divider"/>

    {#if loading}
        <div class="markdown-container">
            <div class="preview">Loading...</div>
        </div>
    {/if}

    {#if !loading}
        <div class="markdown-container">
            <button class="copy-btn" on:click={() => navigator.clipboard.writeText(text)}>
                <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor"><path fill-rule="evenodd" clip-rule="evenodd" d="M4 4l1-1h5.414L14 6.586V14l-1 1H5l-1-1V4zm9 3l-3-3H5v10h8V7z"/><path fill-rule="evenodd" clip-rule="evenodd" d="M3 1L2 2v10l1 1V2h6.414l-1-1H3z"/></svg>
            </button>
            <div class="preview">{@html marked(text)}</div>
        </div>
    {/if}
{/if}   