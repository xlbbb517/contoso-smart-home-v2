import { FormEvent, useEffect, useRef, useState, useCallback } from "react";
import { XIcon, CameraIcon } from "@heroicons/react/outline";

interface Props {
  onVideoClick: (dataUrl: string) => void;
  onClose: () => void;
}

export const Video = ({ onVideoClick, onClose }: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  const stopStream = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  }, [stream]);

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((mediaStream) => {
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      })
      .catch((err) => {
        console.log(err);
      });

    return stopStream;
  }, [stopStream]);

  const handleClick = (e: FormEvent) => {
    e.preventDefault();
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const dataUrl = canvasRef.current.toDataURL("image/png");
        onVideoClick(dataUrl);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
        >
          <XIcon className="w-6 h-6" />
        </button>
        <div className="flex flex-col items-center">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-[640px] h-[480px] bg-gray-200 rounded-lg"
          />
          <canvas
            ref={canvasRef}
            width="640"
            height="480"
            className="hidden"
          />
          <button
            onClick={handleClick}
            className="mt-4 bg-secondary-dark text-white px-4 py-2 rounded hover:bg-opacity-90 transition-colors flex items-center gap-2"
          >
            <CameraIcon className="w-6 h-6" />
            Take Photo
          </button>
        </div>
      </div>
    </div>
  );
};

export default Video;
