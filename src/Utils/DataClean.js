
import { getCovidData, getCountriesInfos, getWorldData, getCountries, getCountryData } from "../API/api";
import moment from "moment"



export const getCountryDataByDate = async () => {

    //1. get the countries population data and fix it
    var info = await getCountriesInfos().then(y => {
        return y.map(x => {

            return {
                code: fixMe(x.name),
                population: x.population,
                area: x.area,
                latlng: x.latlng,
                iso3: x.alpha3Code,
            }
        })
    }).then(x => {

        x.push({
            code: "Macedonia",
            population: 2077000,
            area: 67000,
            latlng: [41.67, 21.74],
            iso3: "MKD"
        })

        x.push({
            code: "Brunei",
            population: 428962,
            area: 5765,
            latlng: [4.53, 114.72],
            iso3: "BRN"
        })



        return x
    })

    console.log("dataClean info:", info);

    //3. add population to the countries data, using hashMap
    const hash = Object.assign({}, ...info.map(s => ({ [s.code]: s })));
    var allDates = []
    var rawData = await getCovidData("all")
        .then(y => {

            return y.filter(x => {
                return x.country != "Diamond Princess" && x.country != "MS Zaandam"
            })
        })
        .then(x => {
            allDates = getDates(x[0].timeline.cases)
            return fixProvience(x)
        })
        .then(data => {

            return data.map(x => {
                const cntryName = String(x.country).trim()

                if (hash[cntryName] == null) {
                    console.log(`${cntryName}.doesn't exists in hash`);
                } else {
                    return {
                        name: cntryName,
                        timeline: x.timeline,
                        population: hash[cntryName].population,
                        area: hash[cntryName].area,
                        lat: hash[cntryName].latlng[0],
                        lng: hash[cntryName].latlng[1],
                        iso3: hash[cntryName].iso3
                        //radius: Math.sqrt(hash[x.country].area) * 50000 * x.Active / hash[x.country].population
                    }
                }


            })

        })
        console.log("dataClean rawData:", rawData);

        //5. get country data by date
        var dataByDate = new Map()
        allDates.forEach(x => {
            dataByDate.set(x, [])
        })

        rawData.forEach(cntry => {

            const cases = cntry.timeline.cases
            const deaths = cntry.timeline.deaths
            const recovered = cntry.timeline.recovered

            for (let i = 0; i < cases.length; i++) {
                const data = {
                    name: cntry.name,
                    population: cntry.population,
                    area: cntry.area,
                    lat: cntry.lat,
                    lng: cntry.lng,
                    iso3: cntry.iso3,
                    cases: cases[i],
                    deaths: deaths[i],
                    recovered: recovered[i],
                    radCases: Math.sqrt(cntry.area) * 50000 * cases[i] / cntry.population,
                    radDeaths: Math.sqrt(cntry.area) * 50000 * deaths[i] / cntry.population,
                    radRecovered: Math.sqrt(cntry.area) * 50000 * recovered[i] / cntry.population,

                }
                dataByDate.get(allDates[i]).push(data)

            }

        });

    console.log("dataClean dataByDate", dataByDate);
    return dataByDate
}



export const getWorldDataByDate = async () => {
    // 6. get world data by date
    var worldData = await getCovidData("all", "world")


    var worldDataByDate = new Map()
    var wdDeaths = getPureData(worldData.deaths)
    var wdCases = getPureData(worldData.cases)
    var wdRecovered = getPureData(worldData.recovered)
    var wdDates = getDates(worldData.cases)

    for (let i = 0; i < wdDates.length; i++) {
        const date = moment(wdDates[i]).format("M/D/YY")
        // {key: date, val: { cases:num, death:num, recovered:num}}
        worldDataByDate.set(date, {
            cases: wdCases[i],
            deaths: wdDeaths[i],
            recovered: wdRecovered[i]
        })
    }

    return worldDataByDate
}




/* Helper functions */
// 4. helper function 1
function getPureData(data) {

    var arr = []
    Object.entries(data).forEach(x => {
        arr.push(x[1])
    })
    return arr
}

// 4. helper function 2
function getDates(data) {

    var arr = []
    Object.entries(data).forEach(x => {
        arr.push(x[0])
    })
    return arr
}
// 4. helper function 3 => return the data that contain provience==null
function fixProvience(arr) {

    var res = []

    // convert cases,... to pure values
    arr = arr.map(x => {
        return {
            country: x.country,
            province: x.province,
            timeline: {
                cases: getPureData(x.timeline.cases),
                deaths: getPureData(x.timeline.deaths),
                recovered: getPureData(x.timeline.recovered),
            }
        }
    })

    // make array of country names that have duplicates
    var d = new Map()
    arr.forEach(x => {
        if (d.has(x.country)) {
            d.set(x.country, 2)
        } else {
            d.set(x.country, 1)
        }
    });
    console.log("d:", d);
    console.log("arr: ", arr);

    d.forEach((v, k) => {
        const cntryName = k;
        const dupCnt = v
        // is not dup
        if (dupCnt == 1) {
            // just add to res
            res.push(arr.find(x => x.country == cntryName))
        }
        // is dup
        else {
            // if provinces = null <=> if any(provinces = null)
            if (arr.some(x => x.province == null && x.country == cntryName)) {
                // add only to res list
                res.push(arr.find(x => x.country == cntryName && x.province == null))

                // if provinces != null <=> if all(province != null)
            } else {
                const len = arr[0].timeline.cases.length
                // sum of all cases, deaths, recovered
                var cases = new Array(len).fill(0);
                var deaths = new Array(len).fill(0);
                var recovered = new Array(len).fill(0);

                // get all entrys with country name = countryName
                var tmpCountries = arr.filter(x => x.country == cntryName)

                // loop on all and make sums
                tmpCountries.forEach(prov => {
                    for (let i = 0; i < prov.timeline.cases.length; i++) {
                        cases[i] += prov.timeline.cases[i];
                        deaths[i] += prov.timeline.deaths[i];
                        recovered[i] += prov.timeline.recovered[i];
                    }
                });

                // build new object then add it to res list
                const countryObject = {
                    country: cntryName,
                    timeline: {
                        cases: cases,
                        deaths: deaths,
                        recovered: recovered,
                    }
                }

                res.push(countryObject)

            }
        }
    });

    return res
}

//2. fix the countries population data
const fixMe = (key) => {
    switch (key) {
        case "Russian Federation":
            return "Russia";

        case "Bolivia (Plurinational State of)":
            return "Bolivia"

        case "Bosnia and Herzegovina":
            return "Bosnia";

        case "Myanmar":
            return "Burma";

        case "Congo (Democratic Republic of the)":
            return "DRC";

        case "Czech Republic":
            return "Czechia";

        case "Iran (Islamic Republic of)":
            return "Iran";

        case "Korea (Democratic People's Republic of)":
            return "S. Korea";

        case "Republic of Kosovo":
            return "Kosovo";



        case "Libya":
            return "Libyan Arab Jamahiriya";


        case "Moldova (Republic of)":
            return "Moldova";


        case "Tanzania, United Republic of":
            return "Tanzania";

        case "United States of America":
            return "USA";

        case "United Kingdom of Great Britain and Northern Ireland":
            return "UK";


        case "United Arab Emirates":
            return "UAE";

        case "Venezuela (Bolivarian Republic of)":
            return "Venezuela";
        case "Viet Nam":
            return "Vietnam";


        case "Palestine, State of":
            return "West Bank and Gaza";

        default:
            return key;
    }

}
