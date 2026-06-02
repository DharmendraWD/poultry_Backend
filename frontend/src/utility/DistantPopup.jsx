

// "use client";

// import { useState } from "react";
// import { CiLocationArrow1 } from "react-icons/ci";

// const FARM_LOCATION = {
//   lat:  27.701398696526553,
//   lng: 85.30601006152826,
// };

// function getDistanceKm(lat1, lon1, lat2, lon2) {
//   const R = 6371;
//   const dLat = ((lat2 - lat1) * Math.PI) / 180;
//   const dLon = ((lon2 - lon1) * Math.PI) / 180;
//   const a =
//     Math.sin(dLat / 2) ** 2 +
//     Math.cos((lat1 * Math.PI) / 180) *
//       Math.cos((lat2 * Math.PI) / 180) *
//       Math.sin(dLon / 2) ** 2;
//   return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
// }

// // Gets the best position by waiting for accuracy to improve.
// // On Chrome it resolves quickly; on Firefox/Brave it retries
// // up to maxWaitMs to get a reading below targetAccuracyM.
// function getBestPosition({ targetAccuracyM = 100, maxWaitMs = 8000 } = {}) {
//   return new Promise((resolve, reject) => {
//     if (!navigator.geolocation) {
//       reject(new Error("Geolocation not supported"));
//       return;
//     }

//     let best = null;
//     let settled = false;

//     const timer = setTimeout(() => {
//       navigator.geolocation.clearWatch(watchId);
//       if (best) resolve(best);
//       else reject(new Error("Timeout — no position received"));
//       settled = true;
//     }, maxWaitMs);

//     const watchId = navigator.geolocation.watchPosition(
//       (pos) => {
//         if (settled) return;

//         // Keep the most accurate reading seen so far
//         if (!best || pos.coords.accuracy < best.coords.accuracy) {
//           best = pos;
//         }

//         // Stop early once we're accurate enough
//         if (pos.coords.accuracy <= targetAccuracyM) {
//           clearTimeout(timer);
//           navigator.geolocation.clearWatch(watchId);
//           resolve(best);
//           settled = true;
//         }
//       },
//       (err) => {
//         if (settled) return;
//         clearTimeout(timer);
//         navigator.geolocation.clearWatch(watchId);
//         reject(err);
//         settled = true;
//       },
//       {
//         enableHighAccuracy: true, // triggers GPS on mobile, fine WiFi on desktop
//         timeout: maxWaitMs,
//         maximumAge: 0,           // never use a cached position
//       }
//     );
//   });
// }

// export default function DistancePopup() {
//   const [open, setOpen] = useState(false);
//   const [distance, setDistance] = useState(null);
//   const [accuracy, setAccuracy] = useState(null);
//   const [status, setStatus] = useState("idle"); // idle | locating | done | error
//   const [errorMsg, setErrorMsg] = useState("");

//   const handleCheck = async () => {
//     setStatus("locating");
//     setOpen(false);

//     try {
//       const pos = await getBestPosition({ targetAccuracyM: 100, maxWaitMs: 8000 });
//       const dist = getDistanceKm(
//         pos.coords.latitude,
//         pos.coords.longitude,
//         FARM_LOCATION.lat,
//         FARM_LOCATION.lng
//       );
//       setDistance(dist);
//       setAccuracy(Math.round(pos.coords.accuracy));
//       setStatus("done");
//       setOpen(true);
//     } catch (err) {
//       setStatus("error");
//       if (err.code === 1) {
//         setErrorMsg("Location permission denied. Please allow location access in your browser settings.");
//       } else if (err.code === 2) {
//         setErrorMsg("Could not determine your position. Make sure GPS or location services are enabled.");
//       } else {
//         setErrorMsg(err.message || "Unknown error");
//       }
//       setOpen(true);
//     }
//   };

//   const openMaps = () => {
//     window.open(
//       `https://www.google.com/maps/dir/?api=1&destination=${FARM_LOCATION.lat},${FARM_LOCATION.lng}`,
//       "_blank"
//     );
//   };

//   const close = () => {
//     setOpen(false);
//     setStatus("idle");
//   };

//   return (
//     <>
//       <button onClick={handleCheck} className="hero__cta" disabled={status === "locating"}>
//         <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
//           <CiLocationArrow1 />
//           {status === "locating" ? "Locating…" : "How far am I?"}
//         </span>
//       </button>

