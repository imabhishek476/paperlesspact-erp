/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {Spread} from 'lexical';

import {
  type DOMConversionMap,
  type DOMConversionOutput,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalNode,
  type NodeKey,
  type SerializedTextNode,
  $applyNodeReplacement,
  TextNode,
} from 'lexical';

export type SerializedMentionNode = Spread<
  {
    mentionName: string;
    varName:string;
  },
  SerializedTextNode
>;

function convertMentionElement(
  domNode: HTMLElement,
): DOMConversionOutput | null {
  const textContent = domNode.textContent;
  const varName = domNode.getAttribute('data-var-name');

  if (textContent !== null && varName !== null) {
    const node = $createMentionNode(textContent,varName);
    return {
      node,
    };
  }

  return null;
}

const mentionStyle = 'background-color: rgba(252, 249, 8, 0.8)';
export class MentionNode extends TextNode {
  __mention: string;
  __varName:string;

  static getType(): string {
    return 'mention';
  }

  static clone(node: MentionNode): MentionNode {
    return new MentionNode(node.__mention,node.__varName, node.__text, node.__key,node.getStyle());
  }
  static importJSON(serializedNode: SerializedMentionNode): MentionNode {
    const node = $createMentionNode(serializedNode.mentionName,serializedNode.varName);
    node.setTextContent(serializedNode.text);
    node.setFormat(serializedNode.format);
    node.setDetail(serializedNode.detail);
    node.setMode(serializedNode.mode);
    node.setStyle(serializedNode.style);
    return node;
  }

  constructor(mentionName: string,varName:string, text?: string, key?: NodeKey,style?:string) {
    super(mentionName,key);
    this.__mention = mentionName;
    this.__varName = varName;
    if(style){
      this.__style = style;
    }
  }

  exportJSON(): SerializedMentionNode {
    return {
      ...super.exportJSON(),
      mentionName: this.__mention,
      varName:this.__varName,
      type: 'mention',
      version: 1,
    };
  }

  createDOM(config: EditorConfig): HTMLElement {
    const dom = super.createDOM(config);
    console.log(dom.style.cssText);
    if(dom.style.cssText === '' || dom.style.cssText === mentionStyle){
      dom.style.cssText = mentionStyle;
    }
    dom.className = 'mention';
    return dom;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement('span');
    element.setAttribute('data-lexical-mention', 'true');
    element.setAttribute('data-var-name', this.__varName);
    element.textContent = this.__text;
    return {element};
  }

  static importDOM(): DOMConversionMap | null {
    return {
      span: (domNode: HTMLElement) => {
        if (!domNode.hasAttribute('data-lexical-mention') && !domNode.hasAttribute('data-var-name')) {
          return null;
        }
        return {
          conversion: convertMentionElement,
          priority: 1,
        };
      },
    };
  }

  isTextEntity(): true {
    return true;
  }

  canInsertTextBefore(): boolean {
    return false;
  }

  canInsertTextAfter(): boolean {
    return false;
  }

  setMention(mentionString:string){
    this.__mention = mentionString;
    this.setTextContent(mentionString);
  }
}

export function $createMentionNode(mentionName: string,varName:string): MentionNode {
  const mentionNode = new MentionNode(mentionName,varName);
  mentionNode.setMode('segmented').toggleDirectionless();
  return $applyNodeReplacement(mentionNode);
}

export function $isMentionNode(
  node: LexicalNode | null | undefined,
): node is MentionNode {
  return node instanceof MentionNode;
}
