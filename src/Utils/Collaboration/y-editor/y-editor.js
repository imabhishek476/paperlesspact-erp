import {v4 as genUUID} from 'uuid';
import isEqual from 'lodash/isEqual';
import xor from 'lodash/xor';
import { createMutex } from '../Mutex/mutex';

const Block = {
  CSS: {
    wrapper: 'ce-block',
    wrapperStretched: 'ce-block--stretched',
    content: 'ce-block__content',
    focused: 'ce-block--focused',
    selected: 'ce-block--selected',
    dropTarget: 'ce-block--drop-target',
  },
};

function checkChangeType(mutation) {
  const isBlockElement = (el) =>
    el instanceof Element ? el.classList.contains(Block.CSS.wrapper) : false;
  if (!!Array.from(mutation.removedNodes).find(isBlockElement)) return 'remove';

  if (!!Array.from(mutation.addedNodes).find(isBlockElement)) return 'add';

  return 'update';
}

export class EditorBinding {
  constructor(editor, holder, yArray) {
    this.holder = holder;
    this.editor = editor;
    this.yArray = yArray;
    this.mux = createMutex();
    this.isReady = this.initYDoc();
    this.setObserver();
    this.mapping = new Map();
  }

  get editorBlocks() {
    const blockCount = this.editor.blocks.getBlocksCount();
    const blocks = [];
    for (let i = 0; i < blockCount; i += 1) {
      blocks.push(this.editor.blocks.getBlockByIndex(i));
    }
    return blocks;
  }

  async initYDoc() {
    await this.editor.isReady;
    if (this.yArray.length) {
      this.yArray.toArray().forEach((yBlock, index) => {
        this.editor.blocks.insert(
          yBlock.type,
          yBlock.data,
          null,
          index,
          false
        );
        const blockApi = this.editor.blocks.getBlockByIndex(index);
        blockApi.holder.setAttribute('data-block-id', yBlock.uuid);
        this.mapping.set(yBlock.uuid, { index, blockApi, yBlock });
      });
    }
    this.yArray.observeDeep((evt, tr) => {
      this.mux(() => {
        const docArr = this.yArray.toArray();
        const changedIds = xor(
          docArr.map((b) => b.uuid),
          [...this.mapping.keys()]
        );
        changedIds.forEach((id) => {
          if (this.mapping.has(id)) {
            const { index } = this.mapping.get(id);
            this.mapping.delete(id);
            this.editor.blocks.delete(index);
          } else {
            const yBlock = docArr.find((b) => b.uuid === id);
            const index = docArr.indexOf(yBlock);
            this.editor.blocks.insert(
              yBlock.type,
              yBlock.data,
              null,
              index,
              false
            );
            const blockApi = this.editor.blocks.getBlockByIndex(index);
            blockApi.holder.setAttribute('data-block-id', id);
            this.mapping.set(id, { index, blockApi, yBlock });
          }
        });
      });
    });
  }

  async setObserver() {
    const observerOptions = {
      childList: true,
      attributes: true,
      subtree: true,
      characterData: true,
      characterDataOldValue: true,
    };

    this.observer = new MutationObserver((mutationList, observer) => {
      this.mutationHandler(mutationList, observer);
    });
    console.log(this.observer);
    await this.editor.isReady;
    this.observer.observe(
      this.holder.querySelector('.codex-editor__redactor'),
      observerOptions
    );
  }

  mutationHandler(mutationList, observer) {
    const changed = new Set();

    mutationList.forEach((mutation) => {
      const target = mutation.target;
      const blockSelector = '.' + Block.CSS.wrapper;

      function findChangedBlockElement(mutation, changeType) {
        if (changeType === 'add') {
          return Array.from(mutation.addedNodes).find(
            (n) => n.classList.contains(Block.CSS.wrapper)
          );
        }

        if (changeType === 'remove') {
          return Array.from(mutation.removedNodes).find(
            (n) => n.classList.contains(Block.CSS.wrapper)
          );
        }

        const el = mutation.target;
        if (el instanceof Text)
          return el.parentElement?.closest(blockSelector);

        if (el instanceof Element)
          return el.querySelector(blockSelector) || el.closest(blockSelector);

        return null;
      }

      const blockElements = Array.from(
        this.holder.querySelectorAll(blockSelector)
      );
      const changeType = checkChangeType(mutation);

      switch (mutation.type) {
        case 'childList':
        case 'characterData':
          const blockElement = findChangedBlockElement(mutation, changeType);
          if (blockElement) {
            const blockId = blockElement.dataset.blockId || genUUID();

            if (!blockElement.dataset.blockId)
              blockElement.setAttribute('data-block-id', blockId);

            changed.add({ blockId, changeType });
          }
          break;
        case 'attributes':
          if (!target.classList.contains(Block.CSS.wrapper)) {
            const blockElement = findChangedBlockElement(mutation, changeType);
            if (blockElement) {
              const blockId = blockElement.dataset.blockId || genUUID();

              if (!blockElement.dataset.blockId)
                blockElement.setAttribute('data-block-id', blockId);

              changed.add({ blockId, changeType });
            }
            break;
          }
      }
    });

    if (changed.size > 0) {
      this.onBlockChange(changed);
    }
  }

  async onBlockChange(changed) {
    for await (const { blockId, changeType } of changed) {
      const mappingItem = this.mapping.get(blockId);
      const blockApi = this.editorBlocks.find(
        (b) => b.holder.dataset.blockId === blockId
      );
      const index = this.editorBlocks.findIndex(
        (b) => b.holder.dataset.blockId === blockId
      );
      const savedData = (await blockApi?.save()) || {};
      const blockData = {
        type: savedData.tool,
        data: savedData.data,
        uuid: blockId,
      };

      this.mux(() => {
        switch (changeType) {
          case 'add':
            if (this.mapping.has(blockId)) break;

            this.yArray.insert(index, [blockData]);
            this.mapping.set(blockId, { index, blockApi, yBlock: blockData });
            break;
          case 'remove':
            if (!this.mapping.has(blockId)) break;

            const rmIdx = this.yArray.toArray().indexOf(mappingItem.yBlock);
            this.yArray.delete(rmIdx);
            this.mapping.delete(blockId);
            break;
          case 'update':
            if (isEqual(blockData, this.yArray.get(index))) break;

            if (this.mapping.has(blockId)) {
              this.yArray.delete(index);
              this.yArray.insert(index, [blockData]);
              this.mapping.set(blockId, { index, blockApi, yBlock: blockData });
            } else {
              this.yArray.insert(index, [blockData]);
              this.mapping.set(blockId, { index, blockApi, yBlock: blockData });
            }
            break;
        }
      });
    }
  }
}


