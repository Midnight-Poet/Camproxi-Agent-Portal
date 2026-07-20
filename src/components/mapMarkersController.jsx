import { useEffect, useRef } from 'react';
import { importLibrary } from '@googlemaps/js-api-loader';

const MapMarkersController = ({ map, locations }) => {
	// Store active markers in a mutable ref to track them across renders without re-triggering loops
	const activeMarkersRef = useRef([]);

	useEffect(() => {
		if (!map || !locations) return;

		const renderMarkers = async () => {
			try {
				// 1. Fetch the official marker library functionally
				const { AdvancedMarkerElement } = await importLibrary('marker');

				// 2. Clear out any old markers existing from previous states
				activeMarkersRef.current.forEach((marker) =>
					marker.setMap(null),
				);
				activeMarkersRef.current = [];

				// 3. Loop through your locations array and plot pins
				// const newMarkers = locations.map((loc) => {
				const marker = new AdvancedMarkerElement({
					map: map,
					position: { lat: locations.lat, lng: locations.lng },
					// title: locations.title,
				});

				// Optional: Add a native click event listener to each pin
				marker.addListener('click', () => {
					alert(`You clicked on: ${loc.title}`);
				});

				// return marker;
				// });

				// Save references to the newly created markers
				activeMarkersRef.current = marker;
			} catch (error) {
				console.error('Failed to load or render markers:', error);
			}
		};

		renderMarkers();

		// 4. CLEANUP: Wipe pins from the map canvas when component unmounts
		return () => {
			activeMarkersRef.current.forEach((marker) => marker.setMap(null));
		};
	}, [map, locations]); // Re-runs smoothly whenever your location list updates

	return null; // This component handles map canvas mutations directly; no HTML UI needed
};

export default MapMarkersController;
