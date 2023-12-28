<script lang="ts">
  import { onMount } from "svelte";
  import { marked } from "marked";
  import { getComment, getExplanation, answerPrompt } from "../utils";

  let loading = false;
  let text = "";
  let prompt = "";
  let selectedCode = "";
  let selectedLanguage = "";
  let promptSelection = false;
  let apikey = "";

  const getTypingEffect = (result: string) => {
    text = "";
    const interval = setInterval(() => {
      text = result.substring(0, text.length + 1);
      if (text === result) {
        clearInterval(interval);
      }
    }, 20);
  };

  const handleSubmit = () => {
    loading = true;
    text = selectedCode;
    answerPrompt(prompt, selectedCode, selectedCode, apikey)
      .then((data) => {
        loading = false;
        text = data;
        getTypingEffect(text);
      })
      .catch((err) => {
        console.log(err);
        tsvscode.postMessage({
          type: "onError",
          value: "Error: Please check your API key.",
        });
      });

    promptSelection = false;
  };

  onMount(() => {
    window.addEventListener("message", (event) => {
      const message = event.data;
      let result = "";

      switch (message.type) {
        case "prompt-selection":
          if (message.value.text.length > 0) {
            text = "";
            promptSelection = true;
            selectedCode = message.value.text;
            selectedLanguage = message.value.language;
            apikey = message.value.apikey;
          } else {
            result = "Please select a code block to explain.";
            getTypingEffect(result);
          }
          break;

        case "add-relevant-comment":
          if (message.value.text.length > 0) {
            text = message.value.text;
            const language = message.value.language;
            loading = true;
            promptSelection = false;
            getComment(language, text, message.value.apikey)
              .then((data) => {
                loading = false;
                result = data;
                getTypingEffect(result);
              })
              .catch(() => {
                tsvscode.postMessage({
                  type: "onError",
                  value: "Error: Please check your API key.",
                });
              });
          } else {
            result = "Please select a code block to explain.";
            getTypingEffect(result);
          }
          break;

        case "explain-selection":
          if (message.value.text.length > 0) {
            text = message.value.text;
            const language = message.value.language;
            loading = true;
            promptSelection = false;
            getExplanation(language, text, message.value.apikey)
              .then((data) => {
                loading = false;
                result = data;
                getTypingEffect(result);
              })
              .catch(() => {
                tsvscode.postMessage({
                  type: "onError",
                  value: "Error: Please check your API key.",
                });
              });
          } else {
            result = "Please select a code block to explain.";
            getTypingEffect(result);
          }
          break;
      }
    });
  });
</script>

<div class="header">
		<svg class="logo" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 21">
			<path stroke="currentColor" stroke-linecap="round" stroke-width="1.5" d="M7.24 7.194a24.16 24.16 0 0 1 3.72-3.062m0 0c3.443-2.277 6.732-2.969 8.24-1.46 2.054 2.053.03 7.407-4.522 11.959-4.552 4.551-9.906 6.576-11.96 4.522C1.223 17.658 1.89 14.412 4.121 11m6.838-6.868c-3.443-2.277-6.732-2.969-8.24-1.46-2.054 2.053-.03 7.407 4.522 11.959m3.718-10.499a24.16 24.16 0 0 1 3.719 3.062M17.798 11c2.23 3.412 2.898 6.658 1.402 8.153-1.502 1.503-4.771.822-8.2-1.433m1-6.808a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
	  </svg>
	  <h1>Quix.AI</h1>
</div>

<div class="preview">
  {@html marked(
    "**Welcome to Quix AI!** I'm here to assist you in accomplishing tasks faster.\n \n Powered by Gemini Pro AI, I'm designed to enhance efficiency, though surprises and errors may occur. Please verify any generated code or suggestions.",
  )}
</div>

<div>
  <div class="preview">
    {@html marked(
      "- Explain Selection - Ctrl+Shift+E \n - Suggest Comment - Ctrl+Shift+C \n - Prompt Selection - Ctrl+Shift+M",
    )}
  </div>
</div>

{#if promptSelection}
  <form on:submit={handleSubmit} class="form-container">
    <input
      bind:value={prompt}
      type="text"
      placeholder="Add prompt to your code"
    />
    <button class="submit-button" type="button" on:click={handleSubmit}>
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        ><path
          d="M1 1.91L1.78 1.5L15 7.44899V8.3999L1.78 14.33L1 13.91L2.58311 8L1 1.91ZM3.6118 8.5L2.33037 13.1295L13.5 7.8999L2.33037 2.83859L3.6118 7.43874L9 7.5V8.5H3.6118Z"
        /></svg
      >
    </button>
  </form>
{/if}

{#if text.length > 0}
  <div class="divider" />

  {#if loading}
    <div class="markdown-container">
      <div class="preview">Loading...</div>
    </div>
  {/if}

  {#if !loading}
    <div class="markdown-container">
      <div class="btn-group">
        <button
          class="copy-btn"
          on:click={() => navigator.clipboard.writeText(text)}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            ><path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M4 4l1-1h5.414L14 6.586V14l-1 1H5l-1-1V4zm9 3l-3-3H5v10h8V7z"
            /><path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M3 1L2 2v10l1 1V2h6.414l-1-1H3z"
            /></svg
          >
        </button>
        <button
          class="insert-btn"
          on:click={() =>
            tsvscode.postMessage({ type: "insertTextAtCursor", value: text })}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            ><path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M14 1L15 2V6L14 7L6 7L5 6L5 2L6 1L14 1ZM14 2L6 2L6 6L14 6L14 2Z"
            /><path
              fill-rule="evenodd"
              clip-rule="evenodd"
              d="M14 9L15 10V14L14 15L6 15L5 14L5 10L6 9L14 9ZM14 10L6 10L6 14L14 14L14 10Z"
            /><path
              d="M1 6.39268L2.61414 8.00682L1 9.62096L1.69352 10.3141L4 8.00682L1.69352 5.69995L1 6.39268Z"
            /></svg
          >
        </button>
      </div>
      <div class="preview">{@html marked(text)}</div>
    </div>
  {/if}
{/if}

<style>
  .markdown-container {
    position: relative;
    margin: 5px;
    padding-top: 10px;
    border: 1px solid var(--vscode-input-border);
    background-color: var(--vscode-editor-background);
  }

  .logo {
    width: 20px;
    height: 20px;
  }

  .header {
    display: flex;
    align-items: center;
    margin-top: 10px;
    padding: 0px 10px;
  }

  input {
    padding: 10px 10px;
    border-radius: 3px;
    border: 1px solid var(--vscode-input-border);
  }

  h1 {
    font-size: 20px;
    margin-left: 3px;
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
    margin-bottom: 30px;
  }

  .copy-btn,
  .insert-btn,
  .submit-button {
    all: unset;
    padding: 2px;
    border-radius: 3px;
    color: var(--vscode-icon-foreground);
    cursor: pointer;
  }

  .copy-btn:hover,
  .insert-btn:hover {
    background-color: var(--vscode-checkbox-border);
  }

  .submit-button:hover {
    color: var(--vscode-button-hoverBackground);
  }

  .btn-group {
    display: flex;
    gap: 5px;
    position: absolute;
    border-radius: 5px;
    padding: 3px 5px;
    top: -15px;
    right: 0px;
    border: 1px solid var(--vscode-checkbox-border);
    background-color: var(--vscode-checkbox-background);
  }

  .form-container {
    position: relative;
  }

  .submit-button {
    position: absolute;
    right: 6px;
    top: 8px;
  }
</style>
