import type { HistoryState } from '@lexical/history';
import { createEmptyHistoryState, registerHistory } from './LexicalHistoryHelper';
import { useEffect, useMemo } from 'react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { LexicalEditor } from 'lexical';
export { createEmptyHistoryState } from './LexicalHistoryHelper';
export type { HistoryState };
// export declare function HistoryPlugin({ externalHistoryState, }: {
//     externalHistoryState?: HistoryState;
// }): null;
function useHistory(editor: LexicalEditor,addHistory:any,pageIndex:Number|string, externalHistoryState: any, delay = 1000) {
    const historyState = useMemo(() => externalHistoryState || createEmptyHistoryState(), [externalHistoryState]);
    useEffect(() => {
        return registerHistory(editor, historyState, delay,addHistory,pageIndex);
    }, [delay, editor, historyState]);
}

export function HistoryPlugin({ addHistory,
    pageIndex,
    externalHistoryState
}: { addHistory: any,pageIndex:Number|string, externalHistoryState?: HistoryState }) {
    const [editor] = useLexicalComposerContext();
    useHistory(editor, addHistory,pageIndex,externalHistoryState);
    return null;
}
