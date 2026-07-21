import { useEffect, useRef } from "react";

function CameraPreview() {

    const videoRef = useRef(null);

    useEffect(() => {

        async function startCamera() {

            try {

                const stream = await navigator.mediaDevices.getUserMedia({

                    video: true,

                    audio: false

                });

                if (videoRef.current) {

                    videoRef.current.srcObject = stream;

                }

            }

            catch (error) {

                console.log(error);

                alert("Please allow camera access.");

            }

        }

        startCamera();

        return () => {

            if (videoRef.current?.srcObject) {

                videoRef.current.srcObject
                    .getTracks()
                    .forEach(track => track.stop());

            }

        };

    }, []);

    return (

        <video

            ref={videoRef}

            autoPlay

            playsInline

            muted

            className="w-full h-[350px] rounded-3xl bg-black object-cover shadow-xl"

        />

    );

}

export default CameraPreview;