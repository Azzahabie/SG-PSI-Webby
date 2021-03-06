import './App.css';
import info from './info'
import Calendar from 'react-calendar';
import Modal from 'react-modal';
import RingLoader from "react-spinners/RingLoader";
import Circle from './components/circle/circle';
import React, { useEffect, useState } from 'react'
import { ToastContainer, toast } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';
const override = `
  position: absolute;
  top: 50%;
  left: 50%;
  right: auto;
  bottom: auto;
  margin-right: -50%;
  transform: translate(-50%, -50%);
`;
const App = () => {
  const [apiData, setApiData] = useState()
  const [value, onChange] = useState(new Date());
  const [showCalender, setCalender] = useState(false)
  const [westFill, setWest] = useState("default")
  const [eastFill, setEast] = useState("default")
  const [northFill, setNorth] = useState("default")
  const [southFill, setSouth] = useState("default")
  const [avgNationalColor, setAvgNationalColor] = useState("defaultColor")
  const [avgNorthColor, setAvgNorthColor] = useState("defaultColor")
  const [avgSouthColor, setAvgSouthColor] = useState("defaultColor")
  const [avgEastColor, setAvgEastColor] = useState("defaultColor")
  const [avgWestColor, setAvgWestColor] = useState("defaultColor")
  const [avgData, setAvgData] = useState()
  const [modalIsOpen, setIsOpen] = useState(false);
  const [testing, isTesting] = useState(false)
  let [loading, setLoading] = useState(true);

  useEffect(() => {
    if (testing) return
    setLoading(true)
    var myDate = `${value.getFullYear()}-${('0' + (value.getMonth() + 1)).slice(-2)}-${('0' + value.getDate()).slice(-2)}`
    fetch(`https://api.data.gov.sg/v1/environment/psi?date=${myDate}`)
      .then(res => res.json())
      .then(data => {
        setApiData(data.items)
        setCalender(false)
        setIsOpen(false)
        getAvg(data.items)
        setTimeout(() => {
          setLoading(false)
        }, 700);
      })
      .catch(err => {
        toast.error("Network Error Has Occurred")
        setLoading(false)
      })
  }, [value])

  useEffect(() => {
    if (!testing) return
    console.log("testing is true")
    setApiData(info.items)
    getAvg(info.items)
    setLoading(false)
    setCalender(false)
    setIsOpen(false)
    return () => {
      setCalender(false)
      setIsOpen(false)
      setLoading(false)
    }
  }, [value])

  function getAvg(data) {
    let nationalAvg = 0, northAvg = 0, southAvg = 0, eastAvg = 0, westAvg = 0
    let dataLength = data.length
    data.forEach((item, index) => {
      nationalAvg += item.readings.psi_twenty_four_hourly.national
      northAvg += item.readings.psi_twenty_four_hourly.north
      southAvg += item.readings.psi_twenty_four_hourly.south
      eastAvg += item.readings.psi_twenty_four_hourly.east
      westAvg += item.readings.psi_twenty_four_hourly.west
    })
    nationalAvg /= dataLength
    northAvg /= dataLength
    southAvg /= dataLength
    eastAvg /= dataLength
    westAvg /= dataLength

    let avgArr = [Math.floor(nationalAvg), Math.floor(northAvg), Math.floor(southAvg), Math.floor(eastAvg), Math.floor(westAvg)]
    setAvgData(avgArr)

    for (var i = 0; i < avgArr.length; i++) {
      if (avgArr[i] <= 50 && avgArr[i] >= 0) {
        // console.log(avgArr[i])
        setBgColor(i, "healthy")
      } else if (avgArr[i] >= 51 && avgArr[i] <= 100) {
        // console.log(avgArr[i])
        setBgColor(i, "moderate")
      } else if (avgArr[i] >= 101 && avgArr[i] <= 200) {
        // console.log(avgArr[i])
        setBgColor(i, "unhealthy")

      } else if (avgArr[i] >= 201 && avgArr[i] <= 300) {
        // console.log(avgArr[i])
        setBgColor(i, "very_unhealthy")
      } else if (avgArr[i] > 300) {
        // console.log(avgArr[i])
        setBgColor(i, "dangerous")
      } else {
        console.log("some error")
        console.log(avgArr[i])
      }
    }
  }

  function checkImpact(data) {
    if (data <= 50 && data >= 0) {
      return ("data_healthy")
    } else if (data >= 51 && data <= 100) {
      return ("data_moderate")
    } else if (data >= 101 && data <= 200) {
      return ("data_unhealthy")
    } else if (data >= 201 && data <= 300) {
      return ("data_very_unhealthy")
    } else if (data > 300) {
      return ("data_dangerous")
    } else {
      console.log("some error")
      console.log(data)
    }
  }

  function setBgColor(index, range) {
    if (index === 0) {
      setAvgNationalColor(`data_${range}`)
    }
    if (index === 1) {
      setNorth(range)
      setAvgNorthColor(`data_${range}`)
    } else if (index === 2) {
      setSouth(range)
      setAvgSouthColor(`data_${range}`)
    } else if (index === 3) {
      setEast(range)
      setAvgEastColor(`data_${range}`)
    } else if (index === 4) {
      setWest(range)
      setAvgWestColor(`data_${range}`)
    }
  }

  function setTableBG(data) {
    return checkImpact(data)
  }

  return (
    <div id="mainContainer">
      {/* checks if data is loading */}
      {loading ? <div id="ringBG"><RingLoader color={'#7c77b9'} loading={loading} css={override} size={150} /></div> :
        <>
          <div id="myHeader"><h2>Azzahabie's PSI Website</h2>
            <ToastContainer theme="dark" />
          </div>
          <div id="svgContainer">
            <svg viewBox="0 0 1113.12 574.33" id="mapSvg">
              <g id="West" className={westFill}>
                <path d="M810.94,487.32c-3.49-2.32-18.59-70.84-18.59-70.84-15.09-7-47.61-2.32-51.09-5.8s2.32-25.55,0-31.36-29-5.8-24.39-11.61-2.32-24.39-7-19.74-25.55,13.93-33.67,15.09-38.33,1.17-46.46-1.16-24.38-55.74-37.16-55.74c-46.45,0-39.48,44.13-45.29,55.74s-11.61,0-11.61,0-37.16,76.65-8.13,75.49,29,19.74,17.42,16.26-26.71-2.33-44.13,0S509,473.39,509,473.39s-19.74,4.64-30.19,10.45,7,13.93,30.19,39.48S504.35,540,504.35,540,474.16,507.06,466,497.77,455.58,514,455.58,529.13s-34.84,76.64-37.16,119.61,43,52.26,53.42,47.61S476.48,665,476.48,665h13.94l8.13-10.45s-19.74-10.45-33.68-22.07,0-17.42,0-17.42l19.74-5.8s37.16,49.93,51.1,34.24,139.35-26.11,137-34.24,19.74-32.52,19.74-32.52L682,613.9l4.65,10.45L741.26,636,762.16,622s4.65,25.55,15.1,20.91,7-65,5.8-66.2,10.46-17.42,1.17-17.42-7-15.09-11.62-19.32S768,523.32,768,513.19s23.22,9,36,12.46,27.87-20.91,27.87-20.91S814.42,489.65,810.94,487.32Z" transform="translate(-418.08 -218.33)" />
                <path d="M696,674.94c-8.52-.26-9-10.07-14.45-11.1s-7.23-16-8-16-5.17,2.32-5.17,2.32L662.16,646s-11.1,1.55-13.16-.51-4.13-4.65-5.16-3.1.26,3.35-2.07,2.06-4.38-4.38-6.71-5.16-2.32,2.58-4.64,4.65-3.87,1.29-3.87,5.68,4.9,1.29,5.42,9.8,3.87,14.2,6.45,16.52a4.39,4.39,0,0,0,5.42.26,7.46,7.46,0,0,1-4.13,5.93c-3.87,1.81-9.55-1.81-11.36-4.39s1-5.16,0-6.71-4.12.26-4.9-2.83-7.22-9.55-10.06-9.55-3.36,7-7.88,7-1.67,2.58-.94,5.93,1.85,4.13-.34,6.71,1.42,8.77,0,12.13-4.78,0-4.78,0,.78-8.52,0-12.65-4.64,0-7.48,4.65-8.52,7.48-8.52,7.48l-5.68-6.45s8.26-15,12.13-15.22,5.16-6.46,5.42-11.62,4.39-4.13,7-6.45,2.58-8.77,0-11.87-3.61,7.23-7.23,8-2.83-3.87-7.48,0a25.67,25.67,0,0,1-10.84,4.9l-65,44.13,25.55,47.74-3.36,4.13,21.68,14.71,7.48-2.32s4.65,2.07,2.33,16,3.09,16.77,3.09,16.77l27.87-25.29L585,736.1l-14.19,20.13-6.2-7,12.91-25.55L570.81,715l12.13-9.13s5.16,12.39,13.41,4.65,4.65.77,4.65,10.06-1,7,2.84,10.07,1.29,3.87,2.58,9.29,4.13,2.32,8,1.8,1.81-1.54,4.64-1,6.71.78,11.36-3.09,6.45-5.94,10.32-7,8.52,4.9,12.13,2.58-4.64-9.29-4.64-9.29l-.26-4.91a79.51,79.51,0,0,1-13.68-4c-8.77-3.25-3.35-9.13,2.32-17.59s7.49,8.21,9.81,11.56,14.71,5.94,18.32,7.74,8.26.26,13.68-5.42,2.32-7.48.77-10.84-1.29-5.16,6.71-4.13,9,7,16.52,4.65,7.74-9.81,10.32-12.9S704.48,675.19,696,674.94Z" transform="translate(-418.08 -218.33)" />
                <path d="M719.19,774.81" transform="translate(-418.08 -218.33)" />
              </g>
              <g id="South" className={southFill}>
                <path d="M1128.35,598c-3.48-1.93-9.67-11.61-10.45-13.55s-2.71-19.74-3.87-23.22-13.93-18.58-14.71-21.26-7.74-9.32-7.74-9.32L1076.1,528l-15.87-7.36s-20.52-9.29-22.46-9-26.32,2.8-27.48,1.57-12.77-6.51-13.55-9.2,2.71-21.31,2.71-22.86-25.93-19.95-25.93-19.95l-56.33,3.3-18,10.84s-15.46,15.49-14.69,17.81,13.94,7.74,19.36,8.67,17,2.19,17,2.19-11.22,12.75-14.71,12.75-15.87,0-21.68-1.16-20.9-4.26-23.22-5-14.32-4.26-22.07-6.56-15.09,1.91-19,3.07-3.88,4.26-10.07,6.13-8.13-5.74-14.71-9.2-14.32-3.12-22.84-2.19-7.74,7.59-10.45,14.17S764.48,543.45,766,550s8.13,13.16,9.29,27.1-3.48,25.16-5.8,31-13.17,20.51-13.17,20.51,2.71,2.71,6.59,7-1.17,4.65-1.55,8.13,8.9,11.61,8.9,11.61,12.77,7.36,13.16,10.07,0,3.87-2.71,7-4.64.78-9.29-4.32-4.26-2.64-7.74,0-20.13-2.64-20.13-2.64L740.1,672l49.16,27.87,12-23.61s48.77,20.51,51.09,25.93,14.71,11.23,15.1,9.29,4.26-2.71,15.1-5.8,4.26.77,12.77,7.35,15.49,3.87,26.71-3.48,29-5.42,32.52,3.48,8.13,5.81,8.13,4.65,1.55-2.33,4.64-3.49.78,3.49,10.84,5,0-2.32,0-4.25,1.16-11.23,1.55-17.21.77-7.18,3.48-7.18,11.62,8.9,15.87,6.89,19.75-10.76,24-15.79,0-5.42-2.32-11.23-5.8-2.71-11.61-7.36-7-4.64-8.13-8.51,2.32-1.94,5.81-4.26,0-4.64-2.71-8.37,3.48-9,5-17.18,3.48-2.32,5.81-5,2.71-4.25,8.9-2.31,1.16,8.51-.39,10.45-7.35,1.55-10.84,3.48,3.1,13.16,4.65,15.87,14.32,26.33,19.35,18.58,9.68-9.29,15.49-13.16,84-30.58,84-30.58l5.57-15.09S1131.84,600,1128.35,598Z" transform="translate(-418.08 -218.33)" />
                <path d="M949.13,730.81c3.87-1.55,7.74-3.87,7.66-5.42s-9.21-8.13-15.91-12.39-7.23-1.94-18.85,0,0,16.26,0,16.26,12.39,1.16,18.85,3.48S945.26,732.35,949.13,730.81Z" transform="translate(-418.08 -218.33)" />
                <path d="M962.68,738.55c-3.49,1.16-5.81,3.48-7.74,0s-1.55,0-10.46-3-7.35-.45-13.16-.06-14.32-1.16-18.58-5-8.9-7-13.16-7.42-25.16-.88-25.16-.88l-1.94-2.57c-6.41-3.65-2.71.8-1.93,4.68s9.68,6.58,13.16,9.42,11.61,9.54,19.35,11.09,5.81.39,6.2,8.91,12.5,12.77,12.5,12.77l11.89,5.42a43.21,43.21,0,0,1,5.41-5.81c3.1-2.71,4.26,5.81,7.36,3.87s8.9-7,13.58-12.77,6.16-10.45,8.48-16.74S966.16,737.39,962.68,738.55Z" transform="translate(-418.08 -218.33)" />
              </g>
              <g id="North" className={northFill}>
                <path d="M706.52,316c-.81-.52-3.07-4.91-1.26-11.36s1.55-8.77,0-14.19-2.07-6.19-9.29-15.48-14.45-6.71-26.84-7.75-34.84,12.91-41.81,17-26.84,23.22-26.84,23.22l-2.87,1.07,12.62,19.22,13.54,27.05s1.35,2.23,8.46,4.8,11.35-.27,16.25-2.07,3.87-1.29,10.07.51,6.19,2.32,10.06,0,5.16-1.29,10.58-3.09,13.68-8.78,20.13-11.88,3.36-13.16,7.2-18.06S707.32,316.48,706.52,316Z" transform="translate(-418.08 -218.33)" />
                <path d="M1140.16,381.28c-1.16-5.2-6.77-6.22-11.61-11.63s-2.52-3.49-4.86-6.59-1-7.16-.37-11.22a56.13,56.13,0,0,0,0-12.78c-.38-5-.38-2.51-2.71-1.93s-11,3.1-17,5-14.13,3.68-15.48,4.84-1.94,4.26-2.52,9.29-4.26,7.74-5.6,11.61-3.3,3.29-8.92,8.71-6,4.45-8.71,4.65-2.32-.78-1.16-3.29,4.65-2.91,8.13-6.39,6.2-5.23,9.1-8.71,1.35-7-1.36-7.55-15.29-3.67-18.19-5.22-8.71-2.13-9.48-1.16-2.71,6-3.1,2.32-6-2.52-10.26-5.42-3.87-6-11.42-13.36-17.8,0-19.5,0-5.08,11.81-5.08,11.81l-1.93,5.08c-1-.13-2.61.52-4.84,3.5A119.44,119.44,0,0,1,977,370.16c-4.13,3.36-14.19,7-15.48,11.1s-.78,4.13-4.73,3.09-1.73-2.83-2.5,1.55-.52,1.81-8.52,6.2-3.87.25-7,0-1.29-7-2.07-10.33-.26-2.06.52-4.12,3.87-3.88,1.29-4.39-5.16.26-10.84,2.32-4.65,5.42-5.94,2.58,2.33-6.19,3.88-11.1,3.09.52,12.12-1.8,10.58,5.42,19,6.19,12.73-8.51,16.34-11.61,4.39-5.68,3.87-8.26,5.94-9.55,9.81-15c2.22-3.11,4.62-7.51,7.48-11.86a52.07,52.07,0,0,1,7.23-9c6.45-6.19,3.35-9.29-2.58-17s-8.52-8.52-12.91-5.94-4.38,3.1-4.9,1.55,5.16-6.19,7-9.81-2.33-8.51-3.36-11.61-2.32-1.29-9.29-.52-5.16,2.84-9.55.78.26-2.07,5.94-3.1,4.39-4.38,6.19-9.29-10.84-11.09-21.24-15.48-4.56-1-6.63-4.65-6.19-1.55-9.81-3.87-.51-3.35-8.77-6.45-5.93-1-4.9-3.35,1.29-4.91-1.81-7.33-3.87-.93-8.26,8.1-3.35,3.35-7,1.81-9,6.45-9,6.45l-1.55-3.87s11.62-1.81,8.78-8-3.1-2.33-8.26-4-11.61,1.12-17,.34-6.45,0-13.94,0S853.9,229,853.9,229h-6.45l-5.93,3.87s-14.71,9.55-18.84,13.42-5.68,9.81-12.91,10.58-6.19,3.36-11.61,7.23-7,4.38-12.13,4.64-14.45,13.94-17.29,17-2.58,9.55-7.74,11.88-8.52-1-15.23-.26-5.67,1-11.09,1.29S727.19,294,723.06,292s-5.93,2.84-3.09,6.71,7.22,18.32,7.22,23.48S712.74,340,712.74,340l-1.48,7.27c10.9,2.89,5.61,20.47,5.14,22.18s23.7,6.42,24.86,9.9-1.11,24.41-.82,29.61-4,3.3,16.17,3.29a150.44,150.44,0,0,1,35.74,4.26l18.59,70.84s20.9,17.42,23.35,19.87,9.29,1.81,14.45,3.1S861.9,525,866.29,526.81s6.19-1.55,10.06-1.55,2.07,2.84,4.39,2.06,3.87-.26,3.1,4.13,2.84,1.55,6.19,4.39,5.94,4.39,9,4.16,2.84-6.23,4.65-9.58,8-2.58,13.68-3.1,13.42,1.81,20.38,0,4.91-5.42,4.39-10.32-9-7.74-12.9-15.2-5.42-1.57-9.81-3.38-3.61,1-8.77,1.81-7.49-2.33-11.1-3.1-.77-4.39,0-9.29,5.68-6.19,9.81-8.52,4.38-4.13,8-3.61,2.32-3.1,3.61-8.52a6.16,6.16,0,0,0,.18-2.7c1.6.88,3.56.19,4.72.57,1.75.59,22.45,6,34.1,8.33s25.13,17.42,25.13,17.42l4.64,5.61,7.75,26.9s12.77-3.09,15.67-1.16,9.49,1.74,9.49,1.74,12.19-5.22,19.93-.77a30.31,30.31,0,0,0,14.52,4.26s7.74,18,13.72,18,13-10.45,16.86-14.33,4.06-19.16-1-17.87-9.29-3.42-9.29-3.42l3.1-11.42s5.42,1.55,5-1.54,4.07-4.26,13.94-12,12.77-39.29,19.74-42,13.16-13.36,11.8-15.49-4.64-2.71-4.25-5.22,4.45-7.16,4.45-8.91a12.27,12.27,0,0,1,2.51-6.77c1.55-1.74,4.46-4.84,4.46-6.19s-.78-5.42,1.93-7.75S1141.32,386.48,1140.16,381.28Zm-246.89,37c0,.24.08.5.13.75A.78.78,0,0,1,893.27,418.31Zm4,15.34c.12-.26.23-.5.32-.75a9.79,9.79,0,0,0,1.59,2.6C897.42,435.4,896.67,434.82,897.26,433.65Zm19.35,11.87a4.71,4.71,0,0,1,0-2.62c0,.13.51,6.46,1.27,12C915.68,453.34,917.32,449.75,916.61,445.52Zm2.31,15.11c.09.4.19.77.29,1.1A2.94,2.94,0,0,1,918.92,460.63Z" transform="translate(-418.08 -218.33)" />
                <path d="M1023.45,318.29c5.16-3.35,7-9.55,15.49-5.42s18.58,6.45,21.93,11.36-1.29,7.22-3.1,9.8-7,9.29-8,10.07-4.64,5.67-9,0-8.77-14.28-12.64-14.88-12.85-1.38-10.68-5A19.79,19.79,0,0,1,1023.45,318.29Z" transform="translate(-418.08 -218.33)" />
                <path d="M1066.55,329.22s20.64,6.88,19.35,12-1.8,9.29-4.38,10.06-11.1,1.29-15-1-8.26-4.9-10.58-4.9S1066.55,329.22,1066.55,329.22Z" transform="translate(-418.08 -218.33)" />
              </g>
              <g id="East" className={eastFill}>
                <path d="M1420.1,489.13c-7.23-5.16-16.78-12.39-19.87-13.16s-14.46-5.16-14.46-5.16,2.84-3.62-3.61,1.8-11.1,4.91-11.1,4.91a18.09,18.09,0,0,1-3.87-3.62,5.06,5.06,0,0,0-4.9-2.06l-2.58-1s-.68.66-1.68,1.71c-2.89,3.06-8.44,9.41-7.87,12.48.78,4.13,2.32,3.61,2.32,8.52s.18,7.48-2.36,11.35-6.67,7.23-7.18,10.07a35.92,35.92,0,0,1-4.39,10.58c-2.07,3.35-4.65,8-3.87,12.64s-1.57,4.13-.14,8.52-1.67,9.55,3.23,5.42,4.65-4.13,5.42-7,1.71-.78,3.7-6.19a54.55,54.55,0,0,0,2.76-11.36c.51-2.84-1.3-1.81,2.32-4.64s7.22-4.65,7.74-8,2.58-8.73,2.84-11,0-11.25,2.32-5.31.26,9.51,0,13.53-3.61,5.56-2.32,7.37,2.58,0,4.64-1.81.78-2.58,3.36-2.58,3.61-4.38,9.8,0,9.55,7.49,10.07,4.13-3.87-6.48,0-7.11,4.39.66,5.68-3.21,1.8-7.48,1.29-10.32-.26-4.91-2.07-6.71-9-7-3.09-5.94,5.67,2.58,7.48,2.84,1.81-7,3.87-1,4.65,7.48,5.42,9-4.39.52.77,1.55,2.33,3.1,5.17,1,0-3.87,2.58-5.93S1427.32,494.29,1420.1,489.13Z" transform="translate(-418.08 -218.33)" />
                <path d="M1407.71,567.06c-2.32-8-18.06,1.81-33.29,2.07s-22.45.52-35.36,5.16-9.8-.26-18.32-1.81-4.64-4.13-3.87-7.22-4.9-3.87-9.81-9.29,5.17-9,9.29-25,7.49-18.84,10.84-25,1.81-6.19,7.49-11.87,3.61-10.06,4.13-14.45,7.74-21.68,9.29-26.32-4.65-6.45-7.49-11.61-9.8-22.2-9.8-26.84-6.71-8-15-8.52-28.39-1.81-42.32-1.29-13.42,14.19-17.29,16.52-1.81,5.93-2.58,11.09-28.13-3.35-48.26-6.19-15-10.32-22.2-14.19-5.42-13.17-16.77-22.2-32.26,19.87-32.26,19.87-2.9,3.29-4.9,5.16-2.84,3.36-2.45,7,2,10.82-5.29,18.25c-7.43,7.6-4,2.63-7,9.34s-3.84,6.66-3.84,11.31-10.07,11.87-11.62,19.61-9.74,5.74-13.93,12.91c-2.81,4.8-4.41,1.84-5.94,7.48s-2.32,10.58,1.68,11.33,8.65-.23,10.19,8.8-9.29,14.45-6.71,16S1101.9,557,1106,558.81s-1.8,18.58-1.55,27.35,8,23.23,14.2,24,7-.26,13.67-1.81,4.13,0,4.39,2.33,1.55,6.19,6.71,8.26,6.45-.26,16-4.39,4.65-2.58,18.32-3.1,10.07-3.35,16.52-9.29,15.48-2.32,22.19-.77,9,1.8,13.17-4.39,9.29-3.61,23.74-7,14.45-3.35,15.74-3.35,5.11,4.13,5.11,4.13,13.21-5.68,14.5,2.58,5.68,4.9,13.68.77,5.93,3.61,16,5.42,15.48,2.84,21.68-1.81,12.13-3.87,23.22-7,13.16,4.64,14.71,5.16,3.87,4.9,11.62,9,2.06-.52,4.64-1.81-2.32-3.09-3.87-5.16-4.65-5.93-5.42-11.61,3.1.26,9.55-1.55,4.9,8.26,6.71,14.71,7,2.84,6.45,0-2.06-8.52,3.1-10.32,3.09-7.49,3.09-7.49A75,75,0,0,1,1407.71,567.06Z" transform="translate(-418.08 -218.33)" />
                <path d="M1154.29,333.52v2.06l.52-1.26Z" transform="translate(-418.08 -218.33)" />
                <path d="M1311.45,367.84l-.14,0C1311.42,367.92,1311.45,367.84,1311.45,367.84Z" transform="translate(-418.08 -218.33)" />
                <path d="M1172.1,353.13c5.93.26,8,.53,10.84-1.15s4.9-3.24,5.67-3.24-2.84.13-1.55,4.58,3.1,4.71,7.49,6.26,7.74,1.81,10.84,3.1,0,.51,1.55,5.16,4.12,12.13,5.93,3.87,1.29-18.58,2.58-9.55-.51,8.69,1.55,13.25,2.84,8.17,9,10,17.55,2.06,24.52,0S1258,382.81,1265,380s2.32-5.68,4.9-7.23,2.84-1.8,5.94-2.06,5.42,1.55,10.06,2.58,9.81,1.55,15.23-1.55a34.37,34.37,0,0,1,10.18-3.85c-.21-.11-.72-.8-1.92-3.89-1.81-4.65,0-2.07.51-7.49s.78-3.35-.51-7.22-.52-6.45-5.68-6.45-16.26.77-19.61,1.8-22.2-7-29.42-4-23.23,5.78-29.68,0-19.35-9-29.42-11.38-22.19-11.7-28.39-6.54-9.8,3.78-10.58,6.54a53.79,53.79,0,0,1-1.8,5.1c2.46,3.79,3.52,5.36,5.93,8.74C1163.32,346.68,1166.16,352.87,1172.1,353.13Z" transform="translate(-418.08 -218.33)" />
                <path d="M1530.75,357.77l-3-5.42h2.58s1-3.87,0-6.7-7.48-13.42-13.42-18.84a72.34,72.34,0,0,0-15-10.07c-1.55-.77-9.29-.77-20.9-1.55s-5.16-2.32-13.16-3.87-7.74.78-8.26,3.87,0,0-5.16,1.55-26.84.52-26.58,3.1,0,3.1-2.58,5.93-9,1.81-16,1.81-12.39-2.32-12.39,1.55,1.55,11.35,3.36,16.52l1.54,5.93-6.71,2.41s.26,2.75,1.73,2.75,4.73-.51,3.18,5.68-3.62,3.1-3.1,8.52,8,8.51,8,8.51,8.52,3.1,10.58,5.68,2.32,5.93,2.32,9.55,8,7.48,9.29,11.61,6.2,6.19,17,18.32c6.89,7.72,6,9.27,5.56,9.51a5.68,5.68,0,0,1,1.4,0c4.65.52,2.07.78,9.55-5.68s1.29-3.09,7.49-8.25,7-4.65,12.38-4.65,9-1.81,15.75-7,4.64-1.29,7.48.52,10.32,1.29,15.48-3.1,7.75-34.32,7-36.64,4.13-2.33,4.59-3.1S1530.75,357.77,1530.75,357.77Z" transform="translate(-418.08 -218.33)" />
                <path d="M1449.66,434.12c-.19,0-.12.07,0,0Z" transform="translate(-418.08 -218.33)" />
              </g>
            </svg>
          </div>
          <h2 id="dateChosen">{`${value.toDateString()}`}</h2>
          {/* Loops though avg data and prints avg data */}
          {avgData === undefined ? null :
            <div id="averageDataContainer">
              <div className={`avgDiv ${avgNationalColor}`}>
                <h3>National Avg</h3>
                <h4>{avgData[0]} PSI</h4>
              </div>
              <div className={`avgDiv ${avgNorthColor}`}>
                <h3>North Avg</h3>
                <h4>{avgData[1]} PSI</h4>
              </div>
              <div className={`avgDiv ${avgSouthColor}`}>
                <h3>South Avg</h3>
                <h4>{avgData[2]} PSI</h4>
              </div>
              <div className={`avgDiv ${avgEastColor}`}>
                <h3>East Avg</h3>
                <h4>{avgData[3]} PSI</h4>
              </div>
              <div className={`avgDiv ${avgWestColor}`}>
                <h3>West Avg</h3>
                <h4>{avgData[4]} PSI</h4>
              </div>
            </div>
          }
          <div id="btn_calendarContainer">
            <button className={'button1'} onClick={() => setIsOpen(true)}>Choose Date</button>
            <Modal
              isOpen={modalIsOpen}
              onRequestClose={() => setIsOpen(false)}
              className="Modal"
              overlayClassName="Overlay"
            >
              <h2 style={{ color: '#d3d4d9' }}>Pick a Date</h2>

              <Calendar
                onChange={onChange}
                value={value}
                maxDate={new Date()}
                minDate={new Date(2016, 1, 8)}
                class={'c1'}
              />
              <button onClick={() => setIsOpen(false)} id="closeBTN">Close</button>
            </Modal>

          </div>
          <div id="rangeContainer">
            <Circle level={1} title='Healthy' />
            <Circle level={2} title='Moderate' />
            <Circle level={3} title='Unhealthy' />
            <Circle level={4} title='Very-Unhealthy' />
            <Circle level={5} title='Dangerous' />
          </div>
          <div id="chartContainer">
            {/* check if there is any data else return empty table */}
            {apiData == null ?
              <div id="tableContainer">
                <table>
                  <tbody>
                    <tr>
                      <th>Time</th>
                      <th>National</th>
                      <th>North</th>
                      <th>South</th>
                      <th>East</th>
                      <th>West</th>
                    </tr>
                    <tr>
                      <th>SGT</th>
                      <td colSpan="5" id="PSI">PSI</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              :
              <div id="tableContainer">
                <table>
                  <tbody>
                    <tr>
                      <th>Time</th>
                      <th>National</th>
                      <th>North</th>
                      <th>South</th>
                      <th>East</th>
                      <th>West</th>
                    </tr>
                    <tr>
                      <td className={'purp'}>SGT</td>
                      <td colSpan="5" id="PSI" className={'purp'}>PSI</td>
                    </tr>
                    {/* loops through api data arr and prints it */}
                    {apiData.map((item, index) => {
                      return (
                        <tr key={index}>
                          <td className={'purp'}>{new Date(item.timestamp).toLocaleTimeString('en-US', { timeZone: 'Asia/Singapore', hour: 'numeric', minute: 'numeric', hour12: true })}</td>
                          <td className={setTableBG(item.readings.psi_twenty_four_hourly.national)}>{item.readings.psi_twenty_four_hourly.national}</td>
                          <td className={setTableBG(item.readings.psi_twenty_four_hourly.north)}>{item.readings.psi_twenty_four_hourly.north}</td>
                          <td className={setTableBG(item.readings.psi_twenty_four_hourly.south)}>{item.readings.psi_twenty_four_hourly.south}</td>
                          <td className={setTableBG(item.readings.psi_twenty_four_hourly.east)}>{item.readings.psi_twenty_four_hourly.east}</td>
                          <td className={setTableBG(item.readings.psi_twenty_four_hourly.west)}>{item.readings.psi_twenty_four_hourly.west}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            }
          </div>
          <div id="myFooter"></div></>}
    </div>
  )
}

export default App

