import React from "react";
import DatePicker from "./lib/DatePicker";

export default function App() {
    const onDateChange = (e: {target: HTMLInputElement}) => {
        console.log(e.target.value)
    }
    return (
        <div>
            <h1>gsebdev Datepicker demo</h1>
            <DatePicker
                id='demo'
                onChange={onDateChange}
                placeholder="Please select a date..."
            />
        </div>
    )
}