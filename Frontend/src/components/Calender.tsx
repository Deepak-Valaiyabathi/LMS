import { useEffect, useState } from 'react';
import {
  LocalizationProvider,
  DateCalendar,
  PickersDay,
  PickersDayProps,
} from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import Tooltip from '@mui/material/Tooltip';

// Holiday types
type Holiday = {
  date: string; // "YYYY-MM-DD" format
  name: string;
};

type HolidayByType = {
  floater: Holiday[];
  public: Holiday[];
  national: Holiday[];
};

interface CustomDayProps extends PickersDayProps {
  holidayList: HolidayByType;
  day: Dayjs; 
}


function CustomDayComponent(props: CustomDayProps) {
  const { holidayList, day, ...other } = props;
  const dateStr = day.format('YYYY-MM-DD');


  let holiday:
    | {
        name: string;
        type: string;
      }
    | undefined;

  for (const type of ['floater', 'public', 'national'] as const) {
    const match = holidayList[type]?.find(
      (h) => dayjs(h.date).format('YYYY-MM-DD') === dateStr
    );

    if (match) {
      holiday = {
        ...match,
        type: type.charAt(0).toUpperCase() + type.slice(1),
      };
      break;
    }
  }

  const getHolidayStyle = (type?: string) => {
    switch (type) {
      case 'Public':
      case 'National':
        return {
          backgroundColor: '#FE5D26',
          color: 'white',
        };
      case 'Floater':
        return {
          backgroundColor: '#4ED7F1',
          color: 'black',
        };
      default:
        return {};
    }
  };

  return (
    <Tooltip title={holiday ? `${holiday.name} (${holiday.type})` : ''}>
      <span>
        <PickersDay
          {...other}
          day={day}
          style={getHolidayStyle(holiday?.type)}
        />
      </span>
    </Tooltip>
  );
}

// Main Calendar Component
export default function Calendar() {
  const [value, setValue] = useState<Dayjs | null>(dayjs());
  const [holidayList, setHolidayList] = useState<HolidayByType>({
    floater: [],
    public: [],
    national: [],
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) fetchHolidays(token);
  }, []);

  const fetchHolidays = async (token: string) => {
    try {
      const response = await fetch('http://localhost:5000/api/holidaysShow', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      // Normalize holiday list (in case keys are missing)
      setHolidayList({
        floater: result.floater || [],
        public: result.public || [],
        national: result.national || [],
      });
    } catch (err) {
      console.error('Error fetching holidays:', err);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DateCalendar
        value={value}
        onChange={(newValue) => setValue(newValue)}
        slots={{
          day: (props) => (
            <CustomDayComponent {...props} holidayList={holidayList} />
          ),
        }}
      />
    </LocalizationProvider>
  );
}
