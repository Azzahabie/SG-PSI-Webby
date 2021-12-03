# Introduction

This Website was created using react and tested on Cypress.
The Website absorbs data from [gov.data](https://api.data.gov.sg/v1/environment/psi?date) before vomiting it onto the screen 🤮.

## Functions

### onload
On initial rendering the app will convert the current date is SG time to the format of yyyy-mm-dd so that it can be inserted into the api request.

Upon successful response it will proceed to call these functions in this order

setApiData(data.items) --> setCalender(false) --> setIsOpen(false) --> getAvg(data.items) --> setLoading(false)

## getAvg(data:[arr])
### Gets avg PSI from region / hourly time 
Loops through data and calculate average data before storing it in avgData state which will be used in the UI.

This function also sets the background color of the svg based on the average data calculated by looping through data and calling setBgColor()

## setBgColor(index:[int],range:[str])
### Sets bg color for svg
index param - takes in int from 0 to 4 where 0 is healthy and 4 is dangerous
range param - takes in string that relates back to css class

The function will check the index and stores the range into states where it will be used in classname to set the bg color of svg map and avg data.

## checkImpact(data:[int])
### sets the bg color of the td based on psi range
Takes in PSI level and returns bg color based on psi range which will be inserted into classname
