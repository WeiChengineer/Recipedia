import ReactCountryFlag from "react-country-flag"
import { Link } from "react-router-dom"

const CountryFlag = ({ countryCode, title ,slug }) => {
    return (
        <Link to={`/cuisine/cuisineDetail/${slug}`} className="w-full h-full ">
            <ReactCountryFlag
                countryCode={countryCode}
                svg
                style={{
                    width: '100%',
                    height: '100%',
                    cursor: 'pointer',
                }}
                title={title}
            />
        </Link>
    )
}

export default CountryFlag
