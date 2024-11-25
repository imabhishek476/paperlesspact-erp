import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $createNodeSelection,
  $createParagraphNode,
  $getSelection,
  $isRangeSelection,
  $isRootOrShadowRoot,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
  EditorThemeClasses,
  Klass,
  LexicalCommand,
  LexicalEditor,
  LexicalNode
} from "lexical";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as React from "react";

import { $createTableNodeWithDimensions, TableNode } from "../nodes/TableNode";

export default function invariant(
  cond,
  message,
  ...args
){
  if (cond) {
    return;
  }

  throw new Error(
    "Internal Lexical error: invariant() is meant to be replaced at compile " +
      "time. There is no runtime version."
  );
}




export const INSERT_TABLE_COMMAND= createCommand();

// @ts-ignore: not sure why TS doesn't like using null as the value?
export const CellContext = createContext({
  cellEditorConfig: null,
  cellEditorPlugins: null,
  set: () => {
    // Empty
  }
});

export function TableContext({ children }) {
  const [contextValue, setContextValue] = useState({
    cellEditorConfig: null,
    cellEditorPlugins: null
  });
  return (
    <CellContext.Provider
      value={useMemo(
        () => ({
          cellEditorConfig: contextValue.cellEditorConfig,
          cellEditorPlugins: contextValue.cellEditorPlugins,
          set: (cellEditorConfig, cellEditorPlugins) => {
            setContextValue({ cellEditorConfig, cellEditorPlugins });
          }
        }),
        [contextValue.cellEditorConfig, contextValue.cellEditorPlugins]
      )}
    >
      {children}
    </CellContext.Provider>
  );
}

export function TablePlugin({
  cellEditorConfig,
  children
}){
  const [editor] = useLexicalComposerContext();
  const cellContext = useContext(CellContext);

  useEffect(() => {
    if (!editor.hasNodes([TableNode])) {
      invariant(false, "TablePlugin: TableNode is not registered on editor");
    }

    cellContext.set(cellEditorConfig, children);

    return editor.registerCommand(
      INSERT_TABLE_COMMAND,
      ({ columns, rows, includeHeaders }) => {
        const selection = $getSelection();

        if (!$isRangeSelection(selection)) {
          return true;
        }

        const focus = selection.focus;
        const focusNode = focus.getNode();

        if (focusNode !== null) {
          const tableNode = $createTableNodeWithDimensions(
            Number(rows),
            Number(columns),
            includeHeaders
          );

          if ($isRootOrShadowRoot(focusNode)) {
            const target = focusNode.getChildAtIndex(focus.offset);

            if (target !== null) {
              target.insertBefore(tableNode);
            } else {
              focusNode.append(tableNode);
            }

            tableNode.insertBefore($createParagraphNode());
          } else {
            const topLevelNode = focusNode.getTopLevelElementOrThrow();
            topLevelNode.insertAfter(tableNode);
          }

          tableNode.insertAfter($createParagraphNode());
          const nodeSelection = $createNodeSelection();
          nodeSelection.add(tableNode.getKey());
          $setSelection(nodeSelection);
        }

        return true;
      },
      COMMAND_PRIORITY_EDITOR
    );
  }, [cellContext, cellEditorConfig, children, editor]);

  return null;
}
