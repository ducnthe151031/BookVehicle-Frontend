// Move this to the top or a separate file
import {useEffect} from "react";
import {createTrackingLog} from "../service/authentication.js";
import {toast} from "react-toastify";

export const useTracking = (vehicleId, userId) => {
    useEffect(() => {

        const interval = setInterval(() => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    async (pos) => {
                        try {
                            const payload = {
                                vehicleId,
                                userId,
                                longitude: pos.coords.longitude,
                                latitude: pos.coords.latitude,
                            };
                            await createTrackingLog(payload);
                            console.log("Tracking sent:", payload);
                        } catch (error) {
                            console.error("Error sending tracking:", error);
                        }
                    },
                    (err) => {
                        toast.error("Không thể lấy vị trí: " + err.message);
                    }
                );
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [vehicleId, userId]);
}