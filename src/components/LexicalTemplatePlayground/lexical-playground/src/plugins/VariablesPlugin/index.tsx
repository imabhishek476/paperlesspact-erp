/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import {useLexicalComposerContext} from '@lexical/react/LexicalComposerContext';
import {
  LexicalTypeaheadMenuPlugin,
  MenuOption,
  MenuTextMatch,
  useBasicTypeaheadTriggerMatch,
} from '@lexical/react/LexicalTypeaheadMenuPlugin';
import {$nodesOfType, LexicalEditor, TextNode, createCommand} from 'lexical';
import {useCallback, useEffect, useMemo, useState} from 'react';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {$createMentionNode, MentionNode} from '../../nodes/VariableNode';
import { getVariableWithTemplateId } from "../../../../../../Apis/variable";
import { Search } from 'lucide-react';
import { Alert, Snackbar } from '@mui/material';
import {useTabsStore} from '@/components/Template/stores/useDocTabsStore';
import { usePageDataStore } from '@/components/Template/stores/usePageDataStore';

const PUNCTUATION =
  '\\.,\\+\\*\\?\\$\\@\\|#{}\\(\\)\\^\\-\\[\\]\\\\/!%\'"~=<>_:;';
const NAME = '\\b[A-Z][^\\s' + PUNCTUATION + ']';

const DocumentMentionsRegex = {
  NAME,
  PUNCTUATION,
};

const PUNC = DocumentMentionsRegex.PUNCTUATION;

const TRIGGERS = ['['].join('');

// Chars we expect to see in a mention (non-space, non-punctuation).
const VALID_CHARS = '[ -~]';
// const VALID_CHARS = '[^' + TRIGGERS + PUNC + '\\s]';

// Non-standard series of chars. Each series must be preceded and followed by
// a valid char.
const VALID_JOINS =
  '(?:' +
  '\\.[ |$]|' + // E.g. "r. " in "Mr. Smith"
  ' |' + // E.g. " " in "Josh Duck"
  '[' +
  PUNC +
  ']|' + // E.g. "-' in "Salier-Hellendag"
  ')';

const LENGTH_LIMIT = 75;

const AtSignMentionsRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    VALID_JOINS +
    '){0,' +
    LENGTH_LIMIT +
    '})' +
    ')$',
);

// 50 is the longest alias length limit.
const ALIAS_LENGTH_LIMIT = 50;

// Regex used to match alias.
const AtSignMentionsRegexAliasRegex = new RegExp(
  '(^|\\s|\\()(' +
    '[' +
    TRIGGERS +
    ']' +
    '((?:' +
    VALID_CHARS +
    '){0,' +
    ALIAS_LENGTH_LIMIT +
    '})' +
    ')$',
);

// At most, 5 suggestions are shown in the popup.
const SUGGESTION_LIST_LENGTH_LIMIT = 5;

const mentionsCache = new Map();


const UPDATE_ALL_VARIABLES = createCommand();

// const dummyMentionsData = [
//   'Aayla Secura',
//   'Adi Gallia',
//   'Admiral Dodd Rancit',
//   'Admiral Firmus Piett',
// ];

const dummyLookupService = {
  search(data: Array<{id:string;name:string; value:string}>,string: string, callback: (results: Array<{id:string;name:string; value:string}>) => void): void {
    setTimeout(() => {
      const results = data.filter((mention) =>
        mention.name.toLowerCase().includes(string.toLowerCase()),
      );
      callback(results);
    }, 500);
  },
};

