# mapbox-viroreact-point-of-interest
<h1>Points of Interest</h1>
<p>A ReactViro + Mapbox integration for Navigate to one geoposition to another using Augmented Reality</p>

<h1>Instalation</h1>
<p>
  1.- <strong>Clone the repository : </strong>  <br />
  2.- <strong>Install modules : </strong> yarn install or mpn install; depending in how you manage your modules<br />
  3.- <strong>Get a Viro and Mapbox Token: <a href="https://viromedia.com/signup">ViroKey</a> and <a href="https://account.mapbox.com/auth/signup/">Mapbox</a></strong><br/>
  4.- Use your Viro Key and Mapbox Token in <strong>App.js</strong> where says "USE_YOUR_KEY_HERE" <br/>
  3.- Feel free to Use and Re-Use this code.
  
</p>

<h1>Inspiration</h1>
<p>Part of my university final proyect</p>


<h2>Important folders</h2>
<p>
api/ -> contais the pois and search method<br/>
screens/ -> contains the menu views or "screens" using 'react-navigation'<br/>
</p>
<h4>Important files</h4>
<p>
  App.js -> Main File.<br/>
  screens/HomeScreen.js -> Main screen contains search POI function<br/>
  screens/MapScreen.js -> contains a renderable map using Mapbox API. Renders the POI and the current location.<br/>
  screens/ArScreen.js -> Render the ViroPolyline that handles the AR pathway experience<br/>
  api/pois.js -> contains the points of interest with latitude and longitude<br/>
  api/index.js -> contains the method to search points<br/>
</p>
<h1>How it Works?</h1>
<p>
Using the search function inside 'api/index.js' you can search an specific POI (Point of Interes); since this proyect is used in my university proyect, the POIS are located inside the campus, but you can modify this file to put your POIS<br/>
Once the point is located in the searchbar select the point and the app prompt an alert to "show this point in the map", next the point is showed in the map using a pointer. So, there you have two buttons one to back to the searchbar and one to go to AR navigation.<br/> Because im using geoposition the async function to search for the point, this is gone to take a moment to activate the button to go to AR Navigation.<br/>

This use the Proj4 module to transform GPS points (latitude,longitude) to Cartesian Points (x,y,z) then use this (x,y,z) point to render the <a href="https://docs.viromedia.com/docs/viropolyline">ViroPolyline</a>.

</p>

<h1>Thanks</h1>
<p>Especial Thanks to <a href="https://github.com/ibesora">Isaac Besora</a> for share his knowledge and be patience</p>
