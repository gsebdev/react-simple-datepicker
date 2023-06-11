import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import './datepicker.scss'
import useOutsideClick from './hooks/useOusideClick'

interface DatePickerProps {
    id?: string | undefined,
    onChange?: (e: { target: HTMLInputElement }) => void | undefined,
    value?: string,
    placeholder?: string,
    name?: string
};

type Tab = 'day' | 'month' | 'year';

const DatePicker: React.FC<DatePickerProps> = ({ id, onChange, value = '', placeholder, name }) => {
    // gets the today date time object
    const now: Date = useMemo(() => new Date(), [])

    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [selectedMonth, setSelectedMonth] = useState<number>(now.getMonth())
    const [selectedYear, setSelectedYear] = useState<number>(now.getFullYear())

    // state needed to display the day view, an array of the month weeks containing an array of week dates
    const [displayedWeeks, setDisplayedWeeks] = useState<Date[][]>([])
    // state to define if datepicker is opened or not
    const [opened, setOpened] = useState<boolean>(false)
    // state that tells wich tab is active : day, month, years
    const [selectionTab, setSelectionTab] = useState<Tab>('day')
    // years array needed for the years view
    const [yearsArray, setYearsArray] = useState<number[]>([])
    // state that tells the component to call the onchange function
    const [triggerChange, setTriggerChange] = useState<boolean>(false)

    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
    const monthNames = ['January', 'Febuary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    // className prefix for this component
    const prefix = 'SG-datepicker'

    const datepickerRef = useRef<HTMLDivElement>(null)
    const dateInputRef = useRef<HTMLInputElement>(null)

    const closeAndReset = useCallback(() => {
        setOpened(false)
        setSelectionTab('day')
        const resetMonth = selectedDate ? selectedDate.getMonth() : now.getMonth()
        const resetYear = selectedDate ? selectedDate.getFullYear() : now.getFullYear()
        setSelectedMonth(resetMonth)
        setSelectedYear(resetYear)
    }, [now, selectedDate])

    // function that returns a string reprensenting the Date object
    const formatDate = (date: Date) => {
        const formatNumber = (number: number) => number < 10 ? '0' + number : number
        const month = formatNumber(date.getMonth() + 1)
        const day = formatNumber(date.getDate())
        const year = date.getFullYear()
        return month + '/' + day + '/' + year
    }

    //if a value prop is passed to the component, update the selecterdDate state
    useEffect(() => {
        if (!value) {
            setSelectedDate(null)
        } else {
            new Date(value)
        }

    }, [value])

    // if triggerchange state is true then call the onChange callback funtion
    useEffect(() => {
        if (triggerChange && dateInputRef.current !== null && onChange) {
            onChange({ target: dateInputRef.current })
            setTriggerChange(false)
        }
    }, [triggerChange, onChange])

    //use outside click to close the date picker if user clicks outside when opened
    useOutsideClick(datepickerRef, closeAndReset, opened)

    //if user change the selectedYear, then udate the years array that is displayed on year tab view
    useEffect(() => {
        const years: number[] = []
        for (let y = selectedYear - 10; y < selectedYear + 10; y++) {
            years.push(y)
        }
        setYearsArray(years)
    }, [selectedYear])

    //get the array of weeks and dates needed for the day tab view, and update the displayedWeeks state
    useEffect(() => {
        function getMonthLength(year: number, month: number) {
            const monthLastDate = new Date(year, month + 1, 0)
            return monthLastDate.getDate()
        }
        //get the first date object of the month
        const currentMonthFirstDate: Date = new Date(selectedYear, selectedMonth, 1)
        //get the day number of the week of the first date of the month
        const currentMonthFirstDay: number = currentMonthFirstDate.getDay()
        // get the current month length
        const currentMonthLastDate: number = getMonthLength(selectedYear, selectedMonth)
        // initialize a new array
        const calendarArray: Date[][] = []
        //determine if 6 or 5 weeks have to be displayed for this month
        const numberOfWeeksToDisplay: number = currentMonthFirstDay + currentMonthLastDate > 35 ? 6 : 5
        for (let week = 0; week < numberOfWeeksToDisplay; week++) {
            const weekArray: Date[] = []
            const dayStartPosition: number = (week * 7) - currentMonthFirstDay
            for (let day = 1; day <= 7; day++) {
                const dayPosition = dayStartPosition + day
                weekArray.push(new Date(selectedYear, selectedMonth, dayPosition))
            }
            calendarArray.push(weekArray)
        }
        setDisplayedWeeks(calendarArray)

    }, [selectedYear, selectedMonth])


    const onYearChange = (value: number) => {
        setSelectionTab('day')
        setSelectedYear(value)
    }

    const onMonthChange = (index: number) => {
        setSelectionTab('day')
        setSelectedMonth(index)
    }

    const onDayClick = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.target as Element
        const dateElement = target.closest('.' + prefix + '__day')

        if (dateElement && dateElement instanceof HTMLElement) {
            setSelectedDate(new Date(dateElement.id))
            setOpened(false)
            setTriggerChange(true)
        }
    }

    const onInputClick = (e: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) => {
        e.preventDefault()
        e.stopPropagation()
        if (opened) {
            closeAndReset()
        } else {
            setOpened(true)
        }

    }

    const onTodayClick = () => {
        setSelectedMonth(now.getMonth())
        setSelectedYear(now.getFullYear())
    }

    const onNavClick = (e: React.MouseEvent<HTMLElement>, direction: 'next' | 'prev', dateElement: Tab = 'day') => {
        e.preventDefault()
        switch (dateElement) {
            case 'day': {
                if (direction === 'prev') {
                    if (selectedMonth === 0) {
                        setSelectedMonth(11)
                        setSelectedYear(selectedYear - 1)
                    } else {
                        setSelectedMonth(selectedMonth - 1)
                    }
                }
                if (direction === 'next') {
                    if (selectedMonth === 11) {
                        setSelectedMonth(0)
                        setSelectedYear(selectedYear + 1)
                    } else {
                        setSelectedMonth(selectedMonth + 1)
                    }
                }
                break
            }
            case 'year': {
                if (direction === 'prev') {
                    const years: number[] = []
                    for (let y = yearsArray[0] - 20; y < yearsArray[0]; y++) {
                        years.push(y)
                    }
                    setYearsArray(years)
                }
                if (direction === 'next') {
                    const years: number[] = []
                    for (let y = yearsArray[yearsArray.length - 1] + 1; y <= yearsArray[yearsArray.length - 1] + 20; y++) {
                        years.push(y)
                    }
                    setYearsArray(years)
                }
                break
            }
            default: break
        }
    }

    const changeSelectionTab = (e: React.MouseEvent<HTMLElement> | null = null, tab: Tab) => {
        if (e) {
            e.preventDefault()
        }
        setSelectionTab(tab)
    }

    return (
        <div className={prefix}>
            <div className={prefix + "__input-container"} onKeyDown={onInputClick} onClick={onInputClick}>
                <input 
                    type="text"     
                    id={id} 
                    value={selectedDate ? formatDate(selectedDate) : ''} 
                    readOnly={true} ref={dateInputRef} 
                    placeholder={placeholder} 
                    name={name}
                />
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className='calendar-icon'>
                    <path d="M12,14a1,1,0,1,0-1-1A1,1,0,0,0,12,14Zm5,0a1,1,0,1,0-1-1A1,1,0,0,0,17,14Zm-5,4a1,1,0,1,0-1-1A1,1,0,0,0,12,18Zm5,0a1,1,0,1,0-1-1A1,1,0,0,0,17,18ZM7,14a1,1,0,1,0-1-1A1,1,0,0,0,7,14ZM19,4H18V3a1,1,0,0,0-2,0V4H8V3A1,1,0,0,0,6,3V4H5A3,3,0,0,0,2,7V19a3,3,0,0,0,3,3H19a3,3,0,0,0,3-3V7A3,3,0,0,0,19,4Zm1,15a1,1,0,0,1-1,1H5a1,1,0,0,1-1-1V10H20ZM20,8H4V7A1,1,0,0,1,5,6H19a1,1,0,0,1,1,1ZM7,18a1,1,0,1,0-1-1A1,1,0,0,0,7,18Z" />
                </svg>
            </div>

            {opened &&
                <div className={prefix + '__calendar-container'} ref={datepickerRef}>
                    {selectionTab === 'day' &&
                        <div>
                            <div className={prefix + '__navigation'}>
                                <div className={prefix + '__navigation-prev'} onClick={(e) => { onNavClick(e, 'prev') }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29"><path fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="m20.5 11.5-6 6-6-6" /></svg>
                                </div>
                                <button onClick={(e) => { changeSelectionTab(e, 'month') }}>{monthNames[selectedMonth]}</button>
                                <button onClick={(e) => { changeSelectionTab(e, 'year') }}>{selectedYear}</button>
                                <div className={prefix + '__navigation-next'} onClick={(e) => { onNavClick(e, 'next') }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29"><path fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="m20.5 11.5-6 6-6-6" /></svg>
                                </div>
                            </div>

                            <table className={prefix + '__body'}>
                                <thead className={prefix + '__header'}>
                                    <tr>
                                        {
                                            weekDays.map((day, index) => {
                                                return <th key={index + day}>{day}</th>
                                            })
                                        }
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                        displayedWeeks.map((week, index) => {
                                            return <tr key={week.toString() + index}>
                                                {
                                                    week.map((date, index) => {
                                                        let className = prefix + '__day'
                                                        if (date.getMonth() !== selectedMonth) {
                                                            className += ' off-month'
                                                        }
                                                        if (selectedDate && date.toDateString() === selectedDate.toDateString()) {
                                                            className += ' selected'
                                                        }
                                                        if (date.toDateString() === now.toDateString()) {
                                                            className += ' today'
                                                        }
                                                        return <td
                                                            key={date.toString() + index}
                                                            className={className}
                                                            id={`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`}
                                                            onClick={onDayClick}
                                                        >
                                                            {date.getDate()}

                                                        </td>
                                                    })
                                                }
                                            </tr>
                                        })
                                    }
                                </tbody>

                            </table>
                            <span className={prefix + '__today'} onClick={onTodayClick}>Today</span>
                        </div>
                    }
                    {selectionTab === 'month' &&
                        <div className={prefix + '__month-container'}>
                            {monthNames.map((month, index) => {
                                return <div className={`${prefix}__month${selectedMonth === index ? ' selected' : ''}`} key={month + index} onClick={() => { onMonthChange(index) }}>{month}</div>
                            })}
                        </div>
                    }
                    {selectionTab === 'year' &&
                        <div>
                            <div className={prefix + '__navigation'}>
                                <div className={prefix + '__navigation-prev'} onClick={(e) => { onNavClick(e, 'prev', 'year') }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29"><path fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="m20.5 11.5-6 6-6-6" /></svg>
                                </div>
                                <span>{yearsArray[0] + ' - ' + yearsArray[yearsArray.length - 1]}</span>
                                <div className={prefix + '__navigation-next'} onClick={(e) => { onNavClick(e, 'next', 'year') }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 29 29"><path fill="none" stroke="#000" strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit="10" strokeWidth="2" d="m20.5 11.5-6 6-6-6" /></svg>
                                </div>
                            </div>
                            <div className={prefix + '__year-container'}>
                                {yearsArray.map((year, index) => {
                                    return <div className={`${prefix}__year${selectedYear === year ? ' selected' : ''}`} key={year + index} onClick={() => { onYearChange(year) }}>{year}</div>
                                })}
                            </div>
                        </div>
                    }
                </div>
            }
        </div>
    )
}

export default DatePicker