function useMentionLookupService(mentionString: string | null) {
  const [results, setResults] = useState<Array<{id:string;name:string; value:string}>>([]);
  const [dummyMentionsData, setDummyMentionsData] = useState<Array<{id:string;name:string; value:string}>>([]);
  const {variableUpdate,variables,setVariables} = useTabsStore();
  const {serverData} = usePageDataStore();
  const getVariable= async()=>{
    try {
      const responseData = await getVariableWithTemplateId(serverData._id);
      // Extract data from the response and map it to the required format
      const extractedData = responseData.data.map((item: any) => ({
        id: item._id,
        name: item.name,
        value: item.value,
        type:item.type,
      }));
      // Update the state with the extracted data
      console.log(extractedData);
      setDummyMentionsData(extractedData);
      setVariables(extractedData);
      return extractedData;
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  }


  useEffect(()=>{
    console.log(variableUpdate)
    // updateVariables();
    getVariable();
  },[variableUpdate])

  useEffect(() => {
    const cachedResults = mentionsCache.get(mentionString);

    if (mentionString == null) {
      setResults([]);
      return;
    }

    if (cachedResults === null) {
      return;
    } else if (cachedResults !== undefined) {
      setResults(cachedResults);
      return;
    }

    console.log(dummyMentionsData)
    // const mentionNames = dummyMentionsData.map(mention => mention.name)
    // mentionsCache.set(mentionString, null);
    // dummyLookupService.search(mentionNames,mentionString, (newResults) => {
    //   mentionsCache.set(mentionString, newResults);
    //   setResults(newResults);
    // });
    dummyLookupService.search(
      dummyMentionsData,
      mentionString,
      (newResults) => {
        // mentionsCache.set(mentionString, newResults);
        setResults(newResults);
      }
    );
  }, [mentionString, dummyMentionsData]);

  return results;
}

function checkForAtSignMentions(
  text: string,
  minMatchLength: number,
): MenuTextMatch | null {
  let match = AtSignMentionsRegex.exec(text);

  if (match === null) {
    match = AtSignMentionsRegexAliasRegex.exec(text);
  }
  if (match !== null) {
    // The strategy ignores leading whitespace but we need to know it's
    // length to add it to the leadOffset
    const maybeLeadingWhitespace = match[1];

    const matchingString = match[3];
    if (matchingString.length >= minMatchLength) {
      return {
        leadOffset: match.index + maybeLeadingWhitespace.length,
        matchingString,
        replaceableString: match[2],
      };
    }
  }
  return null;
}

function getPossibleQueryMatch(text: string): MenuTextMatch | null {
  return checkForAtSignMentions(text, 1);
}

class MentionTypeaheadOption extends MenuOption {
  name: { id: string; name: string; value: string };
  picture: JSX.Element;

  constructor(name: { id: string; name: string; value: string }, picture: JSX.Element) {
    super(name.id); // Assuming you want to use the 'name' property as the key
    this.name = name;
    this.picture = picture;
  }
}

function MentionsTypeaheadMenuItem({
  index,
  isSelected,
  onClick,
  onMouseEnter,
  option,
}: {
  index: number;
  isSelected: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  option: MentionTypeaheadOption;
}) {
  let className = 'item';
  if (isSelected) {
    className += ' selected';
  }
  return (
    <li
      style={{
        borderTopLeftRadius:'0px',
        borderTopRightRadius:'0px'
      }}
      key={option.key}
      tabIndex={-1}
      className={className}
      ref={option.setRefElement}
      role="option"
      aria-selected={isSelected}
      id={'typeahead-item-' + index}
      onMouseEnter={onMouseEnter}
      onClick={onClick}>
      {option.picture}
      <span className="text">{option.name.name}</span>
    </li>
  );
}

export default function NewMentionsPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  const [queryString, setQueryString] = useState<string | null>(null);
  console.log(queryString);
  const results = useMentionLookupService(queryString);

  const checkForSlashTriggerMatch = useBasicTypeaheadTriggerMatch('/', {
    minLength: 0,
  });

  const options = useMemo(
    () =>
      results
        .map(
          (result) =>
            new MentionTypeaheadOption(result, <i />),
        )
        .slice(0, SUGGESTION_LIST_LENGTH_LIMIT),
    [results],
  );

  const onSelectOption = useCallback(
    (
      selectedOption: MentionTypeaheadOption,
      nodeToReplace: TextNode | null,
      closeMenu: () => void,
    ) => {
      editor.update(() => {
        let mentionNode
        if(!selectedOption.name.value){
          // return handleClick();
          mentionNode = $createMentionNode(`[${selectedOption.name.name}]`,selectedOption.name.name);
          console.log(mentionNode)
        }
        else{
          let value = selectedOption.name.value;
          if(value.split('-').length === 3 && value.length!==3){
            const split = value.split('-');
            value = `${split[2]}-${split[1]}-${split[0]}`;
          }
          mentionNode = $createMentionNode(value,selectedOption.name.name);
        }
        if (nodeToReplace) {
          nodeToReplace.replace(mentionNode);
        }
        mentionNode.select();
        closeMenu();
      });
    },
    [editor],
  );

  const checkForMentionMatch = useCallback(
    (text: string) => {
      const slashMatch = checkForSlashTriggerMatch(text, editor);
      if (slashMatch !== null) {
        return null;
      }
      return getPossibleQueryMatch(text);
    },
    [checkForSlashTriggerMatch, editor],
  );


  const [open, setOpen] = React.useState(false);
  const [snackbarMsg, setSnackbarMsg] = React.useState("")

  const handleClick = () => {
    setSnackbarMsg("Please assign value first for this variable")
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // useEffect(()=>{
  //   const removeUpdateVariablesCommand = editor.registerCommand()
  // },[])


  return (
    <>
    <Snackbar 
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }} 
      open={open} autoHideDuration={1000} 
      onClose={handleClose}
    >
        <Alert
          onClose={handleClose}
          severity="error"
          sx={{ width: '100%' }}
        >
          {snackbarMsg}
        </Alert>
    </Snackbar>
    <LexicalTypeaheadMenuPlugin<MentionTypeaheadOption>
      onQueryChange={setQueryString}
      onSelectOption={onSelectOption}
      triggerFn={checkForMentionMatch}
      options={options}
      menuRenderFn={(
        anchorElementRef,
        {selectedIndex, selectOptionAndCleanUp, setHighlightedIndex},
      ) =>
        anchorElementRef.current && results.length
          ? ReactDOM.createPortal(
              <div className="typeahead-popover mentions-menu">
                <div className="flex flex-row items-center gap-2 border-1 rounded-sm py-2 px-2 w-[92%] m-2">
                  <Search
                    size={18}
                    strokeWidth={2}
                    className="text-2xl text-default-400 pointer-events-none flex-shrink-0"
                  />{" "}
                  <input
                    type="text"
                    className="outline-0 flex-1"
                    value={queryString || ""}
                    onChange={(e: { target: { value: any } }) =>
                      setQueryString(e.target.value)
                    }
                    placeholder="Search Variables"
                  />
                </div>
                <ul style={{borderRadius:'0px'}}>
                  {options.map((option, i: number) => (
                    <MentionsTypeaheadMenuItem
                      index={i}
                      isSelected={selectedIndex === i}
                      onClick={() => {
                        setHighlightedIndex(i);
                        selectOptionAndCleanUp(option);
                      }}
                      onMouseEnter={() => {
                        setHighlightedIndex(i);
                      }}
                      key={option.key}
                      option={option}
                    />
                  ))}
                </ul>
              </div>,
              anchorElementRef.current,
            )
          : null
      }
    />
    </>
  );
}
