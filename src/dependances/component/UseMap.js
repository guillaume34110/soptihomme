import React, { useRef, useState, useEffect } from 'react';
import mapboxgl  from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import axios from 'axios';
import { sports } from './DataBase';



// Be sure to replace this with your own token
mapboxgl.accessToken = 'pk.eyJ1IjoiYmdoamZ1eWd5Z3lrZ2ZpdWsiLCJhIjoiY2tscnlqMjNvMWhwYTJ2cW1pZ3M3bjVxOCJ9.lpv7e-L2IISfCOUpoKpDkQ';

export default function Map({
    center,
    zoom = 5,
    width = '100%',
    height = '100vh',
    //onInit,
}) {

    const ref = useRef(null);
    const [map, setMap] = useState(null);
    
    //const [data, setdata] = useState([]);
    //let data =[];
    //let corners =[];
    useEffect(() => {
        // Don't create the map until the ref is connected to the container div.
        // Also don't create the map if it's already been created.
        const markers = [];
        let corners =[];
        let data =[];
        const favList = [];

        if (ref.current && !map) {
            const map = new mapboxgl.Map({
                container: ref.current,
                style: 'mapbox://styles/mapbox/streets-v11',
                center,
                zoom,
            });
            setMap(map);
            //onInit(map);
            const nav = new mapboxgl.NavigationControl();
            map.addControl(nav, "top-right");


            const geolocate = new mapboxgl.GeolocateControl({
                positionOptions: {
                    enableHighAccuracy: true
                },
                trackUserLocation: true
            });
            map.addControl(geolocate)
            map.on("load", function () {
                geolocate.trigger();
            });
            function fav(event) {
                const id = event.target.id
                let token = 0;
                for (let i = 0; i < favList.length; i++) {
                    if (favList[i] === id) {
                        favList.splice([i], 1);
                        token++
                        for (let i = markers.length - 1; i >= 0; i--) {
                            markers[i].remove();
                            markers.splice(i, 1)
                        }
                    }
                }
                if (token === 0) {
                    favList.push(id)
                    
                    for (let i = markers.length - 1; i >= 0; i--) {
                        markers[i].remove();
                        markers.splice(i, 1)
                    }
                }

            }

            //nav MARKER
            //const marker = new mapboxgl.Marker()
            //.setLngLat()
            // .addTo(map);

            document.querySelector('.sport-form').addEventListener('click', getCorner)
            window.addEventListener('click', getCorner)
            map.on("mousedown", getCorner);
            map.on("mouseup", getCorner);
            map.on("dblclick", getCorner);
            map.on("wheel", getCorner);
            map.on('sourcedata', getCorner);
            function getCorner() {
                 corners = map.getBounds()

                let favori = document.querySelector('.fav-btn')
                if (favori !== null) {
                    favori.addEventListener('click', fav)
                }
                let token = 0;
                for (let i = 0; i < sports.length; i++) {
                    if (sports[i].isChecked === true)
                        token = 1
                }
                if (token === 1) {
                    axios.post(`https://sportihome.com/api/spots/getAllMarkersInBounds/${corners._sw.lng},${corners._sw.lat}/${corners._ne.lng},${corners._ne.lat}`)
                        .then((res) => {


                            data = res.data;
                            checkData();
                        })

                }else{
                checkData();
                }
            }

            const checkData = () => {
               
                while (markers.length > 100) {

                    markers[0].remove();
                    markers.splice(0, 1)
                }
                
                for (let i = 0; i < markers.length; i++) {
                    if ((corners._ne.lng > markers[i]._lngLat.lng && corners._ne.lat > markers[i]._lngLat.lat) && (corners._sw.lng < markers[i]._lngLat.lng && corners._sw.lat < markers[i]._lngLat.lat)) {
                    } else {
                        markers[i].remove();
                        markers.splice(i, 1)
                    }
                }
                for (let i = 0; i < data.length; i++) {
                    for (let j = 0; j < sports.length; j++) {
                        if ((data[i].hobby === sports[j].reqName) && (sports[j].isChecked === true)) {
                            //nav MARKER
                            let noMarker = 0;
                            let el = document.createElement('div');
                            let favAtribute = 0;
                            for (let f = 0; f < favList.length; f++) {
                                if (favList[f] === data[i]._id) {
                                    favAtribute = 1
                                }
                            }
                            if (favAtribute === 1) {
                                el.className = ` icon  ${data[i].hobby} fav-icon`
                            } else if (favAtribute === 0 && sports[j].fav === false) {
                                el.className = ` icon ${data[i].hobby}`;

                            } else {
                                noMarker = 1
                            }
                            if (noMarker === 0) {
                                const marker = new mapboxgl.Marker(el)
                                    .setLngLat(data[i].loc.coordinates)
                                    .setPopup(new mapboxgl.Popup({
                                        offset: 25
                                    }) // add popups
                                        .setHTML(`<button  class = "fav-btn" id="${data[i]._id}">favoris</button>` + '<h2>' + data[i].name + '</h2><p>' + sports[j].value + '</p><p class = "about">' + data[i].about + '</p>'))

                                if (markers.length === 0) {
                                    marker.addTo(map);
                                    markers.push(marker)
                                }

                                let markerToken = 0;
                                for (let x = 0; x < markers.length; x++) {
                                    if (markers[x]._lngLat.lng === marker._lngLat.lng
                                        && markers[x]._lngLat.lat === marker._lngLat.lat) {
                                        markerToken++
                                    }
                                }
                                if (markerToken === 0) {
                                    marker.addTo(map);
                                    markers.push(marker)
                                }
                            }
                        }

                        if (data[i].hobby === sports[j].reqName && sports[j].isChecked === false && markers !== null) {
                            for (let i = 0; i < markers.length; i++) {
                                if (markers[i]._element.classList[1] === sports[j].reqName) {
                                    markers[i].remove();
                                    markers.splice(i, 1)
                                }
                            }
                        } else if (data[i].hobby === sports[j].reqName && markers !== null && sports[j].fav === true) {
                            for (let i = 0; i < markers.length; i++) {
                                if (markers[i]._element.classList[1] === sports[j].reqName && markers[i]._element.classList[2] !== 'fav-icon') {
                                    markers[i].remove();
                                    markers.splice(i, 1)
                                    
                                }
                            }
                        }
                    }
                }
            }

        }
    }, [ ref, center, zoom, map, /*onInit*/]);
    return <div ref={ref} style={{ width, height }} />;

}
