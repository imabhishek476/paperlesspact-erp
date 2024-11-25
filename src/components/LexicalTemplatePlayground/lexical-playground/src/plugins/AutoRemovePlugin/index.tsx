import { pixelToNumber } from "@/lib/helpers/templateHelpers";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CLEAR_EDITOR_COMMAND, EditorState, NodeKey } from "lexical";
import { isEqual } from "lodash-es";
import { useEffect } from "react";

type IntentionallyMarkedAsDirtyElement = boolean;

export default function AutoRemovePlugin({ id, allowedHeight }: { id: string, allowedHeight: string }): JSX.Element {
  const [editor] = useLexicalComposerContext();
  console.log(allowedHeight);
  useEffect(() => {
    const removeUpdateListener = editor.registerUpdateListener(
      ({
        dirtyElements,
        dirtyLeaves,
        editorState,
        prevEditorState,
        tags,
      }: {
        dirtyElements: Map<NodeKey, IntentionallyMarkedAsDirtyElement>;
        dirtyLeaves: Set<NodeKey>;
        editorState: EditorState;
        normalizedNodes: Set<NodeKey>;
        prevEditorState: EditorState;
        tags: Set<string>;
      }) => {
        const contentEditableDiv: HTMLDivElement = document.getElementById(id) as HTMLDivElement;
        if (contentEditableDiv) {
          const { height } = contentEditableDiv?.getBoundingClientRect();
          console.log(allowedHeight);
          // debugger;
          if (height > pixelToNumber(allowedHeight) && !tags.has('page-overflow')) {
            // debugger;
            editor.setEditorState(prevEditorState,{tag:'page-overflow'});
          }
        }

      }
    );
    return () => {
      removeUpdateListener();
    }
  }, [allowedHeight]);
  return <></>;
}
