'use client';

import { GoogleMap, InfoWindow, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useCallback, useState } from 'react';

import { type Dealer } from './dealer-card';

interface DealersMapProps {
  dealers: Dealer[];
}

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 33.9,
  lng: -118.1,
};

export function DealersMap({ dealers }: DealersMapProps) {
  const [selectedDealer, setSelectedDealer] = useState<Dealer | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? '',
  });

  const onLoad = useCallback(
    (mapInstance: google.maps.Map) => {
      setMap(mapInstance);

      // Fit bounds to show all dealers
      if (dealers.length > 0) {
        const bounds = new google.maps.LatLngBounds();

        dealers.forEach((dealer) => {
          if (dealer.coordinates) {
            bounds.extend({ lat: dealer.coordinates.lat, lng: dealer.coordinates.lng });
          }
        });
        mapInstance.fitBounds(bounds, 50);
      }
    },
    [dealers],
  );

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMarkerClick = (dealer: Dealer) => {
    setSelectedDealer(dealer);

    if (map && dealer.coordinates) {
      map.panTo({ lat: dealer.coordinates.lat, lng: dealer.coordinates.lng });
    }
  };

  if (loadError) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-2xl bg-gray-100 md:h-[500px]">
        <p className="text-gray-600">Error loading map</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-2xl bg-gray-100 md:h-[500px]">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#F92F7B] border-t-transparent" />
          <p className="text-gray-600">Loading map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[400px] overflow-hidden rounded-2xl shadow-lg md:h-[500px]">
      <GoogleMap
        center={defaultCenter}
        mapContainerStyle={mapContainerStyle}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: true,
          zoomControl: true,
        }}
        zoom={10}
      >
        {dealers.map((dealer) =>
          dealer.coordinates ? (
            <Marker
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: '#F92F7B',
                fillOpacity: 1,
                strokeColor: '#ffffff',
                strokeWeight: 2,
              }}
              key={dealer.id}
              onClick={() => handleMarkerClick(dealer)}
              position={{ lat: dealer.coordinates.lat, lng: dealer.coordinates.lng }}
            />
          ) : null,
        )}

        {selectedDealer?.coordinates && (
          <InfoWindow
            onCloseClick={() => setSelectedDealer(null)}
            position={{
              lat: selectedDealer.coordinates.lat,
              lng: selectedDealer.coordinates.lng,
            }}
          >
            <div className="max-w-[250px] p-1">
              <h3 className="mb-2 text-base font-bold text-gray-900">{selectedDealer.name}</h3>
              <p className="mb-1 text-sm text-gray-600">{selectedDealer.address}</p>
              <p className="mb-3 text-sm text-gray-600">
                {selectedDealer.city}, {selectedDealer.state} {selectedDealer.zip}
              </p>
              <a
                className="inline-block rounded-full bg-[#F92F7B] px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-[#e0256d]"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${selectedDealer.address}, ${selectedDealer.city}, ${selectedDealer.state} ${selectedDealer.zip}`)}`}
                rel="noopener noreferrer"
                target="_blank"
              >
                Get Directions
              </a>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
