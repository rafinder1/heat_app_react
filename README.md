# HEATER FRONTEND

The Heater Frontend project has been developed as part of a master's thesis in sustainable construction at the Military University of Technology in Warsaw.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

In the project directory, you can run:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Overview

This React-based frontend application is designed to provide two distinct modules for temperature calculation and cost optimization of walls. The application interfaces with a Django backend, which handles requests and supplies the necessary data. The backend repository can be found [here](https://github.com/rafinder1/heater-backend-django).

![image](https://github.com/rafinder1/heater-frontend-react/assets/102503112/925a1299-6d29-429d-840d-c2cca70668d9)

### Module 1: Temperature Calculation in Walls

To initiate temperature calculations, users must input essential information, including climatic zone, boundary condition, heating element power, room surface area, material type, material category, and thickness. Upon providing accurate data, the application generates a graphical representation illustrating the temperature distribution within the wall.

![image](https://github.com/rafinder1/heater-frontend-react/assets/102503112/5c5503f4-aa1c-485e-b10d-7ba0a72303f8)
![image](https://github.com/rafinder1/heater-frontend-react/assets/102503112/cc5990a7-7154-42f9-8316-949e9d14cb42)
![image](https://github.com/rafinder1/heater-frontend-react/assets/102503112/554f6b0d-fd0d-4278-8d27-94a44b5d0d13)


### Module 2: Wall Cost Optimization

For cost optimization calculations, users need to input details such as climatic zone, desired temperature, heating element power, and room surface area. The wall layers are selected from drop-down lists similar to Module 1. After inputting the required data, the application generates a table proposing types of insulation that best suit the wall, taking into account both performance and cost considerations.

![image](https://github.com/rafinder1/heater-frontend-react/assets/102503112/1e0fe0c1-2bb1-42df-84c0-82d4a8601a9a)
![image](https://github.com/rafinder1/heater-frontend-react/assets/102503112/08ea5e93-bf3b-4613-b82a-08652b3e94b5)


### Add-on: Styrofoam Cost Calculation

An additional feature in Module 2 allows users to estimate the cost and quantity of styrofoam required based on the wall's surface area.

![image](https://github.com/rafinder1/heater-frontend-react/assets/102503112/59d80baf-6996-45fa-9f53-dd9559d092b0)

