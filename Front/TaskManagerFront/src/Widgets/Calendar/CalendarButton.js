import { Button } from 'antd';
import calendarIcon from './calendar_view.png';

export default function CalendarButton() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <img src={calendarIcon} alt="Calendar Icon" style={{ width: '24px', height: '24px' }} />
      <Button type="primary" onClick={() => console.log('Calendar button clicked')}>
        Calendar
      </Button>
    </div>
  );
};
