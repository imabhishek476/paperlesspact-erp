import React, { useEffect, useState } from "react";
import { usePageStore } from "../stores/usePageStore";
import {
  Button,
  Checkbox,
  Radio,
  RadioGroup,
  Slider,
  Textarea,
} from "@nextui-org/react";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Minus, Plus } from "lucide-react";

const transitions = ["none", "fade", "slide", "convex", "concave", "zoom"];
const transitionSpeeds = ["default", "fast", "slow"];
const PageSettings = () => {
  const {
    selectedPage,
    setSelectedPage,
    isDuration,
    setIsDuration,
    updateAtIndex,
  } = usePageStore();
  const [selected, setSelected] = useState(selectedPage?.transition || "none");
  const [value, setValue] = useState(selectedPage?.duration || 1);
  const [notes, setNotes] = useState(selectedPage?.notes || "");
  const [speed, setSpeed] = useState(
    selectedPage?.transitionSpeed || "default"
  );
  useEffect(() => {
    if (selectedPage?.pageIndex !== null) {
      updateAtIndex(selectedPage?.pageIndex, {
        transition: selected,
        transitionSpeed: speed,
        duration: value,
        notes: notes,
      });
    }
  }, [value, speed, selected, notes]);
  useEffect(() => {
    if (selectedPage) {
      setSelected(selectedPage?.transition);
      setValue(selectedPage?.duration);
      setSpeed(selectedPage?.transitionSpeed);
      setNotes(selectedPage?.notes);
    }
  }, [selectedPage]);
  
  return (
    <>
      {selectedPage && (
        <div className="flex-col">
          <div className="p-4 border-b-2 flex justify-start gap-2 items-baseline">
            <p className="text-[14px] text-[#05686e]">Page Settings</p>
            <span className="text-[10px]">
              &#40; Page No. {selectedPage?.pageIndex + 1} &#41;
            </span>
          </div>
          <div className="h-[calc(100vh-120px)] overflow-scroll">
          <div className="py-4">
            <FormControl fullWidth>
              <InputLabel id="test-select-label">Transition</InputLabel>
              <Select
                labelId="test-select-label"
                value={selected}
                fullWidth
                label="Transition"
                onChange={(e) => setSelected(e.target.value)}
              >
                {transitions.map((transition, index) => (
                  <MenuItem value={transition} key={index}>
                    <span className="capitalize">{transition}</span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="py-4">
            <FormControl fullWidth>
              <InputLabel id="test-select-label">Transition Speed</InputLabel>
              <Select
                labelId="test-select-label"
                value={speed}
                fullWidth
                label="Transition Speed"
                onChange={(e) => setSpeed(e.target.value)}
              >
                {transitionSpeeds.map((speed, index) => (
                  <MenuItem value={speed} key={index}>
                    <span className="capitalize">{speed}</span>
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          <div className="py-4 flex flex-col">
            <div className="p-4 border-b-2 flex justify-between gap-2 items-baseline">
              <p className="text-[14px] text-[#05686e]">
                Slide Duration &nbsp;
                <span className="text-[12px]">&#40; {value} sec &#41;</span>
              </p>
              <Checkbox
                size="sm"
                isSelected={isDuration}
                onValueChange={setIsDuration}
              >
                Duration?
              </Checkbox>
            </div>
            {isDuration && (
              <Slider
                aria-label="Volume"
                size="lg"
                color="primary"
                value={value}
                onChange={setValue}
                step={0.1}
                maxValue={30}
                minValue={0.1}
                startContent={
                  <Button
                    isIconOnly
                    radius="full"
                    variant="light"
                    onPress={() =>
                      setValue((prev) => (prev >= 1 ? (prev - 1).toFixed(1) : 0))
                    }
                  >
                    <Minus className="text-2xl" />
                  </Button>
                }
                endContent={
                  <Button
                    isIconOnly
                    radius="full"
                    variant="light"
                    onPress={() =>
                      setValue((prev) => (prev <= 29 ? (-(-prev - 1)).toFixed(1) : 30))
                    }
                  >
                    <Plus className="text-2xl" />
                  </Button>
                }
                className="max-w-md"
              />
            )}
          </div>
          <div className="py-4 flex flex-col">
            <div className="p-4 border-b-2 flex justify-between gap-2 items-baseline">
              <p className="text-[14px] text-[#05686e]">Notes &nbsp;</p>
            </div>
            <Textarea
              variant="bordered"
              // label="Notes"
              minRows={5}
              maxRows={20}
              labelPlacement="outside"
              placeholder="These notes will be available in presenter view. "
              value={notes}
              onValueChange={setNotes}
              className="my-4"
            />
          </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PageSettings;
