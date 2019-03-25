import React, {Component} from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { ListItem, SearchBar} from "react-native-elements";
import {getPois, contains} from '../api/index'
import _ from 'lodash';
//DATOS PARA ENVIAR
let arrayTest = [1,2,3];
let textHomeToMap = "Home to Map";
class HomeScreen extends React.Component {
    constructor(props) {
        super(props);

      this.state = {
          loading: false,
          data: [],
          error: null,
          query: "",
          fullData: [],
          placeholderText: " ¿ Qué estás buscando ? ",
          /** Parametros por defecto paras el POI */
          actualDataLocation: [],
          actualDataLat: -70.408542,
          actualDataLon: -23.679465,
          actualPoiName: "",
          actualPoiId:""
      };
    }
    componentDidMount(){
        this.makeRemoteRequest();
    }

    makeRemoteRequest = () => {
        this.setState(
            { 
                loading: true 
        });
        getPois(20,this.state.query)
        .then(pois => {
            this.setState({
            loading: false,
            data: pois,
            fullData: pois
            });
        })
        .catch(error => {
            this.setState({ error, loading: false });
            });
    };
    renderHeader = () => {
        const { query } = this.state;
        return <SearchBar 
            round
            lightTheme
            placeholder={this.state.placeholderText}
            cancelIcon={false}
            searchIcon={false}
            clearIcon={false}
            value={query}
            onChangeText={this.handleSearch}
            />;
    };
    handleSearch = text => {
        const data = _.filter(this.state.fullData, pois => {
            return contains(pois,text);
        });
        this.setState({query: text, data},() => this.makeRemoteRequest());
    };
    renderAnnotations () {
        return (
          
            <Mapbox.PointAnnotation
                key='pointAnnotation'
                id='pointAnnotation'
                coordinate={[this.state.actualDataLat,this.state.actualDataLon]}
                selected={false}
                title=''
                >
                <View style={styles.annotationContainer}>
                    <View style={styles.annotationFill}/>
                </View>
                <Mapbox.Callout title={this.state.actualPoiName}/>
            </Mapbox.PointAnnotation>
            
        )
    };
    renderMap(){
        return (
          <View style={styles.container}>
              <Mapbox.MapView
                  ref={(c) => this._map = c}
                  styleURL={Mapbox.StyleURL.Street}
                  zoomLevel={16}
                  centerCoordinate={[-70.408542,-23.679465]}
                  style={styles.container}
                  compassEnabled={true}
                  //showUserLocation={true}
                  //userTrackingMode={3}
                  >
                  {this.renderAnnotations()}
                  
              </Mapbox.MapView>
          </View>
        );
      };
      renderItem = ({ item }) => (

        <ListItem style={styles.listItemsFormat}
          title={item.name}
          leftAvatar={{ source: { uri: item.image } }}
          /**
           * Retorna objeto ITEM
           */
          onPress={()=>this.searchItem(item)}
          /*
          onPress={()=>{
            this._map.flyTo([-71.06017112731934, 42.36272976137689], 2500);
          }}
          */
        />
      );
      searchItem(item){
        this.setState({
          actualDataLocation: item.location,
          actualDataLat: item.location.lat,
          actualDataLon: item.location.lon,
          actualPoiName: item.name,
          actualPoiId: item.id,
        });
          this.toAR()
      };
      toAR(){
        Alert.alert(
          '¿Qué quieres hacer?',
          'Elije una opción',
          [
            {
              text: 'Volver',
              onPress: () => console.log('console.log("testAnything = Cancel Pressed'),
              style: 'cancel',
            },
            {
              text: 'Ver Punto en el Mapa', 
              onPress: () => this.toSeeMapHandle(),
            },
          ],
          {cancelable: false},
        );
      };
      toSeeMapHandle(){
        // 1. Navigate to the Details route with params 
              this.props.navigation.navigate('Map', {
                lat:this.state.actualDataLat,
                lon:this.state.actualDataLon,
                poiname: this.state.actualPoiName,
                arrayTestSend: arrayTest,
                textToMapScreen: textHomeToMap,
              });
      };

      render () {
        return (
          <View style={styles.container}>
            <FlatList
              keyExtractor={item => item.name}
              data={this.state.data}
              renderItem={this.renderItem}
              ListHeaderComponent={this.renderHeader}
            />
          </View>
        )
        
      }
    
  }
  

  const styles = StyleSheet.create({
    container: {
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
  export default HomeScreen;