export const formatTime = (milliseconds) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`; 
};

export const getDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; 
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; 
  return distance;
};



//Haversine Formula 
// export function calculateDistance(coords) {
//     const toRadians = (degree) => degree * Math.PI / 180;
//     let totalDistance = 0;
  
//     for (let i = 1; i < coords.length; i++) {
//       const lat1 = coords[i - 1].latitude;
//       const lon1 = coords[i - 1].longitude;
//       const lat2 = coords[i].latitude;
//       const lon2 = coords[i].longitude;
  
//       const R = 6371; // Earth’s radius in kilometers
//       const dLat = toRadians(lat2 - lat1);
//       const dLon = toRadians(lon2 - lon1);
  
//       const a = 
//         Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//         Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * 
//         Math.sin(dLon / 2) * Math.sin(dLon / 2);
//       const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//       const distance = R * c;
  
//       totalDistance += distance;
//     }
  
//     return totalDistance;
//   }
//  export function calculateCalories(distance, time, userWeight) {
    
//     const MET = 9.8;
//     const timeHours = time / 3600000; 
//     const calories = MET * userWeight * timeHours; 
//     return calories.toFixed(0); 
// }