# @gsebdev React Simple Datepicker

A simple datepicker react/typescript component.

You can set an id, name, placeholder, a onChange callback and a preselected value via props.


[See demo link](https://gsebdev.github.io/react-simple-datepicker/)
## Installation
The package can be installed via npm:

```bash
npm install @gsebdev/react-simple-datepicker
```
## Usage

```js
import {DatePicker} from '@gsebdev/react-simple-datepicker';

function Example({data}) {
    const onChangeCallback = ({target}) => {
        // a callback function when user select a date
    }
    <DatePicker
        id='datepicker-id'
        name='date-demo'
        onChange={onchangeCallback}
        value={'01/02/2023'}
    />  
}
```

## Props

***id*** : an optional id for the datepicker \
***name*** : an optional name for the datepicker input\
***placeholder*** : a placeholder string (optional)\
***value*** : set the value of the datepicker input (optional)\
***onChange*** : a callback function that takes as argument {target}\
