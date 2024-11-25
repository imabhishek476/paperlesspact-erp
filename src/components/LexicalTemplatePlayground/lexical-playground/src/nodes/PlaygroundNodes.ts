/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {ParagraphNode, type ElementNode, type Klass, type LexicalNode} from 'lexical';

import {CodeHighlightNode, CodeNode} from '@lexical/code';
import {HashtagNode} from '@lexical/hashtag';
import {AutoLinkNode, LinkNode} from '@lexical/link';
import {ListItemNode, ListNode} from '@lexical/list';
import {MarkNode} from '@lexical/mark';
import {OverflowNode} from '@lexical/overflow';
import {HorizontalRuleNode} from '@lexical/react/LexicalHorizontalRuleNode';
import {HeadingNode, QuoteNode} from '@lexical/rich-text';
import {TableCellNode, TableNode, TableRowNode} from '@lexical/table';
import {CollapsibleContainerNode} from '../plugins/CollapsiblePlugin/CollapsibleContainerNode';
import {CollapsibleContentNode} from '../plugins/CollapsiblePlugin/CollapsibleContentNode';
import {CollapsibleTitleNode} from '../plugins/CollapsiblePlugin/CollapsibleTitleNode';
import {AutocompleteNode} from './AutocompleteNode';
import {EmojiNode} from './EmojiNode';
import {ExcalidrawNode} from './ExcalidrawNode';
import {FigmaNode} from './FigmaNode';
import {ImageNode} from './ImageNode';
import {InlineImageNode} from './InlineImageNode';
import {KeywordNode} from './KeywordNode';
import {LayoutContainerNode} from './LayoutContainerNode';
import {LayoutItemNode} from './LayoutItemNode';
// import {MentionNode} from './MentionNode';
import {MentionNode} from './VariableNode';
import {PageBreakNode} from './PageBreakNode';
import {PollNode} from './PollNode';
import {StickyNode} from './StickyNode';
import {TweetNode} from './TweetNode';
import {YouTubeNode} from './YouTubeNode';
import { CustomParagraphNode } from './CustomNodes/CustomParagrapghNode';


const PlaygroundNodes: Array<Klass<LexicalNode>| {replace:ElementNode,with:(node:any)=>ElementNode}> = [
  HeadingNode,
  ListNode,
  ListItemNode,
  QuoteNode,
  CodeNode,
  TableNode,
  TableCellNode,
  TableRowNode,
  HashtagNode,
  CodeHighlightNode,
  AutoLinkNode,
  LinkNode,
  OverflowNode,
  PollNode,
  StickyNode,
  ImageNode,
  InlineImageNode,
  MentionNode,
  EmojiNode,
  ExcalidrawNode,
  AutocompleteNode,
  KeywordNode,
  HorizontalRuleNode,
  TweetNode,
  YouTubeNode,
  FigmaNode,
  MarkNode,
  CollapsibleContainerNode,
  CollapsibleContentNode,
  CollapsibleTitleNode,
  PageBreakNode,
  LayoutContainerNode,
  LayoutItemNode,
  // CustomParagraphNode,
  // {
  //   replace: ParagraphNode,
  //   with: (node:any) => {
  //     return new CustomParagraphNode();
  //   }
  // }
];

export default PlaygroundNodes;
