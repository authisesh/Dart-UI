import {
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import {
  LocalizationProvider,
  MultiInputDateRangeField,
} from "@mui/x-date-pickers-pro";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import moment from "moment/moment";
import React, { useEffect, useState } from "react";

export const EventSelector = ({ defaultValues, onSubmit }) => {
  const [formState, setFormState] = useState({
      starting: [null,  null],
      at: defaultValues?.at ?? "9:00 AM",
      until: defaultValues?.until ?? "10:00 AM",
      repeats: defaultValues?.repeats ?? 1,
      every: defaultValues?.every ?? "Sunday",
      on: defaultValues?.on ?? 0,
    }
  );
  const [everyOptions, setEveryOptions] = useState([]);

  useEffect(() => {
    if (formState.repeats == 1) {
      setEveryOptions(moment.weekdays());
    } else {
      setEveryOptions(
        new Array(7).fill().map((_, index) => `${index + 1} hour`)
      );
    }
  }, [formState.repeats]);

  return (
    <Stack gap={2} padding={3}>
      <FormControl>
        <FormLabel>STARTING</FormLabel>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DemoContainer
            components={[
              "MultiInputDateRangeField",
              "SingleInputDateRangeField",
            ]}
          >
            <MultiInputDateRangeField
              value={formState?.starting}
              onChange={(dates) => {
                setFormState((prev) => ({
                    ...prev,
                    starting: dates,
                  }));
              }}
            />
          </DemoContainer>
        </LocalizationProvider>
      </FormControl>
      <Stack direction={"row"} gap={2}>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>AT</FormLabel>
          <Select
            value={formState.at}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, at: e.target.value }))
            }
          >
            {getHoursArray().map((time) => (
              <MenuItem value={time}>{time}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>UNTIL</FormLabel>
          <Select
            value={formState.until}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, until: e.target.value }))
            }
          >
            {getHoursArray().map((time) => (
              <MenuItem value={time}>{time}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <Stack direction={"row"} gap={2}>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>REPEATS</FormLabel>
          <Select
            value={formState.repeats}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, repeats: e.target.value }))
            }
          >
            <MenuItem value="1">Weekly</MenuItem>
            <MenuItem value="2">Daily</MenuItem>
          </Select>
        </FormControl>
        <FormControl sx={{ flex: 1 }}>
          <FormLabel>EVERY</FormLabel>
          <Select
            value={formState.every}
            onChange={(e) =>
              setFormState((prev) => ({ ...prev, every: e.target.value }))
            }
          >
            {everyOptions.map((value) => (
              <MenuItem value={value}>{value}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Stack>
      <FormControl>
        <FormLabel>ON</FormLabel>
        <Stack direction={"row"} gap={1}>
          {days.map((day, index) => (
            <Button
              onClick={() => setFormState((prev) => ({ ...prev, on: index }))}
              variant={formState.on == index ? "contained" : "outlined"}
              sx={{ flex: 1, minWidth: "auto", height: 50 }}
            >
              {day}
            </Button>
          ))}
        </Stack>
      </FormControl>
      <Stack>
        <Button variant="contained" onClick={() => onSubmit?.(formState)} sx={{paddingY: 2}}>Submit</Button>
      </Stack>
    </Stack>
  );
};

export const days = ["S", "M", "T", "W", "T", "F", "S"];
export const getHoursArray = () => {
  const items = [];
  new Array(24).fill().forEach((_, index) => {
    items.push(moment({ hour: index }).format("h:mm A"));
  });
  return items;
};
