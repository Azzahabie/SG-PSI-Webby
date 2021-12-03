import PropTypes from 'prop-types'
import './circle.css'

function Circle({ level,title }) {
    if (level === 1) {
        return (
            <div className={'container'}>
                <span className={'dot healthy'}></span>
                <p>{title}</p>
            </div>
        )
    }
    if (level === 2) {
        return (
            <div className={'container'}>
                <span className={'dot moderate'}></span>
                <p>{title}</p>
            </div>
        )
    }
    if (level === 3) {
        return (
            <div className={'container'}>
                <span className={'dot unhealthy'}></span>
                <p>{title}</p>
            </div>
        )
    }
    if (level === 4) {
        return (
            <div className={'container'}>
                <span className={'dot very_unhealthy'}></span>
                <p>{title}</p>
            </div>
        )
    }
    if (level === 5) {
        return (
            <div className={'container'}>
                <span className={'dot dangerous'}></span>
                <p>{title}</p>
            </div>
        )
    }
    return (
        null
    )
}

Circle.propTypes = {
    level: PropTypes.string,
    title: PropTypes.string
}

export default Circle