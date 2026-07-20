import React, { useEffect, useRef, useState } from 'react';
// Import the new functional utilities instead of the Loader class
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';
// import dotenv from 'dotenv';

// dotenv.config()
// import { useEffect } from 'react';
// import { importLibrary } from '@googlemaps/js-api-loader';

const MapController = ({ google, map }) => {
	useEffect(() => {
		if (!google || !map) return;

		let markerInstance = null;

		const addMarker = async () => {
			// Import the marker library functionally
			const { AdvancedMarkerElement } = await importLibrary('marker');

			// Create the marker using the new class element
			markerInstance = new AdvancedMarkerElement({
				map: map,
				position: { lat: 6.5244, lng: 3.3792 },
				title: 'Sample Location',
			});
		};

		addMarker();

		// Clean up marker on component unmount
		return () => {
			if (markerInstance) markerInstance.map = null;
		};
	}, [google, map]);

	return null;
};

const MapContainer = ({ location, onAddressFetch }) => {
	const mapRef = useRef(null);
	const [googleInstance, setGoogleInstance] = useState(null);
	const [mapInstance, setMapInstance] = useState(null);
	const [geocoderInstance, setGeocoderInstance] = useState(null);

	// Explicitly tracking active markers in a ref prevents duplicate multi-render loops
	const activeMarkersRef = useRef([]);

	// Sample dynamic location coordinates array to map pins onto
	// const properties = [
	//     { id: 1, title: "Lodge Location A", lat: 9.536989, lng: 6.465372 },
	//     { id: 2, title: "Lodge Location B", lat: 9.545000, lng: 6.475000 },
	// ];

	useEffect(() => {
		// 1. FIX: Changed 'key' to 'apiKey' and hooked up the Vite env reference
		setOptions({
			apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
			version: 'weekly',
		});

		// 2. Use importLibrary to asynchronously pull in what you need
		const initializeMap = async () => {
			try {
				// Fetch the core 'maps' library AND the 'marker' library together
				const { Map } = await importLibrary('maps');
				const { Geocoder } = await importLibrary('geocoding');
				const { AdvancedMarkerElement } = await importLibrary('marker');

				setGoogleInstance(window.google);
				setGeocoderInstance(new Geocoder());

				// 3. Create your map instance
				const map = new Map(mapRef.current, {
					center: { lat: 9.536989, lng: 6.465372 },
					zoom: 13,
					disableDefaultUI: true,
					mapId: 'DEMO_MAP_ID',
				});

				setMapInstance(map);

				// 4. Clear out older marker pointers if re-running
				activeMarkersRef.current.forEach((marker) =>
					marker.setMap(null),
				);
				activeMarkersRef.current = [];
				const markers = new AdvancedMarkerElement({
					map: map,
					position: { lat: location.lat, lng: location.lng },
					title: location.title,
				});

				// Store active markers reference
				activeMarkersRef.current = [
					...activeMarkersRef.current,
					markers,
				];
			} catch (error) {
				console.error(
					'Error loading Google Maps API components:',
					error,
				);
			}
		};

		initializeMap();

		// Cleanup function to wipe markers from memory if component unmounts
		return () => {
			activeMarkersRef.current.forEach((marker) => marker.setMap(null));
		};
	}, []);

	// useEffect(() => {
	// 	if (!geocoderInstance || !location.lat) return;

	// 	const fetchStreetAddress = async () => {
	// 		const response = await geocoderInstance.geocode({
	// 			location: location,
	// 		});

	// 		if (response.results[0]) {
	// 			const exactAddress = response.results[0].formatted_address;

	// 			// 2. Call the parent's function to "send" the data back up
	// 			onAddressFetch(exactAddress);
	// 		}
	// 	};

	// 	fetchStreetAddress();
	// }, [location, onAddressFetch, geocoderInstance]);

	useEffect(() => {
		if (!mapInstance || !location) return;
		// 1. Smoothly glide the map center to the target pin
		mapInstance.panTo({ lat: location.lat, lng: location.lng });

		// 2. Optional: Adjust zoom closer if desired
		mapInstance.setZoom(15);
	}, [location?.lat, location?.lng, mapInstance]);

	return (
		<div className='w-full h-full relative'>
			<div
				ref={mapRef}
				className='w-full h-full min-h-[400px] rounded-md'
			/>
		</div>
	);
};

export default MapContainer;
