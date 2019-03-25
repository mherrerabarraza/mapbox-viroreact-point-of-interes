import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-elements';
import _ from 'lodash';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import proj4 from 'proj4'

Mapbox.setAccessToken('USE_YOUR_KEY_HERE');
const MAPBOX_KEY = "USE_YOUR_KEY_HERE";
let MAPBOX_URL = ""; 
/** Variables para calculo de Polyline */
//Puntos polilyne para ArScreen para cálculo de polilyne
let pointsToDrawPolilyne = [];
//Punto GPS desde watchPosition()
let posCurrentLatLon = [];
//Punto GPS desde pois.js
let posDestinationLatLon = [];

//Datos Recibidos desde HomeScreen
let latitude,longitude,poiName = null;

class MapScreen extends React.Component {
  //Control the Lifecicle state of Async function
  _isMounted = false;
  constructor (props) {
    super(props)
    this.onPress()
    this.state = {
      selectedIndex: 3,
      buttonDisable: true,
      buttonLoading: true,
    }
    
    this.updateIndex = this.updateIndex.bind(this)
  }
  updateIndex (selectedIndex) {
    this.setState({selectedIndex})
  }

componentDidMount(){
  this.onPress();
  this._isMounted = true;
}
componentWillMount(){
  this._isMounted = false;
}


  /**
   * Obtencion de posicion actual para el calculo
   * de Polyline en ArScreen.js
   */

