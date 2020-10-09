import axios from 'axios'

export const getCountries = async () => {

    const url = "https://api.covid19api.com/countries"
    try {
        const res = await axios.get(url)
        return res.data
    } catch (error) {
        console.log(error);
    }
}

export const getCountryData = async (country, stDate, enDate) => {

    const url = "https://api.covid19api.com/country/"
        + country +
        "/status/confirmed?from=" + stDate +
        "T00:00:00Z&to=" + enDate + "T00:00:00Z"
    try {
        const res = await axios.get(url)
        return res.data
    } catch (error) {
        console.log(error);
    }
}


export const getWorldData = async () => {
    const url = "https://api.covid19api.com/all";
    try {
        const res = await axios.get(url)
        console.log("getWorldData");
        return res.data
    } catch (error) {
        console.log(error);
    }
}

export const getAll_temp = async () => {
    const url = "https://disease.sh/v3/covid-19/countries"
    try {
        const res = await axios.get(url)
        return res.data
    } catch (error) {
        console.log(error);

    }
}

export const getCountriesInfos = async () => {
    const url = "https://restcountries.eu/rest/v2/all"
    console.log("getCountiresInfo");
    try {
        const res = await axios.get(url)
        return res.data
    } catch (error) {
        console.log(error);
    }
}
// 
export const getCovidData = async (lastDays, cntry = "null") => {
    cntry = String(cntry)
    var url = ""
    if (cntry === "world") {
        url = "https://disease.sh/v3/covid-19/historical/all?lastdays="
            + String(lastDays)
    } else {
        url = "https://disease.sh/v3/covid-19/historical" + (cntry === "null" ? "" : "/" + cntry) + "?lastdays="
            + String(lastDays)
    }
    console.log("getCovidData");
    console.log("url: ", url);
    try {
        const res = await axios.get(url)
        return res.data
    } catch (error) {
        console.log(error);
    }
}