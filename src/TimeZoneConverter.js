import './TimeZoneConverter.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { appStyles } from './App'; // Import appStyles from App.js
import React, { useState, useEffect } from 'react';

const TimeZoneConverter = ({ darkMode, toggleDarkMode, appStyles }) => {
  // State for managing timezones and selected date/time for each timezone
  const [timezones, setTimezones] = useState({
    IST: true,
    UTC: true,
    Eastern: true,
    Pacific: true,
  });

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedUtcTime, setSelectedUtcTime] = useState(new Date(selectedDate));
  const [selectedIstTime, setSelectedIstTime] = useState(new Date(selectedDate));
  const [selectedEasternTime, setSelectedEasternTime] = useState(new Date(selectedDate));
  const [selectedPacificTime, setSelectedPacificTime] = useState(new Date(selectedDate));

  // Function to toggle a timezone on or off(basic functionality)
  const toggleTimezone = (timezone) => {
    setTimezones((prevTimezones) => ({
      ...prevTimezones,
      [timezone]: !prevTimezones[timezone],
    }));
  };

  // Function to update the time for a specific timezone (basic functionality)
  const updateTime = (timezone, hours) => {
    const newTime = new Date(selectedDate);
    newTime.setHours(hours);

    if (timezone === 'IST') {
      setSelectedIstTime(newTime);
      setSelectedUtcTime(new Date(newTime.getTime() - 330 * 60000)); // IST offset
      setSelectedEasternTime(new Date(newTime.getTime() + 300 * 60000)); // Eastern Time offset
      setSelectedPacificTime(new Date(newTime.getTime() + 480 * 60000)); // Pacific Time offset
    } else if (timezone === 'UTC') {
      setSelectedUtcTime(newTime);
      setSelectedIstTime(new Date(newTime.getTime() + 330 * 60000)); // IST offset
      setSelectedEasternTime(new Date(newTime.getTime() - 300 * 60000)); // Eastern Time offset
      setSelectedPacificTime(new Date(newTime.getTime() - 480 * 60000)); // Pacific Time offset
    } else if (timezone === 'Eastern') {
      setSelectedEasternTime(newTime);
      setSelectedPacificTime(new Date(newTime.getTime() + 480 * 60000)); // Pacific Time offset
      setSelectedUtcTime(new Date(newTime.getTime() - 300 * 60000)); // Eastern Time offset
      setSelectedIstTime(new Date(newTime.getTime() + 330 * 60000)); // IST offset
    } else if (timezone === 'Pacific') {
      setSelectedPacificTime(newTime);
      setSelectedEasternTime(new Date(newTime.getTime() - 480 * 60000)); // Pacific Time offset
      setSelectedUtcTime(new Date(newTime.getTime() - 300 * 60000)); // Eastern Time offset
      setSelectedIstTime(new Date(newTime.getTime() + 330 * 60000)); // IST offset
    }
  };

  // State and function to reverse the order of timezones
  const [reverseOrder, setReverseOrder] = useState(false);
  const [reorderedTimezones, setReorderedTimezones] = useState(Object.keys(timezones));

  // Function to reverse the order of timezones and update reorderedTimezones
  const reverseOrderFunction = () => {
    setReorderedTimezones([...reorderedTimezones].reverse());
    setReverseOrder((prevOrder) => !prevOrder);
  };

  // Function to handle drag-and-drop reordering of timezones(basic functionality)
  const onDragEnd = (result) => {
    if (!result.destination) return;

    const newReorderedTimezones = [...reorderedTimezones];
    newReorderedTimezones.splice(result.source.index, 1);
    newReorderedTimezones.splice(result.destination.index, 0, result.draggableId);

    setReorderedTimezones(newReorderedTimezones);
  };

  useEffect(() => {
    // Update times for all timezones based on the new selectedDate
    updateTime('Pacific', selectedPacificTime.getHours());
    updateTime('UTC', selectedUtcTime.getHours());
    updateTime('Eastern', selectedEasternTime.getHours());
    updateTime('IST', selectedIstTime.getHours());
  }, [selectedDate]);

  return (
    <div className="timezone-converter" style={appStyles}>
      <h1>Time Zone Converter</h1>
      <div className="center-elements">
        <button
        //To toggle light and dark mode Bonus functionality 
          className="upper-button"
          style={{ fontSize: '1.5rem', cursor: 'pointer' }}
          onClick={toggleDarkMode}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <button
        // To reverse order Basic functionality 
          className="upper-button"
          style={{
            fontSize: '1.5rem',
            cursor: 'pointer',
            marginLeft: '1rem',
          }}
          onClick={reverseOrderFunction}
        >
          {reverseOrder ? '⬇️' : '⬆️'} Reverse Order
        </button>
        <div style={{ margin: '1rem 0' }}>
          <div className="date-picker-container">
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              onSelect={(date) => setSelectedDate(date)}
              showTimeSelect
             //To cahnge date and time Bonus functionality 
              dateFormat="MMMM d, yyyy 'Min': mm aa"
              timeFormat="mm"
              timeIntervals={1}
              timeCaption="Time"
              popperPlacement="top-end"
              popperModifiers={{
                offset: {
                  enabled: true,
                  offset: '-30px, 10px',
                },
              }}
            />
          </div>
        </div>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="timezones" direction="vertical">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef} className="time-sliders">
              {reorderedTimezones.map((timezone, index) => (
                <Draggable key={timezone} draggableId={timezone} index={index}>
                  {(provided) => (
                    <div
                      className="time-slider"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <div className="slider-header">
                        {/*To remove timezone using cross Basic functionality */}
                        <button onClick={() => toggleTimezone(timezone)}>
                          {timezones[timezone] ? '❌' : '➕'}
                        </button>
                        <div className="timezone-label">{timezone}</div>
                        <div className="selected-time">
                          {timezones[timezone] && (
                            <span className={darkMode ? 'dark-text' : ''}>
                              Selected {timezone} Time:{' '}
                              {timezone === 'IST'
                                ? selectedIstTime.toLocaleString()
                                : timezone === 'UTC'
                                ? selectedUtcTime.toLocaleString()
                                : timezone === 'Eastern'
                                ? selectedEasternTime.toLocaleString()
                                : selectedPacificTime.toLocaleString()}
                            </span>
                          )}
                        </div>
                      </div>
                      {timezones[timezone] && (
                        <div className="slider-controls">
                          <input
                           //To show the time
                            type="range"
                            min={0}
                            max={23}
                            step={0.1}
                            value={
                              timezone === 'IST'
                                ? selectedIstTime.getHours()
                                : timezone === 'UTC'
                                ? selectedUtcTime.getHours()
                                : timezone === 'Eastern'
                                ? selectedEasternTime.getHours()
                                : selectedPacificTime.getHours()
                            }
                            onChange={(event) => updateTime(timezone, event.target.value)}
                            className="slider-input"
                            style={{ color: darkMode ? '#ffffff' : '#000000' }}
                          />
                        </div>
                      )}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default TimeZoneConverter;
