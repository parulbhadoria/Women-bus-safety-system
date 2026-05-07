export interface Coordinates {
  latitude: number;
  longitude: number;
}

export const getCurrentLocation = (): Promise<Coordinates> => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation is not supported by your browser"));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            reject(new Error("Location permission denied. Please enable location access in your browser settings and refresh the page."));
            break;
          case error.POSITION_UNAVAILABLE:
            reject(new Error("Location information is unavailable. Please check your device GPS."));
            break;
          case error.TIMEOUT:
            reject(new Error("Location request timed out. Please try again."));
            break;
          default:
            reject(new Error("An unknown error occurred while getting location."));
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  });
};

export const watchLocation = (
  onSuccess: (coords: Coordinates) => void,
  onError: (message: string) => void
): number => {
  if (!navigator.geolocation) {
    onError("Geolocation is not supported by your browser");
    return -1;
  }
  return navigator.geolocation.watchPosition(
    (position) => {
      onSuccess({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    },
    (error) => {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          onError("Location permission denied. Please enable location in browser settings and refresh.");
          break;
        case error.POSITION_UNAVAILABLE:
          onError("Location unavailable. Please check device GPS.");
          break;
        case error.TIMEOUT:
          onError("Location request timed out.");
          break;
        default:
          onError("Error getting location.");
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 15000,
      maximumAge: 5000,
    }
  );
};
