import * as vscode from "vscode";
import { SidebarProvider } from "./SidebarProvider";

export function activate(context: vscode.ExtensionContext) {
  const sidebarProvider = new SidebarProvider(context.extensionUri);

  // Get apikey from configuration
  const apikey = vscode.workspace.getConfiguration().get("quix.apiKey");

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("quix-sidebar", sidebarProvider)
  );

  const explainSelectionButton = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Left
  );

  explainSelectionButton.text = "$(comment-discussion) Explain Code";
  explainSelectionButton.command = "quix.explainSelection";
  explainSelectionButton.show();

  // Register a command to insert text at the cursor position
  context.subscriptions.push(
    vscode.commands.registerTextEditorCommand(
      "insertTextAtCursor",
      (editor, edit, text) => {
        console.log("insertTextAtCursor", text);
        editor.selections.forEach((selection) => {
          edit.insert(selection.active, text);
        });
      }
    )
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("quix.explainSelection", () => {
      const { activeTextEditor } = vscode.window;

      if (!activeTextEditor) {
        vscode.window.showInformationMessage("No active text editor");
        return;
      }

      const text = activeTextEditor.document.getText(
        activeTextEditor.selection
      );

      if (!text) {
        vscode.window.showInformationMessage("No text selected");
        return;
      }

      // Open the sidebar in the current editor
      vscode.commands.executeCommand(
        "workbench.view.extension.quix-sidebar-view"
      );

      // Get active text editor language
      const language = activeTextEditor.document.languageId;

      // send a message to our Sidebar webview
      sidebarProvider._view?.webview.postMessage({
        type: "explain-selection",
        value: {
          text: text,
          language: language,
          apikey: apikey,
        },
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("quix.suggestComment", () => {
      const { activeTextEditor } = vscode.window;

      if (!activeTextEditor) {
        vscode.window.showInformationMessage("No active text editor");
        return;
      }

      const text = activeTextEditor.document.getText(
        activeTextEditor.selection
      );

      if (!text) {
        vscode.window.showInformationMessage("No text selected");
        return;
      }

      // Open the sidebar in the current editor
      vscode.commands.executeCommand(
        "workbench.view.extension.quix-sidebar-view"
      );

      // Get active text editor language
      const language = activeTextEditor.document.languageId;

      // send a message to our Sidebar webview
      sidebarProvider._view?.webview.postMessage({
        type: "add-relevant-comment",
        value: {
          text: text,
          language: language,
          apikey: apikey,
        },
      });
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand("quix.promptSelection", () => {
      const { activeTextEditor } = vscode.window;

      if (!activeTextEditor) {
        vscode.window.showInformationMessage("No active text editor");
        return;
      }

      const text = activeTextEditor.document.getText(
        activeTextEditor.selection
      );

      if (!text) {
        vscode.window.showInformationMessage("No text selected");
        return;
      }

      // Open the sidebar in the current editor
      vscode.commands.executeCommand(
        "workbench.view.extension.quix-sidebar-view"
      );

      // Get active text editor language
      const language = activeTextEditor.document.languageId;

      // send a message to our Sidebar webview
      sidebarProvider._view?.webview.postMessage({
        type: "prompt-selection",
        value: {
          text: text,
          language: language,
          apikey: apikey,
        },
      });
    })
  );
}

export function deactivate() {}