//       {open && (
//         <div style={overlay}>
//           <div style={modal}>

//             {/* Close X */}
//             <button onClick={close} style={closeX} aria-label="Close">✕</button>

//             {status === "error" ? (
//               <>
//                 <div style={emoji}>😕</div>
//                 <h2 style={{ ...title, color: "#e53935" }}>Location Unavailable</h2>
//                 <p style={desc}>{errorMsg}</p>
//                 <div style={btnGroup}>
//                   <button onClick={close} style={closeBtn}>Close</button>
//                 </div>
//               </>
//             ) : (
//               <>
//                 <div style={emoji}>{distance < 5 ? "🎉" : "📍"}</div>

//                 <h2 style={{ ...title, color: distance < 5 ? "#5bbf1a" : "#1e2d1e" }}>
//                   {distance < 5 ? "Wow! You're Super Close!" : "Thanks for checking"}
//                 </h2>

//                 <p style={desc}>
//                   You are{" "}
//                   <strong style={{ color: "#5bbf1a" }}>
//                     {distance < 1
//                       ? `${Math.round(distance * 1000)} m`
//                       : `${distance.toFixed(2)} km`}
//                   </strong>{" "}
//                   away from our poultry farm.
//                 </p>

//                 {/* Accuracy indicator — helps users understand readings differ by browser */}
//                 <p style={accuracyNote}>
//                   📡 Location accuracy: ±{accuracy} m
//                   {accuracy > 500 && (
//                     <span style={{ color: "#e07b00" }}>
//                       {" "}(low — try on mobile or allow GPS for a better reading)
//                     </span>
//                   )}
//                 </p>

//                 <div style={btnGroup}>
//                   <button onClick={openMaps} style={dirBtn}>🧭 Get Directions</button>
//                   <button onClick={close} style={closeBtn}>Close</button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// /* ── Inline styles (no external CSS dependency) ── */

// const overlay = {
//   position: "fixed",
//   inset: 0,
//   background: "rgba(0,0,0,0.55)",
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   zIndex: 9999,
//   padding: "16px",
// };

// const modal = {
//   position: "relative",
//   background: "#fff",
//   borderRadius: "20px",
//   padding: "48px 36px 36px",
//   maxWidth: "420px",
//   width: "100%",
//   textAlign: "center",
//   boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
// };

// const closeX = {
//   position: "absolute",
//   top: "14px",
//   right: "16px",
//   background: "none",
//   border: "none",
//   fontSize: "18px",
//   cursor: "pointer",
//   color: "#999",
//   lineHeight: 1,
// };

// const emoji = {
//   fontSize: "52px",
//   marginBottom: "12px",
// };

// const title = {
//   fontFamily: "var(--font-display, sans-serif)",
//   fontSize: "22px",
//   fontWeight: 800,
//   marginBottom: "12px",
//   lineHeight: 1.2,
// };

// const desc = {
//   fontSize: "15px",
//   color: "#555",
//   lineHeight: 1.6,
//   marginBottom: "8px",
// };

// const accuracyNote = {
//   fontSize: "12px",
//   color: "#888",
//   marginBottom: "24px",
//   lineHeight: 1.5,
// };

// const btnGroup = {
//   display: "flex",
//   gap: "12px",
//   justifyContent: "center",
//   flexWrap: "wrap",
// };

// const dirBtn = {
//   padding: "12px 24px",
//   background: "#5bbf1a",
//   color: "#fff",
//   border: "none",
//   borderRadius: "50px",
//   fontWeight: 700,
//   fontSize: "14px",
//   cursor: "pointer",
// };

// const closeBtn = {
//   padding: "12px 24px",
//   background: "#f0f0f0",
//   color: "#333",
//   border: "none",
//   borderRadius: "50px",
//   fontWeight: 600,
//   fontSize: "14px",
//   cursor: "pointer",
// };

"use client";

import { useState } from "react";
import { CiLocationArrow1 } from "react-icons/ci";

const FARM_LOCATION = {
  lat:  28.63025104472013,
  lng: 81.02070737301658,

};


