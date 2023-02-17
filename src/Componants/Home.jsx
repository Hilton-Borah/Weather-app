import { Box, Flex, Image, Input, InputGroup, InputLeftElement, Text } from '@chakra-ui/react';
// import { Box } from '@chakra-ui/react';
import React from 'react'
import "./Home.css"
import { useState } from 'react';
import { useEffect } from 'react';
import { BsCloudHaze1 } from "react-icons/bs"
import { AiFillCloud } from "react-icons/ai"
import { BsFillCloudFogFill } from "react-icons/bs"
import { BsFillCloudLightningRainFill } from "react-icons/bs"
import { BsFillCloudSunFill } from "react-icons/bs"
import { BiCurrentLocation } from "react-icons/bi"
import {IoLocationSharp} from "react-icons/io5";
import {TiWeatherWindyCloudy} from "react-icons/ti"

const Home = () => {
    const [text, setText] = useState("")
    const [temperature, setTemperature] = useState("")
    const [temperature1, setTemperature1] = useState("")
    const [temperature2, setTemperature2] = useState("")
    const [temperature3, setTemperature3] = useState("")
    const [forcastdata, setForcastData] = useState([])
    const [forcastdatatemp, setForcastDataTemp] = useState([])
    const [forcastDataWeather, setForcastWeather] = useState([])
    const [forcastDatadate, setForcastDate] = useState([])


    const handleChange = (e) => {
        setText(e.target.value)
    }

    function getLocation() {
        navigator.geolocation.getCurrentPosition(success);
        function success(pos) {
            const crd = pos.coords;

            // console.log('Your current position is:');
            // console.log(`Latitude : ${crd.latitude}`);
            // console.log(`Longitude: ${crd.longitude}`);
            // console.log(`More or less ${crd.accuracy} meters.`);

            getWeatherOnlocation(crd.latitude, crd.longitude);
            forecastWeather(crd.latitude, crd.longitude)
        }
    }

    function getWeatherOnlocation(lat, lon) {
        let url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=e81000c73aede87affc03976d2a3a5a4`

        fetch(url).then(function (res) {
            // console.log(res)
            return res.json()
        }).then(function (res) {
            setTemperature1(res)
            setTemperature(res.main)
        }).catch(function (error) {
            console.log(error)
        })

    }

    const forecastWeather = (lat, lon) => {
        let url = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&appid=e81000c73aede87affc03976d2a3a5a4`

        fetch(url).then(function (res) {
            // console.log(res)
            return res.json()
        }).then(function (res) {
            setTemperature2(res)
            setTemperature3(res.list)
            // setTemperature(res.main)
        }).catch(function (error) {
            console.log(error)
        })
    }

    let id ;

    function debounce(func, delay) {
        // document.querySelector("#movies").innerText=""
        if (id) {
            clearTimeout(id)
        }
        id = setTimeout(function () {
            func()
        }, delay);
    }


    useEffect(() => {
        const fetchApi = async () => {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${text}&units=metric&appid=e81000c73aede87affc03976d2a3a5a4`
            const res = await fetch(url)
            const resJson = await res.json()
            setTemperature1(resJson)
            setTemperature(resJson.main)
        }
        {
            !temperature1.name ? getLocation() : debounce(fetchApi,1000)
        }
    }, [text])

    useEffect(() => {
        const forCast = () => {
            for (let i = 0; i < temperature3.length; i++) {
                if (temperature3[i].dt_txt[11] === "1" && temperature3[i].dt_txt[12] === "2") {
                    setForcastData((forcast) => [...forcast, temperature3[i]])
                    setForcastDataTemp((dum) => [...dum, temperature3[i].main.temp])
                    setForcastWeather((dum) => [...dum, temperature3[i].weather[0].main])
                    setForcastDate((dum) => [...dum, temperature3[i].dt_txt.slice(0, 10)])
                }
            }
        }
        forCast()
    }, [temperature3])

    const weatherStatus = (status) => {
        if (status === "Clouds") {
            return <AiFillCloud />
        } else if (status === "Mist") {
            return <BsFillCloudFogFill />
        } else if (status === "Haze") {
            return <BsCloudHaze1 />
        } else if (status === "Clear") {
            return <BsFillCloudSunFill />
        } else if (status === "Rain") {
            return <BsFillCloudLightningRainFill />
        } else {
            return <TiWeatherWindyCloudy/>
        }
    }



    let map = `https://maps.google.com/maps?q=${temperature1.name}&t=&z=13&ie=UTF8&iwloc=&output=embed`

    return (
        <Flex display={"flex"} justifyContent={"center"} alignItems={"center"}>
        <Box className='firstBox'>
            <Text fontSize={"3xl"} fontFamily={"monospace"} marginBottom={"20px"} marginTop={"20px"}>Weathopedia</Text>
            {/* <Input className='firstInput' w={"360px"} height={"30px"} variant={"unstyled"} value={text} onChange={handleChange} placeholder="Enter your cityname" /> */}
            <InputGroup>
                <InputLeftElement
                    pointerEvents='none'
                    children={<IoLocationSharp color='gray.300' marginLeft={"20px"} />}
                />
                <Input className='firstInput' w={"360px"} height={"40px"} variant={"unstyled"} value={text} onChange={handleChange} placeholder="Enter a cityname" />
            </InputGroup>
            <iframe className='firstIframe' src={map}></iframe>
            <Flex className='firstFlex'><BiCurrentLocation /><Text fontSize={"20px"}>{temperature1.name}</Text></Flex>
            {
                !temperature ? <Text>No data found</Text> :
                    <Box>
                        <Box>
                            <Flex w={"340px"} m="auto" marginBottom="10px" marginTop={"10px"}>
                                <Box fontSize={"15px"} borderRight={"1px solid"} paddingRight="20px" textAlign={"left"}>
                                    <Text>Temp {temperature.temp}° Cel</Text>
                                    <Text>Wind {temperature1.wind.speed} mph</Text>
                                </Box>
                                <Flex fontSize={"25px"} alignItems={"center"} gap={"5px"} paddingLeft="20px">
                                    <Text>{weatherStatus(temperature1.weather[0].main)}</Text>
                                    <Text textAlign={"left"}>{temperature1.weather[0].main}</Text>
                                </Flex>
                                {/* <Image src={"./Images/101867-global-warming.gif"} className={"gif"}/> */}
                            </Flex>
                            <Flex fontSize={"13px"} w={"340px"} m={"auto"}>
                                <Text>Max {temperature.temp_max}° Cel  |  Min {temperature.temp_min}° Cel</Text>
                            </Flex>
                        </Box>
                        <Text w={"360px"} margin={"auto"} mt={"25px"}>Forecast of next five days weather in your region</Text>
                        <Flex w={"360px"} margin={"auto"} mt={"20px"}>
                            <Box className='boxLast'>
                                <Text className='fontLast'>{weatherStatus(forcastDataWeather[0])}</Text>
                                <Text className='weaLast'>{forcastDataWeather[0]}</Text>
                                <Text className='tempLast'>{forcastdatatemp[0]}° Cel</Text>
                                <Text className='dateLast'>{forcastDatadate[0]}</Text>
                            </Box>
                            <Box className='boxLast'>
                                <Box className='fontLast'>{weatherStatus(forcastDataWeather[1])}</Box>
                                <Text className='weaLast'>{forcastDataWeather[1]}</Text>
                                <Text className='tempLast'>{forcastdatatemp[1]}° Cel</Text>
                                <Text className='dateLast'>{forcastDatadate[1]}</Text>
                            </Box>
                            <Box className='boxLast'>
                                <Box className='fontLast'>{weatherStatus(forcastDataWeather[2])}</Box>
                                <Text className='weaLast'>{forcastDataWeather[2]}</Text>
                                <Text className='tempLast'>{forcastdatatemp[2]}° Cel</Text>
                                <Text className='dateLast'>{forcastDatadate[2]}</Text>
                            </Box>
                            <Box className='boxLast'>
                                <Box className='fontLast'>{weatherStatus(forcastDataWeather[3])}</Box>
                                <Text className='weaLast'>{forcastDataWeather[3]}</Text>
                                <Text className='tempLast'>{forcastdatatemp[3]}° Cel</Text>
                                <Text className='dateLast'>{forcastDatadate[3]}</Text>
                            </Box>
                            <Box className='boxLast'>
                                <Box className='fontLast'>{weatherStatus(forcastDataWeather[4])}</Box>
                                <Text className='weaLast'>{forcastDataWeather[4]}</Text>
                                <Text className='tempLast' >{forcastdatatemp[4]}° Cel</Text>
                                <Text className='dateLast'>{forcastDatadate[4]}</Text>
                            </Box>
                        </Flex>
                    </Box>
            }
            <Flex w={"360px"} display={"flex"} alignItems="center" justifyContent={"center"} textAlign="center" m={"auto"} fontSize="13px" lineHeight={"15px"} marginTop={"20px"} marginBottom={"10px"}>
                Designed and build by Hilton Kumar Borah, 2022 All rights reserved.
            </Flex>
        </Box>
        </Flex>
    )
}

export default Home