  buttonUpdate(actualPosition,watchIdRemove){
    if(actualPosition.timestamp !== 0){
      //Activate the button

      this.setState({ buttonDisable: false, buttonLoading: false });
      navigator.geolocation.clearWatch(watchIdRemove);
      posCurrentLatLon = [actualPosition.coords.longitude,actualPosition.coords.latitude];
      MAPBOX_URL = "https://api.mapbox.com/directions/v5/mapbox/walking/"+posCurrentLatLon[0]+","+posCurrentLatLon[1]+";"+posDestinationLatLon[0]+","+posDestinationLatLon[1]+".json?access_token="+MAPBOX_KEY+"&overview=simplified&geometries=geojson";
      this.calculatePointsToPolilyne(MAPBOX_URL);
    }else{
      console.log("testAnything =  Errror obteniendo posicion GPS");
    }
  }

  
  onPress(){
    watchPositionOptions = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0
    };
    watchId = navigator.geolocation.watchPosition(
      (position) => this.buttonUpdate(position,watchId),
      (err) => console.log("testAnything =  Errror obteniendo posicion GPS" + err),watchPositionOptions);     
  }

    render() {
      latitude = this.props.navigation.getParam('lat',123)
      longitude = this.props.navigation.getParam('lon',123)
      poiName = this.props.navigation.getParam('poiname','')
      posDestinationLatLon = [latitude,longitude]

      return (
        
        <View style={styles.container}>
          {this.renderMap(latitude,longitude,poiName)}
          <View style={styles.containerButton}>
              <View style={styles.buttonContainer}>
                <Button 
                  title= "Realidad Aumentada"
                  loading = {this.state.buttonLoading}
                  disabled={this.state.buttonDisable}
                  onPress={ () => this.arHandler() }
                    
                />
              </View>
              <View style={styles.buttonContainer}>
                <Button
                  title="Volver"
                  onPress={() => this.props.navigation.navigate('Home')}
                />
              </View>
            </View>

        </View>
        
      );
    }

    arHandler(){
      this.props.navigation.navigate('Ar',{
          toArScreen:pointsToDrawPolilyne,
        });
    };



    renderMap(lat,lon,poiName){
      return (
        <View style={styles.container}>
            <Mapbox.MapView
                ref={(c) => this._map = c}
                styleURL={Mapbox.StyleURL.Street}
                zoomLevel={17}
                centerCoordinate={[lat,lon]}
                style={styles.container}
                compassEnabled={true}
                showUserLocation={true}
                //Helping to get the user position with Tracking GPS options
                userTrackingMode={3}
                >
                
                {this.renderAnnotations(lat,lon,poiName)}
                
            </Mapbox.MapView>
        </View>
      );
    };
    renderAnnotations (annotationLat,annotationLon,annotationName) {
      return (
        
          <Mapbox.PointAnnotation
              key='pointAnnotation'
              id='pointAnnotation'
              coordinate={[annotationLat,annotationLon]}
              selected={true}
              title=''
              
              >
              <View style={styles.annotationContainer}>
                  <View style={styles.annotationFill}
                  />
              </View>
              <Mapbox.Callout 
                title={annotationName}
                
              />
              
          </Mapbox.PointAnnotation>
          
      )
    }

    /** 
     * LOGICA CALCULO DE ARRAY PARA VIROREACT 
     * Se habilita una vez que se ha encontrado la posicion actual
     * 
     * 1. Encontrar punto currentPosition()
     * 2. Encontrar ruta con todos los puntos con getRoute() 
     * 3. Transformar ruta de puntos GPS a puntos cartesianos
     * 4. Restar puntos cartesianos con generatePolilyneArray()
     * 5. Pasar arreglo hacia ArScreen y dibujar Polyline
     * 
     * 
     * */
    
    createObject(x,y,z){
      let createInitialPositionUTM = [];
      createInitialPositionUTM.x = x;
      createInitialPositionUTM.y = y;
      createInitialPositionUTM.z = z;
      return createInitialPositionUTM;
    }

    
    async calculatePointsToPolilyne(url){
      let auxDirections = [];
      let auxPointsUtm = [];
      let aux1 = [];
      let aux2 = [];
      let auxCurrentUtm = [];
      console.log("testAnything =  URL :", url);
      return fetch(url)
        .then((response) => response.json())
        .then((responseJson) => {
            //contiene la información devuelta por la consulta en URL_QUERY
            const directions = responseJson;
            //Retorna la ruta.
            auxDirections = directions['routes'][0]['geometry']["coordinates"];
            //transforma la ruta de GPS a UTM
            for (let i = 0; i < auxDirections.length; i++) {
              aux1.push(proj4(
                "EPSG:4326",
                "+proj=utm +zone=19 +ellps=GRS80 +units=m +no_defs",
                [auxDirections[i][0],auxDirections[i][1]]));
                auxPointsUtm[i] = this.createObject(aux1[i][0],0,aux1[i][1]);
            }
           //Resta punto inicial en UTM a puntos de ruta en UTM y lo almacena en el arreglo que 
            //se pasará a ArScreen
            aux2.push(proj4(
              "EPSG:4326",
              "+proj=utm +zone=19 +ellps=GRS80 +units=m +no_defs",
              [posCurrentLatLon[0],posCurrentLatLon[1]]));
              auxCurrentUtm.push(this.createObject(aux2[0][0],0,aux2[0][1]));
              for (let m = 0; m < auxCurrentUtm.length; m++) {
                for (let n = 0; n < auxPointsUtm.length; n++) {
                  pointsToDrawPolilyne.push(new this.createObject(auxPointsUtm[n].x-auxCurrentUtm[m].x,auxPointsUtm[n].y-auxCurrentUtm[m].y,auxPointsUtm[n].z-auxCurrentUtm[m].z));
                }
              }
                })
          .catch((error) => {
            console.log(error);
          });
    }
    polyPoints(route,gps){
      let aux = [];
      for (let i = 0; i<gps.length;i++) {
          for(let j = 0; j<route.length;j++){
              aux[j] = new caminoReal(route[j].x-gps[i].x,route[j].y-gps[i].y,route[j].z-gps[i].z);
          }
  
      }
      return aux;
    }
    
  }
  const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    containerButton: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      
    },
    buttonContainer: {
      flex: 1,
    },
    annotationContainer: {
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'white',
        borderRadius: 15,
    },
    annotationFill: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'orange',
        transform: [{ scale: 0.7 }],
    },
    listItemsFormat:{
      backgroundColor: "red"
    }
});
  export default MapScreen;


  