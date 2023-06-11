import { RefObject, useEffect } from "react"
/**
 * Custom hook that listens for a click outside of a provided element when opened
 *
 * @param {Object} ref - Ref object to the element being watched for clicks outside of
 * @param {Function} callback - Function to call when a click outside of the provided element is detected
 * @param {Boolean} opened - Determines whether or not the event listener should be active
 * @returns {void}
 */

const useOutsideClick = (
    ref: RefObject<HTMLElement>,
    callback: () => void,
    opened: boolean
) : void => {

    useEffect(() => {
        //click handler function
        const handleClick = (e: MouseEvent) => {
            if (ref.current) {
                const rect = ref.current.getBoundingClientRect()
                //use event mouse position and bouding rect of element to determine if outside or not
                const outside = e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom ? true : false
                // if the click is outside then call the callback function
                if (outside) {
                    callback()
                }
            }
        }
        // if element is opened, add the eventlistener for a click anywhere in the document
        if (opened) {
            setTimeout(() => {document.addEventListener('click', handleClick)})
        // if not opened remove the event listener
        } else {
            document.removeEventListener('click', handleClick)
        }
        // when the component unmouts, remove the event listener
        return () => {
            document.removeEventListener('click', handleClick)
        }
    }, [ref, callback, opened])
}

export default useOutsideClick