// ── Get best GPS position ──────────────────────────────────
function getBestPosition({ targetAccuracyM = 100, maxWaitMs = 8000 } = {}) {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error("Geolocation not supported"));
      return;
    }
    let best = null;
    let settled = false;

    const timer = setTimeout(() => {
      navigator.geolocation.clearWatch(watchId);
      if (best) resolve(best);
      else reject(new Error("Timeout"));
      settled = true;
    }, maxWaitMs);

    const watchId = navigator.geolocation.watchPosition(
      (pos) => {
        if (settled) return;
        if (!best || pos.coords.accuracy < best.coords.accuracy) best = pos;
        if (pos.coords.accuracy <= targetAccuracyM) {
          clearTimeout(timer);
          navigator.geolocation.clearWatch(watchId);
          resolve(best);
          settled = true;
        }
      },
      (err) => {
        if (settled) return;
        clearTimeout(timer);
        navigator.geolocation.clearWatch(watchId);
        reject(err);
        settled = true;
      },
      { enableHighAccuracy: true, timeout: maxWaitMs, maximumAge: 0 }
    );
  });
}

// ── OSRM: real driving distance, 100% free, no API key ────
async function getDrivingDistance(originLat, originLng) {
  // OSRM expects: longitude,latitude (note the order)
  const url =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${originLng},${originLat};${FARM_LOCATION.lng},${FARM_LOCATION.lat}` +
    `?overview=false`;

  const res = await fetch(url);
  if (!res.ok) throw new Error("OSRM request failed");

  const data = await res.json();
  if (data.code !== "Ok" || !data.routes?.length) {
    throw new Error("No route found");
  }

  const route = data.routes[0];
  const distKm  = (route.distance / 1000).toFixed(1);   // metres → km
  const totalMin = Math.round(route.duration / 60);       // seconds → mins
  const hours   = Math.floor(totalMin / 60);
  const mins    = totalMin % 60;
  const durationText = hours > 0 ? `${hours} hr ${mins} mins` : `${mins} mins`;

  return {
    distanceText:  `${distKm} km`,
    distanceValue: route.distance,   // in metres
    durationText,
  };
}

export default function DistancePopup() {
  const [open, setOpen]           = useState(false);
  const [result, setResult]       = useState(null);
  const [userCoords, setUserCoords] = useState(null);
  const [status, setStatus]       = useState("idle");
  const [errorMsg, setErrorMsg]   = useState("");

  const handleCheck = async () => {
    setStatus("locating");
    setOpen(false);
    setResult(null);

    // Step 1 — get GPS
    let pos;
    try {
      pos = await getBestPosition({ targetAccuracyM: 100, maxWaitMs: 8000 });
      setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
    } catch (err) {
      setStatus("error");
      setErrorMsg(
        err.code === 1
          ? "Location permission denied. Please allow location access in your browser settings."
          : "Could not get your location. Make sure GPS / location services are enabled."
      );
      setOpen(true);
      return;
    }

    // Step 2 — get driving distance via OSRM
    setStatus("fetching");
    try {
      const driving = await getDrivingDistance(
        pos.coords.latitude,
        pos.coords.longitude
      );
      setResult(driving);
    } catch {
      // Fallback to straight-line if OSRM is unreachable
      const R = 6371;
      const dLat = ((FARM_LOCATION.lat - pos.coords.latitude) * Math.PI) / 180;
      const dLon = ((FARM_LOCATION.lng - pos.coords.longitude) * Math.PI) / 180;
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos((pos.coords.latitude * Math.PI) / 180) *
          Math.cos((FARM_LOCATION.lat * Math.PI) / 180) *
          Math.sin(dLon / 2) ** 2;
      const dist = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      setResult({
        distanceText:  `~${dist.toFixed(1)} km`,
        distanceValue: dist * 1000,
        durationText:  null,
        isFallback:    true,
      });
    }

    setStatus("done");
    setOpen(true);
  };

  const openMaps = () => {
    const base = `https://www.google.com/maps/dir/?api=1&destination=${FARM_LOCATION.lat},${FARM_LOCATION.lng}&travelmode=driving`;
    const url   = userCoords
      ? `${base}&origin=${userCoords.lat},${userCoords.lng}`
      : base;
    window.open(url, "_blank");
  };

  const close = () => { setOpen(false); setStatus("idle"); };

  const btnLabel =
    status === "locating" ? "Getting location…"
    : status === "fetching" ? "Calculating route…"
    : "How far am I?";

  const isClose = result && result.distanceValue < 5000;

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={handleCheck}
        className="hero__cta"
        disabled={status === "locating" || status === "fetching"}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <CiLocationArrow1 />
          {btnLabel}
        </span>
      </button>

      {/* Modal */}
      {open && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            <button onClick={close} style={styles.closeX} aria-label="Close">✕</button>

            {/* ── Error state ── */}
            {status === "error" && (
              <>
                <div style={styles.emoji}>😕</div>
                <h2 style={{ ...styles.title, color: "#e53935" }}>Location Unavailable</h2>
                <p style={styles.desc}>{errorMsg}</p>
                <div style={styles.btnRow}>
                  <button onClick={close} style={styles.closeBtn}>Close</button>
                </div>
              </>
            )}

            {/* ── Result state ── */}
            {status === "done" && result && (
              <>
                <div style={styles.iconCircle}>🚗</div>

                <h2 style={{ ...styles.title, color: isClose ? "#5bbf1a" : "#1e2d1e" }}>
                  {isClose ? "You're nearby! 🎉" : "Here's your route 📍"}
                </h2>

                <div style={styles.card}>
                  <div style={styles.cardRow}>
                    <span style={styles.cardLabel}>🚗 Driving distance</span>
                    <span style={styles.cardValue}>{result.distanceText}</span>
                  </div>
                  {result.durationText && (
                    <div style={styles.cardRow}>
                      <span style={styles.cardLabel}>⏱ Est. drive time</span>
                      <span style={styles.cardValue}>{result.durationText}</span>
                    </div>
                  )}
                  {result.isFallback && (
                    <p style={styles.fallback}>
                      ⚠️ Straight-line estimate — OSRM server unreachable
                    </p>
                  )}
                </div>

                <div style={styles.btnRow}>
                  <button onClick={openMaps} style={styles.dirBtn}>🧭 Get Directions</button>
                  <button onClick={close}    style={styles.closeBtn}>Close</button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}

/* ── Styles ─────────────────────────────────────────────── */
const styles = {
  overlay: {
    position: "fixed", inset: 0,
    background: "rgba(0,0,0,0.55)",
    display: "flex", alignItems: "center", justifyContent: "center",
    zIndex: 9999, padding: "16px",
  },
  modal: {
    position: "relative", background: "#fff",
    borderRadius: "20px", padding: "48px 32px 36px",
    maxWidth: "400px", width: "100%", textAlign: "center",
    boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
  },
  closeX: {
    position: "absolute", top: "14px", right: "16px",
    background: "none", border: "none",
    fontSize: "18px", cursor: "pointer", color: "#999",
  },
  iconCircle: {
    fontSize: "36px",
    width: "72px", height: "72px", borderRadius: "50%",
    background: "#f0fbe6",
    display: "flex", alignItems: "center", justifyContent: "center",
    margin: "0 auto 16px",
  },
  emoji: { fontSize: "52px", marginBottom: "12px" },
  title: {
    fontFamily: "var(--font-display, sans-serif)",
    fontSize: "20px", fontWeight: 800,
    marginBottom: "16px", lineHeight: 1.2,
  },
  desc: { fontSize: "14px", color: "#555", lineHeight: 1.6, marginBottom: "20px" },
  card: {
    background: "#f8f9fa", borderRadius: "12px",
    padding: "16px 20px", marginBottom: "24px",
    display: "flex", flexDirection: "column", gap: "12px",
  },
  cardRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardLabel: { fontSize: "13px", color: "#666" },
  cardValue: { fontSize: "17px", fontWeight: 800, color: "#5bbf1a" },
  fallback: { fontSize: "11px", color: "#e07b00", lineHeight: 1.5, textAlign: "left" },
  btnRow: { display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" },
  dirBtn: {
    padding: "12px 22px", background: "#5bbf1a",
    color: "#fff", border: "none", borderRadius: "50px",
    fontWeight: 700, fontSize: "14px", cursor: "pointer",
  },
  closeBtn: {
    padding: "12px 22px", background: "#f0f0f0",
    color: "#333", border: "none", borderRadius: "50px",
    fontWeight: 600, fontSize: "14px", cursor: "pointer",
  },
};